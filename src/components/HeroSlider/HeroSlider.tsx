"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=85&w=1920",
    label: "Living Room",
    title: "Sitting Room\nChairs and Sofas",
    subtitle: "Where every evening becomes a ceremony of comfort.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=85&w=1920",
    label: "Dining",
    title: "Dining Tables\nand Chairs",
    subtitle: "Gather around a table built to hold memories for generations.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=85&w=1920",
    label: "Dining Room",
    title: "Fine Dining\nSections",
    subtitle: "Crafted from solid Nigerian hardwood, a feast for the eyes.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=85&w=1920",
    label: "Bedroom",
    title: "Bed Frames\nand Headboards",
    subtitle: "Rest in a piece of art, carved, joined and finished by hand.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=85&w=1920",
    label: "Bedroom",
    title: "Wardrobes\nand Cabinets",
    subtitle: "Bespoke storage that speaks the language of fine craftsmanship.",
  },
  {
    id: 6,
    image: "/images/standing-mirror.jpg",
    label: "Accent Pieces",
    title: "Standing Mirror\nFrames",
    subtitle: "Framed in mahogany, reflect your taste, not just your image.",
  },
];

const INTERVAL = 5500;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      setPrev(current);
      setDirection(dir);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, "next");
  }, [current, goTo]);

  const goBack = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [next, paused]);

  // Clear prev after transition
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev]);

  const slide = SLIDES[current];

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured furniture showcase"
    >
      {/* Slides */}
      {SLIDES.map((s, i) => {
        const isActive = i === current;
        const isPrev  = i === prev;
        return (
          <div
            key={s.id}
            className={`${styles.slide} ${
              isActive ? styles.slideActive : ""
            } ${isPrev ? (direction === "next" ? styles.slideExitLeft : styles.slideExitRight) : ""}`}
            aria-hidden={!isActive}
          >
            <Image
              src={s.image}
              alt={s.title.replace("\n", " ")}
              fill
              priority={i === 0}
              className={styles.slideImg}
              sizes="100vw"
            />
            <div className={styles.overlay} />
            <div className={styles.overlayBottom} />
          </div>
        );
      })}

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.contentInner} key={current}>
          <span className={`${styles.slideLabel} label-caps`}>{slide.label}</span>
          <h1 className={styles.heroTitle}>
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className={i === 1 ? styles.titleItalic : ""}>
                {i === 1 ? <em>{line}</em> : line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className={styles.heroSubtitle}>{slide.subtitle}</p>

          <div className={styles.heroCtas}>
            <Link href="/products" className="btn btn-primary">
              Explore Collection
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Request Bespoke Order
            </Link>
          </div>
        </div>

      </div>

      {/* Navigation arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={goBack}
        aria-label="Previous slide"
        id="hero-prev"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={next}
        aria-label="Next slide"
        id="hero-next"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist" aria-label="Slide navigation">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className={styles.progress} key={`${current}-${paused}`}>
        <div className={`${styles.progressBar} ${!paused ? styles.progressRunning : ""}`} />
      </div>

      {/* Stats strip */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>15 +</span>
          <span className={styles.statLbl}>Years of Craft</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum}>600 +</span>
          <span className={styles.statLbl}>Pieces Built</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum}>100 %</span>
          <span className={styles.statLbl}>Hand-finished</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum}>10 yr</span>
          <span className={styles.statLbl}>Structural Warranty</span>
        </div>
      </div>
    </section>
  );
}
