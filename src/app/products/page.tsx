import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

async function getProducts(category?: string, search?: string) {
  try {
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return products.map(p => ({
      ...p,
      price: Number(p.price) || 0,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        ...p.category,
        createdAt: p.category.createdAt.toISOString(),
      } : null,
    }));
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return categories.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, search } = params;

  const [products, categories] = await Promise.all([
    getProducts(category, search),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className="container">
            <span className="label-caps">Our Work</span>
            <h1 className={styles.pageTitle}>
              The Collection
            </h1>
            <p className={styles.pageDesc}>
              Each piece is a collaboration between nature, skill, and vision.
              Explore our curated range of handcrafted furniture.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterSection}>
                <h3 className="label-caps" style={{ marginBottom: 16 }}>Filter by Room</h3>
                <ul className={styles.filterList}>
                  <li>
                    <a
                      href="/products"
                      className={`${styles.filterLink} ${!category ? styles.filterActive : ""}`}
                    >
                      <span>All Rooms</span>
                      <span className={styles.filterCount}>{products.length}</span>
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`/products?category=${cat.slug}`}
                        className={`${styles.filterLink} ${category === cat.slug ? styles.filterActive : ""}`}
                      >
                        <span>{cat.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className={styles.content}>
              {/* Search bar */}
              <form className={styles.searchForm} action="/products" method="GET">
                {category && <input type="hidden" name="category" value={category} />}
                <input
                  type="search"
                  name="search"
                  defaultValue={search || ""}
                  placeholder="Search furniture..."
                  className={`form-input ${styles.searchInput}`}
                  id="product-search"
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "14px 24px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>

              {/* Results info */}
              <div className={styles.resultsInfo}>
                <p>
                  Showing{" "}
                  <strong>{products.length}</strong>{" "}
                  {products.length === 1 ? "piece" : "pieces"}
                  {category && (
                    <> in <em>{categories.find((c) => c.slug === category)?.name}</em></>
                  )}
                  {search && <> matching &ldquo;<em>{search}</em>&rdquo;</>}
                </p>
              </div>

              {/* Grid */}
              {products.length > 0 ? (
                <div className={styles.grid}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={Number(product.price) || 0}
                      images={product.images}
                      category={product.category?.name}
                      material={product.material || undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <h3>No pieces found</h3>
                  <p>
                    {search
                      ? `No results for "${search}". Try a different search term.`
                      : "This collection is being curated. Please check back soon."}
                  </p>
                  <a href="/products" className="btn btn-outline">
                    View All Pieces
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
