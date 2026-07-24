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
                  <h3>Phone &amp; WhatsApp</h3>
                  <p>+234 800 000 0000</p>
                  <p>Mon – Sat: 9am – 6pm WAT</p>
                </div>
              </div>

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
