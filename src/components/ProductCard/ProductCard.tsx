import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  title: string;
  price: number | string;
  images: string[];
  category?: string;
  material?: string;
}

function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductCard({
  id,
  title,
  price,
  images,
  category,
  material,
}: ProductCardProps) {
  const imageUrl = images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600";

  return (
    <Link href={`/products/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
        {material && (
          <span className={styles.badge}>{material}</span>
        )}
        <div className={styles.viewBtn}>
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
      <div className={styles.content}>
        {category && <span className={styles.category}>{category}</span>}
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <span className={styles.inquiry}>Enquire →</span>
        </div>
      </div>
    </Link>
  );
}
