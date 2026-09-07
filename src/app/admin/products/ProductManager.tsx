"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import styles from "./page.module.css";

type Category = { id: string; name: string };
type Product = {
  id: string; title: string; description: string; price: number | null;
  dimensions: string | null; material: string | null; images: string[];
  categoryId: string; categoryName: string; updatedAt: string;
};
type Draft = Omit<Product, "id" | "categoryName" | "updatedAt">;
const emptyDraft = (categoryId = ""): Draft => ({ title: "", description: "", price: null, dimensions: "", material: "", images: [], categoryId });

export default function ProductManager({ products: initialProducts, categories, user }: { products: Product[]; categories: Category[]; user: { name?: string | null; email?: string | null } }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(categories[0]?.id));
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(() => products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase())), [products, query]);

  const openCreate = () => { setEditing(null); setDraft(emptyDraft(categories[0]?.id)); setImageInput(""); setMessage(""); };
  const openEdit = (product: Product) => { setEditing(product); setDraft({ title: product.title, description: product.description, price: product.price, dimensions: product.dimensions || "", material: product.material || "", images: product.images, categoryId: product.categoryId }); setImageInput(""); setMessage(""); };
  const closeEditor = () => { setEditing(null); setDraft(emptyDraft(categories[0]?.id)); setImageInput(""); setMessage(""); };

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const endpoint = editing ? `/api/products/${editing.id}` : "/api/products";
    const response = await fetch(endpoint, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setMessage(result.error || "Could not save the product."); return; }
    const product: Product = { id: result.id, title: result.title, description: result.description, price: result.price ? Number(result.price) : null, dimensions: result.dimensions, material: result.material, images: result.images, categoryId: result.categoryId, categoryName: result.category.name, updatedAt: result.updatedAt };
    setProducts((current) => editing ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]);
    closeEditor();
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (!response.ok) { setMessage("Could not delete the product."); return; }
    setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  function addImage() { const url = imageInput.trim(); if (url && !draft.images.includes(url)) { setDraft({ ...draft, images: [...draft.images, url] }); setImageInput(""); } }
  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setMessage("");
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Could not upload the images."); return; }
      setDraft((current) => ({ ...current, images: [...current.images, ...result.urls.filter((url: string) => !current.images.includes(url))] }));
    } catch {
      setMessage("Could not upload the images. Please check your connection and try again.");
    } finally { setUploading(false); }
  }
  const editorOpen = editing !== null || draft.title !== "" || draft.description !== "";

  return <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}><span className={styles.logoText}>Iwueseter</span><span className={styles.logoSub}>Admin</span></div>
      <nav className={styles.sidebarNav}>
        <Link href="/admin/dashboard" className={styles.navLink}>Dashboard</Link>
        <Link href="/admin/products" className={`${styles.navLink} ${styles.navActive}`}>Manage products</Link>
        <Link href="/products" className={styles.navLink} target="_blank">View store ↗</Link>
      </nav>
      <div className={styles.sidebarUser}><div className={styles.userAvatar}>{(user.name || user.email || "A").charAt(0).toUpperCase()}</div><div className={styles.userInfo}><span className={styles.userName}>{user.name || "Admin"}</span><span className={styles.userEmail}>{user.email}</span></div><button onClick={() => signOut({ callbackUrl: "/admin/login" })} className={styles.signOutBtn}>Sign out</button></div>
    </aside>
    <main className={styles.main}>
      <header className={styles.topBar}><div><p className={styles.eyebrow}>Catalogue</p><h1 className={styles.pageTitle}>Products</h1><p className={styles.pageSubtitle}>Create, update and remove pieces in your collection.</p></div><button className="btn btn-primary" onClick={openCreate}>Add product</button></header>
      {message && <p className={styles.notice} role="alert">{message}</p>}
      {editorOpen && <section className={styles.editor}><div className={styles.editorHeader}><div><h2>{editing ? "Edit product" : "New product"}</h2><p>Changes are published to the collection immediately.</p></div><button className={styles.closeButton} onClick={closeEditor} aria-label="Close editor">×</button></div>
        <form onSubmit={saveProduct} className={styles.form}>
          <label>Product name<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
          <label>Category<select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Price (₦)<input type="number" min="0" value={draft.price ?? ""} onChange={(event) => setDraft({ ...draft, price: event.target.value ? Number(event.target.value) : null })} /></label>
          <label>Material<input value={draft.material || ""} onChange={(event) => setDraft({ ...draft, material: event.target.value })} placeholder="e.g. Iroko wood" /></label>
          <label className={styles.fullWidth}>Description<textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Dimensions<input value={draft.dimensions || ""} onChange={(event) => setDraft({ ...draft, dimensions: event.target.value })} placeholder="e.g. 210 × 90 × 75 cm" /></label>
          <div className={`${styles.imageField} ${styles.fullWidth}`}><span>Product images</span><div className={styles.uploadRow}><label className={styles.uploadButton}> <input type="file" accept="image/*" multiple onChange={(event) => uploadImages(event.target.files)} disabled={uploading} />{uploading ? "Uploading…" : "Choose from device"}</label><small>Choose one or more images from your phone or computer (max. 10 MB each).</small></div><div className={styles.imageAdd}><input value={imageInput} onChange={(event) => setImageInput(event.target.value)} placeholder="Or paste an image URL" type="url" /><button type="button" onClick={addImage}>Add link</button></div><div className={styles.imageList}>{draft.images.map((image) => <div className={styles.imageChip} key={image}><img src={image} alt="Product preview" /><button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter((item) => item !== image) })} aria-label="Remove image">×</button></div>)}</div></div>
          <div className={`${styles.formActions} ${styles.fullWidth}`}><button type="button" className="btn btn-outline" onClick={closeEditor}>Cancel</button><button disabled={saving} className="btn btn-primary" type="submit">{saving ? "Saving…" : editing ? "Save changes" : "Create product"}</button></div>
        </form>
      </section>}
      <section className={styles.catalogue}><div className={styles.catalogueHeader}><strong>{products.length} product{products.length === 1 ? "" : "s"}</strong><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" /></div><div className={styles.productGrid}>{filteredProducts.map((product) => <article className={styles.productCard} key={product.id}><div className={styles.productImage}>{product.images[0] ? <img src={product.images[0]} alt={product.title} /> : <span>No image</span>}</div><div className={styles.productBody}><p>{product.categoryName}</p><h2>{product.title}</h2><strong>{product.price ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(product.price) : "Price on request"}</strong><div className={styles.cardActions}><button onClick={() => openEdit(product)}>Edit</button><button className={styles.deleteButton} onClick={() => deleteProduct(product)}>Delete</button></div></div></article>)}</div>{filteredProducts.length === 0 && <div className={styles.empty}>No products found.</div>}</section>
    </main>
  </div>;
}
