"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./gallery.module.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          src={images[activeIdx]}
          alt={`${title} - Image ${activeIdx + 1}`}
          fill
          priority
          className={styles.img}
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumb} ${idx === activeIdx ? styles.thumbActive : ""}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className={styles.thumbImg}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
