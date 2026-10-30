"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCatalog } from "@/lib/store";
import { phoneBrands } from "@/lib/compatibility";
const categories = [
  "ساعت هوشمند",
  "قاب و محافظ",
  "گلس و محافظ صفحه",
  "شارژر",
  "کابل",
  "هدفون",
  "پاوربانک",
];
export function AccessoryBrandLinks({ category }: { category: string }) {
  const products = useCatalog().filter(
    (p) => p.kind === "accessory" && p.category.includes(category),
  );
  const fitted = category.includes("قاب") || category.includes("گلس");
  const brands = fitted
    ? phoneBrands
    : Array.from(new Set(products.map((p) => p.brand)));
  return (
    <>
      {brands.map((b) => (
        <Link
          key={b}
          href={
            "/products?" +
            new URLSearchParams({
              kind: "accessory",
              category,
              [fitted ? "deviceBrand" : "brand"]: b,
            })
          }
        >
          <bdi>{b}</bdi>
          <span>↗</span>
        </Link>
      ))}
    </>
  );
}
export function AccessoryMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="accessory-nav-menu"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          (
            e.currentTarget.querySelector("button") as HTMLButtonElement
          )?.focus();
        }
      }}
    >
      <Link href="/products?kind=accessory">لوازم جانبی</Link>
      <button
        aria-label="دسته‌ها و برندهای لوازم جانبی"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown size={13} />
      </button>
      <div className={`accessory-mega ${open ? "is-open" : ""}`}>
        <div className="accessory-mega-intro">
          <span className="eyebrow">همراه‌های کوچک، انتخاب دقیق</span>
          <strong>برای گوشی خودت پیدا کن.</strong>
          <Link href="/products?kind=accessory&category=قاب">
            انتخاب مدل برای قاب و گلس ↗
          </Link>
        </div>
        <div className="accessory-mega-grid">
          {categories.map((c) => (
            <div key={c}>
              <Link
                className="accessory-category-title"
                href={
                  "/products?" +
                  new URLSearchParams({ kind: "accessory", category: c })
                }
              >
                {c} ←
              </Link>
              <AccessoryBrandLinks category={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function MobileAccessoryMenu() {
  return (
    <details className="mobile-accessory-menu">
      <summary>قاب، گلس و لوازم جانبی</summary>
      {categories.map((c) => (
        <Link
          key={c}
          href={
            "/products?" +
            new URLSearchParams({ kind: "accessory", category: c })
          }
        >
          {c} ↗
        </Link>
      ))}
      <span>قاب و گلس را با انتخاب مدل دقیق گوشی پیدا کن.</span>
    </details>
  );
}
