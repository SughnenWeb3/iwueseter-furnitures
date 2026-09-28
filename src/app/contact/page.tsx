"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className="container">
            <span className="label-caps">Get in Touch</span>
            <h1 className={styles.pageTitle}>Contact &amp; Enquiries</h1>
            <p className={styles.pageDesc}>
              Whether you have a vision for a bespoke piece or simply want to
              learn more about our collection, we would love to hear from you.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Contact Info */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h3>Visit Our Showroom</h3>
                  <p>Akaajime<br/>Gboko, Benue State, Nigeria</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                  </svg>
                </div>
                <div>
                  <h3>Phone</h3>
                  <p>+234 813 635 1852</p>
                  <p>Mon – Sat: 9am – 6pm WAT</p>
                </div>
              </div>

              <a
                href="https://wa.me/2348136351852?text=Hello!%20I'm%20interested%20in%20your%20furniture."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoCard}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <div className={styles.infoIcon} style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.468-2.004A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm7.307 19.347c-.4-.2-2.368-1.168-2.735-1.302-.367-.133-.634-.2-.9.2-.267.4-1.034 1.302-1.268 1.568-.233.267-.467.3-.867.1-.4-.2-1.688-.622-3.215-1.984-1.188-1.06-1.99-2.369-2.223-2.769-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.168-1.234-2.968-.325-.78-.656-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.368-1.4 3.334s1.433 3.868 1.633 4.134c.2.267 2.82 4.302 6.832 6.034.955.412 1.7.658 2.281.843.958.305 1.831.262 2.52.159.769-.114 2.368-.968 2.701-1.902.333-.934.333-1.734.233-1.902-.1-.167-.367-.267-.767-.467z"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ color: "#25D366" }}>Chat on WhatsApp</h3>
                  <p>+234 813 635 1852</p>
                  <p>Click to start a conversation</p>
                </div>
              </a>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22 6 12 13 2 6"/>
                  </svg>
                </div>
                <div>
                  <h3>Email Us</h3>
                  <p>info@iwueseter.com</p>
                  <p>We reply within 24 hours</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h3>Opening Hours</h3>
                  <p>Mon – Fri: 9am – 6pm</p>
                  <p>Saturday: 10am – 4pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Custom Orders Note */}
              <div className={styles.customNote}>
                <span className="label-caps" style={{ display: "block", marginBottom: 12 }}>
                  Custom Orders
                </span>
                <p>
                  Have a specific design in mind? Our master craftsmen offer
                  fully bespoke furniture services. Share your vision and we
                  will bring it to life.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formCol}>
              {status === "success" ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✓</div>
                  <h2>Message Received</h2>
                  <p>
                    Thank you for reaching out. Our team will respond to your
                    enquiry within 24 business hours.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => setStatus("idle")}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formHeading}>
                    <h2>Send Us a Message</h2>
                    <p>Fill out the form below and we&apos;ll be in touch shortly.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-textarea"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your furniture needs, custom requirements, or any questions you may have..."
                      rows={6}
                      required
                    />
                  </div>

                  {status === "error" && (
                    <p className={styles.errorMsg}>{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "loading"}
                    style={{ width: "100%", padding: "16px" }}
                    id="contact-submit-btn"
                  >
                    {status === "loading" ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
