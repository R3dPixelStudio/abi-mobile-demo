"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  GitCompareArrows,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useCatalog, useStore } from "@/lib/store";
import { number } from "@/lib/domain";
import type { Product } from "@/lib/types";
import { Breadcrumb, DemoNote, Empty, Quantity, SectionTitle } from "./ui";
import { ProductCard } from "./product-card";
export function ProductDetail({
  seed,
  previewId,
}: {
  seed?: Product;
  previewId?: string;
}) {
  const catalog = useCatalog();
  const p = catalog.find((p) =>
    previewId ? p.id === previewId : p.id === seed?.id,
  );
  if (!p)
    return (
      <Empty
        title="این محصول در پیش‌نمایش موجود نیست"
        text="ممکن است در مدیریت محلی حذف شده باشد. داده‌های دمو را بازنشانی کنید یا محصول دیگری را ببینید."
      />
    );
  return (
    <ProductContent
      key={p.id}
      product={p}
      preview={!!previewId || JSON.stringify(seed) !== JSON.stringify(p)}
    />
  );
}
function ProductContent({
  product: p,
  preview,
}: {
  product: Product;
  preview: boolean;
}) {
  const [variantId, setVariant] = useState(p.variants[0].id);
  const variant = p.variants.find((v) => v.id === variantId) || p.variants[0];
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const ready = useStore((s) => s.ready);
  const add = useStore((s) => s.add);
  const wish = useStore((s) => s.wishlist.includes(p.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const compare = useStore((s) => s.compare.includes(p.id));
  const toggleCompare = useStore((s) => s.toggleCompare);
  const catalog = useCatalog();
  return (
    <div className="container">
      <Breadcrumb
        items={[{ label: "فروشگاه", href: "/products" }, { label: p.name }]}
      />
      {preview && (
        <DemoNote>
          پیش‌نمایش محلی این مرورگر؛ محتوا و فراداده سرور برای دیگران تغییر
          نکرده است.
        </DemoNote>
      )}
      <div className="product-detail">
        <div className="gallery">
          <div className="gallery-main">
            <span className="gallery-brand">{p.brand}</span>
            <img
              src={p.images[image] || p.images[0]}
              alt={p.imageAlt}
              width={560}
              height={560}
            />
            <span className="gallery-caption">
              تصویر مرجع مدل؛ رنگ انتخابی ممکن است در تصویر نمایش داده نشود.
            </span>
          </div>
          <div className="gallery-thumbs">
            {p.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setImage(i)}
                aria-label={`تصویر ${number(i + 1)}`}
                aria-pressed={i === image}
              >
                <img src={src} alt="" width={65} height={65} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-content">
          <span className="eyebrow">
            {p.category} · {p.brand}
          </span>
          <h1>
            <bdi>{p.name}</bdi>
          </h1>
          <p className="detail-description">{p.description}</p>
          <div className="detail-tools">
            <button
              disabled={!ready}
              onClick={() => toggleWish(p.id)}
              aria-pressed={wish}
            >
              <Heart size={17} fill={wish ? "currentColor" : "none"} />
              {wish ? "ذخیره شده" : "افزودن به علاقه‌مندی"}
            </button>
            {p.kind === "phone" && (
              <button
                disabled={!ready}
                onClick={() => toggleCompare(p.id)}
                aria-pressed={compare}
              >
                <GitCompareArrows size={17} />
                {compare ? "حذف از مقایسه" : "مقایسه محصول"}
              </button>
            )}
            <Link href="/compare">مشاهده مقایسه</Link>
          </div>
          <div className="variant-section">
            <h2>رنگ و ظرفیت</h2>
            <div className="variant-options">
              {p.variants.map((v) => (
                <button
                  className={v.id === variant.id ? "selected" : ""}
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id);
                    setQuantity(1);
                  }}
                  aria-pressed={v.id === variant.id}
                >
                  <i style={{ background: v.colorHex }} />
                  <span>
                    {v.color}
                    <small>
                      <bdi>{v.storage}</bdi>
                      {v.stock === 0 ? " · ناموجود" : ""}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="key-specs">
            {Object.entries(p.specs)
              .slice(0, 4)
              .map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>
                    <bdi>{v}</bdi>
                  </strong>
                </div>
              ))}
          </div>
          <div className="buy-panel">
            <div className="row between">
              <div>
                <span className={variant.stock ? "stock yes" : "stock"}>
                  {variant.stock
                    ? "موجود در کاتالوگ دمو"
                    : "این تنوع فعلاً ناموجود است"}
                </span>
                <div className="detail-price">
                  {number(variant.price)} <small>تومان</small>
                </div>
              </div>
              <Quantity
                value={quantity}
                onChange={setQuantity}
                max={Math.min(variant.stock, 10)}
              />
            </div>
            <div className="tiny">
              قیمت نمونه برای نمایش · گارانتی و شرایط: نیازمند تأیید فروشگاه
            </div>
            <button
              className="btn primary add-button"
              disabled={!ready || !variant.stock}
              onClick={() => add(p, variant.id, quantity)}
            >
              <ShoppingBag size={19} />
              {variant.stock ? "افزودن به سبد خرید" : "ناموجود"}
            </button>
            <div className="buy-hints">
              <span>
                <ShieldCheck size={15} /> اطلاعات گارانتی نمایشی
              </span>
              <span>
                <Truck size={15} /> ارسال آزمایشی
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="section detail-specs">
        <SectionTitle eyebrow="جزئیات مهم‌اند" title="مشخصات فنی" />
        <dl>
          {Object.entries(p.specs).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>
                <bdi>{v}</bdi>
              </dd>
            </div>
          ))}
        </dl>
        <DemoNote>
          مشخصات به مدل مرجع مربوط‌اند. پیش از عرضه واقعی، شناسه دقیق کالا،
          منطقه فروش، رجیستری، گارانتی و سازگاری لوازم بررسی می‌شود.
        </DemoNote>
      </section>
      <div className="detail-guide panel">
        <div>
          <span className="eyebrow">انتخاب آگاهانه</span>
          <h3>قبل از خرید، راهنمای انتخاب را بخوان</h3>
          <p className="muted">
            دوربین، باتری، حافظه یا عملکرد؛ کدام برای تو مهم‌تر است؟
          </p>
        </div>
        <Link className="btn secondary" href="/blog">
          مجله آبی <ArrowLeft size={16} />
        </Link>
      </div>
      <section className="section">
        <SectionTitle
          title="گزینه‌های دیگر برای تو"
          href={`/products?kind=${p.kind}`}
        />
        <div className="products-grid">
          {catalog
            .filter((x) => x.kind === p.kind && x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
