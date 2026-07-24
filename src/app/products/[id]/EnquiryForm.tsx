"use client";

import { useState } from "react";
import styles from "./enquiry.module.css";

interface EnquiryFormProps {
  productTitle: string;
  productId: string;
}

export default function EnquiryForm({ productTitle }: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hello, I am interested in the "${productTitle}". Could you please provide more information about availability and delivery?`);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h3>Enquiry Sent!</h3>
        <p>
          Thank you for your interest. We will get back to you within 24 hours.
        </p>
        <button
          className="btn btn-outline"
          onClick={() => setStatus("idle")}
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.enquirySection}>
      {!expanded ? (
        <button
          className="btn btn-primary"
          onClick={() => setExpanded(true)}
          style={{ width: "100%" }}
          id="enquire-now-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Enquire About This Piece
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Request Information</h3>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setExpanded(false)}
              aria-label="Close form"
            >
              ✕
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label className="form-label" htmlFor="enq-name">Full Name *</label>
              <input
                id="enq-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="enq-email">Email Address *</label>
              <input
                id="enq-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enq-phone">Phone Number</label>
            <input
              id="enq-phone"
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="enq-message">Message *</label>
            <textarea
              id="enq-message"
              className="form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
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
            style={{ width: "100%" }}
          >
            {status === "loading" ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
