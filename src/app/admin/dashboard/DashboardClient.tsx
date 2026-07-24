"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./page.module.css";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date | string;
}

interface Product {
  id: string;
  title: string;
  price: unknown;
  images: string[];
  category: { name: string } | null;
  createdAt: Date | string;
}

interface DashboardData {
  productCount: number;
  enquiryCount: number;
  categoryCount: number;
  pendingEnquiries: number;
  recentEnquiries: Enquiry[];
  recentProducts: Product[];
}

interface User {
  name?: string | null;
  email?: string | null;
}

function formatPrice(price: unknown): string {
  const n = Number(price);
  if (!n) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminDashboardClient({
  data,
  user,
}: {
  data: DashboardData;
  user: User;
}) {
  const stats = [
    {
      label: "Total Products",
      value: data.productCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "Categories",
      value: data.categoryCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      label: "Total Enquiries",
      value: data.enquiryCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      label: "Pending Enquiries",
      value: data.pendingEnquiries,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      highlight: data.pendingEnquiries > 0,
    },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>Iwueseter</span>
          <span className={styles.logoSub}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <Link href="/admin/dashboard" className={`${styles.navLink} ${styles.navActive}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link href="/products" className={styles.navLink} target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            View Store
          </Link>
        </nav>

        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>
            {(user.name || user.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name || "Admin"}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={styles.signOutBtn}
            aria-label="Sign out"
            title="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>
              Welcome back, {user.name?.split(" ")[0] || "Admin"}
            </p>
          </div>
          <div className={styles.topActions}>
            <Link href="/" target="_blank" className="btn btn-outline" style={{ fontSize: 12 }}>
              View Website ↗
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${styles.statCard} ${stat.highlight ? styles.statHighlight : ""}`}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statBody}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Recent Enquiries */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Recent Enquiries</h2>
              {data.pendingEnquiries > 0 && (
                <span className={styles.badge}>{data.pendingEnquiries} pending</span>
              )}
            </div>
            {data.recentEnquiries.length === 0 ? (
              <div className={styles.empty}>
                <p>No enquiries yet.</p>
              </div>
            ) : (
              <div className={styles.enquiryList}>
                {data.recentEnquiries.map((enq) => (
                  <div key={enq.id} className={styles.enquiryItem}>
                    <div className={styles.enquiryAvatar}>
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.enquiryBody}>
                      <div className={styles.enquiryTop}>
                        <span className={styles.enquiryName}>{enq.name}</span>
                        <span className={styles.enquiryTime}>{timeAgo(enq.createdAt)}</span>
                      </div>
                      <span className={styles.enquiryEmail}>{enq.email}</span>
                      <p className={styles.enquiryMsg}>{enq.message.slice(0, 90)}...</p>
                    </div>
                    <span
                      className={`${styles.statusBadge} ${
                        enq.status === "PENDING"
                          ? styles.statusPending
                          : styles.statusRead
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Catalogue</h2>
              <Link href="/products" target="_blank" className="btn btn-ghost" style={{ fontSize: 12 }}>
                View All →
              </Link>
            </div>
            {data.recentProducts.length === 0 ? (
              <div className={styles.empty}>
                <p>No products yet. Run the database seed to add sample products.</p>
              </div>
            ) : (
              <div className={styles.productList}>
                {data.recentProducts.map((p) => (
                  <div key={p.id} className={styles.productRow}>
                    <div className={styles.productThumb}>
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.title} />
                      ) : (
                        <div className={styles.productThumbPlaceholder}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productTitle}>{p.title}</span>
                      <span className={styles.productCategory}>
                        {p.category?.name}
                      </span>
                    </div>
                    <span className={styles.productPrice}>
                      {formatPrice(p.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
