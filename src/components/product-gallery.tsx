"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { Product } from "@/lib/types";
import { number } from "@/lib/domain";
import { Modal } from "./ui";
export function ProductGallery({ product: p }: { product: Product }) {
  const [active, setActive] = useState(0),
    [zoom, setZoom] = useState(false);
  const src = p.images[active] || p.images[0];
  const step = (delta: number) =>
    setActive((i) => (i + delta + p.images.length) % p.images.length);
  return (
    <div
      className="gallery premium-gallery"
      role="group"
      aria-label={`گالری ${p.name}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="gallery-main">
        <span className="gallery-brand">
          {p.brand}
          <small>ABI / SELECTED OBJECTS</small>
        </span>
        <button
          className="gallery-expand"
          aria-label="بزرگ‌نمایی تصویر محصول"
          onClick={() => setZoom(true)}
        >
          <Expand size={17} />
        </button>
        <button
          className="gallery-image-button"
          onClick={() => setZoom(true)}
          aria-label={`بزرگ‌نمایی تصویر ${number(active + 1)} از ${p.name}`}
        >
          <img
            key={src}
            src={src}
            alt={`${p.imageAlt}؛ تصویر ${number(active + 1)}`}
            width={700}
            height={700}
            fetchPriority="high"
          />
        </button>
        <div className="gallery-floor" aria-hidden="true" />
        {p.images.length > 1 && (
          <div className="gallery-arrows">
            <button onClick={() => step(-1)} aria-label="تصویر قبلی">
              <ChevronRight size={17} />
            </button>
            <span dir="ltr">
              {number(active + 1)} / {number(p.images.length)}
            </span>
            <button onClick={() => step(1)} aria-label="تصویر بعدی">
              <ChevronLeft size={17} />
            </button>
          </div>
        )}
        <span className="gallery-caption">
          تصاویر مرجع همین مدل؛ رنگ و لوازم همراه تصویر ممکن است با تنوع انتخابی
          متفاوت باشند.
        </span>
      </div>
      <div className="gallery-thumbs">
        {p.images.map((image, i) => (
          <button
            key={image}
            onClick={() => setActive(i)}
            aria-label={`تصویر ${number(i + 1)}`}
            aria-pressed={i === active}
          >
            <img src={image} width={82} height={85} alt="" loading="lazy" />
            <span>{number(i + 1).padStart(2, "۰")}</span>
          </button>
        ))}
      </div>
      <Modal
        open={zoom}
        onClose={() => setZoom(false)}
        title={`${p.name} · تصویر ${number(active + 1)}`}
      >
        <div className="gallery-lightbox">
          <img src={src} alt={p.imageAlt} width={1100} height={1100} />
          <div className="gallery-lightbox-controls">
            <button className="btn secondary" onClick={() => step(-1)}>
              تصویر قبلی
            </button>
            <span>
              {number(active + 1)} / {number(p.images.length)}
            </span>
            <button className="btn secondary" onClick={() => step(1)}>
              تصویر بعدی
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
