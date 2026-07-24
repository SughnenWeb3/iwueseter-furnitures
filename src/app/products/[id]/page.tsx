import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProductGallery from "./ProductGallery";
import EnquiryForm from "./EnquiryForm";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(price: unknown): string {
  const n = Number(price);
  if (!n) return "Contact for price";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  type ProductWithCategory = Awaited<ReturnType<typeof prisma.product.findUnique>> & {
    category: { id: string; name: string; slug: string; createdAt: Date } | null;
  };
  type RelatedProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

  let product: ProductWithCategory | null = null;
  let related: RelatedProduct[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }) as ProductWithCategory | null;
  } catch {
    product = null;
  }

  if (!product) notFound();

  try {
    related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: { id: product.id },
      },
      take: 3,
      include: { category: true },
    });
  } catch {
    related = [];
  }

  const specs = [
    { label: "Dimensions", value: product.dimensions },
    { label: "Material", value: product.material },
    { label: "Category", value: product.category?.name },
    { label: "Price", value: formatPrice(product.price) },
  ].filter((s) => s.value);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Collection</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/products?category=${product.category.slug}`}>
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className={styles.breadcrumbCurrent}>{product.title}</span>
          </nav>

          <div className={styles.productLayout}>
            {/* Gallery */}
            <div className={styles.galleryCol}>
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* Details */}
            <div className={styles.detailsCol}>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className={styles.categoryTag}
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className={styles.title}>{product.title}</h1>

              <div className={styles.price}>{formatPrice(product.price)}</div>

              <div className="divider" />

              <p className={styles.description}>{product.description}</p>

              {/* Specs */}
              {specs.length > 0 && (
                <div className={styles.specs}>
                  <h3 className="label-caps" style={{ marginBottom: 16 }}>Specifications</h3>
                  <dl className={styles.specsList}>
                    {specs.map((spec) => (
                      <div key={spec.label} className={styles.specItem}>
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Value Props */}
              <div className={styles.valueProps}>
                <div className={styles.valueProp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>10-Year Structural Warranty</span>
                </div>
                <div className={styles.valueProp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span>Free Delivery in Abuja and Lagos</span>
                </div>
                <div className={styles.valueProp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                  </svg>
                  <span>Bespoke Customisation Available</span>
                </div>
              </div>

              {/* Enquiry Form */}
              <EnquiryForm productTitle={product.title} productId={product.id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className="container">
              <div className="section-header" style={{ marginBottom: 40 }}>
                <span className="label-caps">You May Also Like</span>
                <h2>Related Pieces</h2>
              </div>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    price={Number(p.price) || 0}
                    images={p.images}
                    category={p.category?.name}
                    material={p.material || undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
