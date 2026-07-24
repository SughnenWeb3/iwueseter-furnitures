import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
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
  } catch { return []; }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    return categories.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));
  } catch { return []; }
}

const categoryImages: Record<string, string> = {
  "living-room": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  "bedroom":     "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
  "dining-room": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800",
  "office":      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main>

        {/* ══════════════ HERO SLIDER ══════════════ */}
        <HeroSlider />

        {/* ══════════════ ABOUT / PHILOSOPHY ══════════════ */}
        <section className={styles.philosophy}>
          <div className={`container ${styles.philosophyInner}`}>
            <div className={styles.philosophyImage}>
              <Image
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=900"
                alt="Desmond Iorfa at work in his workshop"
                fill
                className={styles.philosophyImg}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.philosophyAccent} />
            </div>
            <div className={styles.philosophyText}>
              <span className="label-caps">The Craftsman</span>
              <div className="divider" />
              <h2 className={styles.philosophyHeading}>
                Desmond Iorfa,<br />
                <em>Built by Hand,<br />Meant to Last</em>
              </h2>
              <p>
                With over fifteen years at the workbench, Desmond Iorfa has built
                a reputation for furniture that endures. Every joint is mortised
                by hand; every surface planed, sanded and finished with oils drawn
                from the finest Nigerian hardwoods.
              </p>
              <p>
                What you receive is not merely furniture, it is a document of care,
                signed in grain and finished in time.
              </p>
              <ul className={styles.featureList}>
                <li><span className={styles.checkIcon}>✦</span>Solid mahogany, iroko and teak timber</li>
                <li><span className={styles.checkIcon}>✦</span>Fully bespoke, designed with you</li>
                <li><span className={styles.checkIcon}>✦</span>10-year structural warranty on every piece</li>
                <li><span className={styles.checkIcon}>✦</span>Free delivery within Abuja and Lagos</li>
              </ul>
              <Link href="/contact" className="btn btn-outline" style={{ marginTop: 12 }}>
                Speak with Desmond
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════ CATEGORIES ══════════════ */}
        {categories.length > 0 && (
          <section className={styles.categoriesSection}>
            <div className="container">
              <div className="section-header">
                <span className="label-caps">Browse by Room</span>
                <h2>Our Collections</h2>
                <p>
                  From intimate bedrooms to grand dining halls, every space
                  deserves furniture that fits exactly.
                </p>
              </div>
              <div className={styles.categoriesGrid}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={styles.categoryCard}
                  >
                    <div className={styles.categoryImage}>
                      <Image
                        src={categoryImages[cat.slug] || categoryImages["living-room"]}
                        alt={cat.name}
                        fill
                        className={styles.catImg}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className={styles.categoryOverlay} />
                      <div className={styles.categoryLabel}>
                        <h3 className={styles.categoryName}>{cat.name}</h3>
                        <span className={styles.categoryCount}>{cat._count.products} pieces</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
        <section className={styles.productsSection}>
          <div className="container">
            <div className={styles.productsHeader}>
              <div>
                <span className="label-caps">From the Workshop</span>
                <h2 className={styles.productsTitle}>Latest Pieces</h2>
              </div>
              <Link href="/products" className="btn btn-ghost">
                View Full Collection →
              </Link>
            </div>

            {products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map((p) => (
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
            ) : (
              <div className={styles.emptyProducts}>
                <p>The workshop is being prepared. New pieces arriving soon.</p>
                <Link href="/contact" className="btn btn-primary">
                  Commission a Custom Piece
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════ QUOTE ══════════════ */}
        <section className={styles.quoteSection}>
          <div className="container">
            <blockquote className={styles.quote}>
              <span className={styles.quoteMarks}>&ldquo;</span>
              <p>
                Good furniture is not bought, it is commissioned, crafted,
                and passed down. I build pieces that outlive the one who
                ordered them.
              </p>
              <footer className={styles.quoteAuthor}>
                Desmond Iorfa, Master Carpenter
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ══════════════ CTA BANNER ══════════════ */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerBg}>
            <Image
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1600"
              alt="Handcrafted furniture interior"
              fill
              className={styles.ctaBannerImg}
              sizes="100vw"
            />
            <div className={styles.ctaBannerOverlay} />
          </div>
          <div className={`container ${styles.ctaBannerContent}`}>
            <span className="label-caps">Commission a Piece</span>
            <h2 className={styles.ctaTitle}>
              Your Vision.<br />
              <em>His Hands.</em>
            </h2>
            <p>
              Describe what you need, Desmond will design and build it
              to exact specification, from first sketch to final delivery.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Start Your Commission
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
