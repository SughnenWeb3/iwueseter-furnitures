import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Desmond Iorfa</span>
            <span className={styles.logoSub}>Master Carpenter</span>
          </div>
          <p className={styles.tagline}>
            Bespoke furniture built by hand in Nigeria.
            Every joint, every finish, every piece, a testament to craft.
          </p>
          <div className={styles.social}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://wa.me/234800000000"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.linkGroup}>
          <h3 className="label-caps">Collection</h3>
          <ul>
            <li><Link href="/products?category=living-room">Living Room</Link></li>
            <li><Link href="/products?category=bedroom">Bedroom</Link></li>
            <li><Link href="/products?category=dining-room">Dining Room</Link></li>
            <li><Link href="/products?category=office">Office</Link></li>
          </ul>
        </div>

        <div className={styles.linkGroup}>
          <h3 className="label-caps">Company</h3>
          <ul>
            <li><Link href="/">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/contact">Custom Orders</Link></li>
          </ul>
        </div>

        <div className={styles.linkGroup}>
          <h3 className="label-caps">Contact</h3>
          <ul>
            <li>Abuja, Nigeria</li>
            <li>desmond@iorfafurniture.com</li>
            <li>+234 803 000 0000</li>
            <li>Mon – Sat: 8am – 6pm</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <span>© {year} Desmond Iorfa, Master Carpenter. All rights reserved.</span>
          <span className={styles.bottomRight}>
            Crafted with care in Nigeria
          </span>
        </div>
      </div>
    </footer>
  );
}
