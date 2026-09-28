"use client";

import styles from "./WhatsAppButton.module.css";

const PHONE = "2348136351852";
const MESSAGE = encodeURIComponent(
  "Hello! I'm interested in your furniture. I'd like to know more."
);
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fab}
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.468-2.004A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333a13.27 13.27 0 01-6.771-1.854l-.486-.29-5.026 1.189 1.215-4.898-.317-.502A13.267 13.267 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667c7.363 0 13.333 5.97 13.333 13.333S23.363 29.333 16 29.333zm7.307-9.986c-.4-.2-2.368-1.168-2.735-1.302-.367-.133-.634-.2-.9.2-.267.4-1.034 1.302-1.268 1.568-.233.267-.467.3-.867.1-.4-.2-1.688-.622-3.215-1.984-1.188-1.06-1.99-2.369-2.223-2.769-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.168-1.234-2.968-.325-.78-.656-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.368-1.4 3.334s1.433 3.868 1.633 4.134c.2.267 2.82 4.302 6.832 6.034.955.412 1.7.658 2.281.843.958.305 1.831.262 2.52.159.769-.114 2.368-.968 2.701-1.902.333-.934.333-1.734.233-1.902-.1-.167-.367-.267-.767-.467z"/>
      </svg>
      <span className={styles.label}>Chat with us</span>
      <span className={styles.pulse} aria-hidden="true" />
    </a>
  );
}
