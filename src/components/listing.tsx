"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { useCatalog, useStore } from "@/lib/store";
import { normalize, priceOf, inStock, number } from "@/lib/domain";
import { ProductCard } from "./product-card";
import { Breadcrumb, Empty, Modal } from "./ui";
export function Listing() {
  const all = useCatalog();
  const settings = useStore((s) => s.settings);
  const search = useSearchParams();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const q = search.get("q") || "";
  const kind = search.get("kind") || "";
  const brand = search.get("brand") || "";
  const category = search.get("category") || "";
  const max = Number(search.get("max")) || 0;
  const stock = search.get("stock") === "1";
  const offer = search.get("offer") === "1";
  const storage = search.get("storage") || "";
  const sort = search.get("sort") || "featured";
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(search.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/products?${next.toString()}`, { scroll: false });
  };
  const filtered = all
    .filter(
      (p) =>
        (!kind || p.kind === kind) &&
        (!brand || p.brand === brand) &&
        (!category || normalize(p.category).includes(normalize(category))) &&
        (!max || priceOf(p) <= max) &&
        (!stock || inStock(p)) &&
        (!offer || p.offer) &&
        (!storage ||
          p.variants.some(
            (v) => parseInt(normalize(v.storage)) >= Number(storage),
          )) &&
        (!q ||
          normalize(
            p.name +
              " " +
              p.slug.replaceAll("-", " ") +
              " " +
              p.brand +
              " " +
              p.category +
              " " +
              p.description,
          ).includes(normalize(q))),
    )
    .sort((a, b) =>
      sort === "low"
        ? priceOf(a) - priceOf(b)
        : sort === "high"
          ? priceOf(b) - priceOf(a)
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : Number(b.featured) - Number(a.featured),
    );
  const controls = (
    <div className="filter-stack">
      <div className="row between">
        <h3>فیلترها</h3>
        <button
          className="text-link"
          onClick={() => router.replace("/products", { scroll: false })}
        >
          حذف همه
        </button>
      </div>
      <label className="field">
        نوع محصول
        <select value={kind} onChange={(e) => change("kind", e.target.value)}>
          <option value="">همه محصولات</option>
          <option value="phone">گوشی موبایل</option>
          <option value="accessory">لوازم جانبی</option>
        </select>
      </label>
      <label className="field">
        برند
        <select value={brand} onChange={(e) => change("brand", e.target.value)}>
          <option value="">همه برندها</option>
          {settings.brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className="field">
        دسته‌بندی
        <select
          value={category}
          onChange={(e) => change("category", e.target.value)}
        >
          <option value="">همه دسته‌ها</option>
          {settings.categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        بودجه تا
        <select
          value={max || ""}
          onChange={(e) => change("max", e.target.value)}
        >
          <option value="">بدون محدودیت</option>
          <option value="10000000">۱۰ میلیون تومان</option>
          <option value="25000000">۲۵ میلیون تومان</option>
          <option value="40000000">۴۰ میلیون تومان</option>
          <option value="70000000">۷۰ میلیون تومان</option>
          <option value="120000000">۱۲۰ میلیون تومان</option>
        </select>
      </label>
      <label className="field">
        حداقل حافظه
        <select
          value={storage}
          onChange={(e) => change("storage", e.target.value)}
        >
          <option value="">همه ظرفیت‌ها</option>
          <option value="128">۱۲۸ گیگابایت</option>
          <option value="256">۲۵۶ گیگابایت</option>
          <option value="512">۵۱۲ گیگابایت</option>
        </select>
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={stock}
          onChange={(e) => change("stock", e.target.checked ? "1" : "")}
        />{" "}
        فقط کالاهای موجود
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={offer}
          onChange={(e) => change("offer", e.target.checked ? "1" : "")}
        />{" "}
        پیشنهادهای ویژه
      </label>
      <div className="filter-note">
        همه قیمت‌ها نمونه‌اند.
        <br />
        موجودی‌ها برای نمایش تجربه خرید تنظیم شده‌اند.
      </div>
    </div>
  );
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "فروشگاه" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">انتخابی متناسب با دنیای تو</span>
          <h1>
            {q
              ? `نتایج جستجوی «${q}»`
              : kind === "accessory"
                ? "لوازم جانبی"
                : offer
                  ? "پیشنهادهای ویژه"
                  : "گوشی و لوازم جانبی"}
          </h1>
          <p>{number(filtered.length)} محصول برای کشف و مقایسه</p>
        </div>
      </div>
      <div className="listing-layout">
        <aside className="filter-sidebar panel">{controls}</aside>
        <div className="listing-main">
          <div className="listing-toolbar">
            <button
              className="btn secondary filter-toggle"
              onClick={() => setDrawer(true)}
            >
              <SlidersHorizontal size={17} />
              فیلترها
            </button>
            <form action="/products" className="listing-search">
              <Search size={16} />
              <input
                aria-label="جستجو در نتایج"
                name="q"
                defaultValue={q}
                key={q}
                placeholder="نام محصول یا برند"
              />
              {Array.from(search.entries())
                .filter(([k]) => k !== "q")
                .map(([k, v]) => (
                  <input type="hidden" key={k} name={k} value={v} />
                ))}
            </form>
            <label className="sort-label">
              مرتب‌سازی
              <select
                aria-label="مرتب‌سازی محصولات"
                value={sort}
                onChange={(e) => change("sort", e.target.value)}
              >
                <option value="featured">پیشنهاد آبی</option>
                <option value="low">ارزان‌ترین</option>
                <option value="high">گران‌ترین</option>
                <option value="name">نام محصول</option>
              </select>
            </label>
          </div>
          {[q, brand, category, kind, max, stock, offer, storage].some(
            Boolean,
          ) && (
            <div className="active-filters">
              {Array.from(search.entries())
                .filter(([k]) => k !== "sort")
                .map(([k, v]) => (
                  <button
                    key={k}
                    className="badge"
                    onClick={() => change(k, "")}
                  >
                    {(
                      {
                        q: "جستجو",
                        kind: "نوع",
                        brand: "برند",
                        max: "بودجه",
                        stock: "موجود",
                        offer: "ویژه",
                        storage: "حافظه",
                        category: "دسته",
                      } as Record<string, string>
                    )[k] || k}
                    :{" "}
                    {k === "max"
                      ? number(Number(v))
                      : v === "phone"
                        ? "گوشی"
                        : v === "accessory"
                          ? "لوازم"
                          : v === "1"
                            ? "بله"
                            : v}
                    <X size={12} />
                  </button>
                ))}
            </div>
          )}
          {filtered.length ? (
            <div className="products-grid listing-products">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Empty
              title="گزینه‌ای با این مشخصات پیدا نشد"
              text="بودجه یا فیلترها را تغییر بده تا انتخاب‌های بیشتری ببینی."
            />
          )}
        </div>
      </div>
      <Modal
        open={drawer}
        onClose={() => setDrawer(false)}
        title="فیلتر محصولات"
      >
        {controls}
        <button
          className="btn primary"
          style={{ width: "100%", marginTop: 24 }}
          onClick={() => setDrawer(false)}
        >
          نمایش {number(filtered.length)} محصول
        </button>
      </Modal>
    </div>
  );
}
