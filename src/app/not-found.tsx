import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "var(--nav-height)",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "24px",
          padding: "120px 40px",
        }}
      >
        <span
          style={{
            fontSize: "120px",
            fontWeight: 300,
            color: "var(--color-gold)",
            opacity: 0.3,
            lineHeight: 1,
          }}
        >
          404
        </span>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 300,
            color: "var(--color-text-primary)",
            maxWidth: "500px",
          }}
        >
          This Page Does Not Exist
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--color-text-secondary)",
            maxWidth: "400px",
            lineHeight: 1.7,
          }}
        >
          The page you are looking for may have been moved or removed. Let us
          guide you back to where you need to be.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/products" className="btn btn-outline">
            View Collection
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
