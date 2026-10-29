"use client";
import Link from "next/link";
import { Heart, ArrowUpLeft } from "lucide-react";
import { productHref } from "@/lib/repository";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { priceOf, number, inStock } from "@/lib/domain";
export function ProductCard({ product: p }: { product: Product }) {
  const ready = useStore((s) => s.ready);
  const wish = useStore((s) => s.wishlist.includes(p.id));
  const toggle = useStore((s) => s.toggleWish);
  return (
    <article className="product-card">
      <div className="product-visual">
        {p.offer ? (
          <span className="product-tag">انتخاب ویژه</span>
        ) : (
          <span className="brand-label">{p.brand}</span>
        )}
        <button
          disabled={!ready}
          className={`wish-btn ${wish ? "selected" : ""}`}
          aria-label={wish ? `حذف ${p.name} از علاقه‌مندی` : `ذخیره ${p.name}`}
          aria-pressed={wish}
          onClick={() => toggle(p.id)}
        >
          <Heart size={18} fill={wish ? "currentColor" : "none"} />
        </button>
        <Link href={productHref(p)} tabIndex={-1} aria-hidden="true">
          <img
            src={p.images[0]}
            width={280}
            height={280}
            alt=""
            loading="lazy"
          />
        </Link>
        <div className="color-dots" aria-label="رنگ‌ها">
          {[...new Set(p.variants.map((v) => v.colorHex))]
            .slice(0, 4)
            .map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
        </div>
      </div>
      <div className="product-info">
        <span className="product-meta">
          {p.kind === "phone" ? "گوشی موبایل" : p.category}{" "}
          <span>· {p.variants[0].storage}</span>
        </span>
        <Link href={productHref(p)}>
          <h3>
            <bdi>{p.name}</bdi>
          </h3>
        </Link>
        <div className="product-bottom">
          <div>
            {inStock(p) ? (
              <>
                <strong>{number(priceOf(p))}</strong>
                <small>تومان</small>
              </>
            ) : (
              <span className="muted">فعلاً ناموجود</span>
            )}
          </div>
          <Link
            aria-label={`مشاهده ${p.name}`}
            href={productHref(p)}
            className="card-arrow"
          >
            <ArrowUpLeft size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
