"use client";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { similarProducts } from "@/lib/search";
import type { Product } from "@/lib/types";
export function SearchEmpty({
  query,
  catalog,
  filtered,
}: {
  query: string;
  catalog: Product[];
  filtered: boolean;
}) {
  const similar = query ? similarProducts(query, catalog) : [];
  return (
    <div className="search-discovery">
      <div className="discovery-visual" aria-hidden="true">
        <span className="discovery-ring" />
        <span className="discovery-ring" />
        <span className="discovery-lens">⌕</span>
        <i>✦</i>
      </div>
      <span className="eyebrow">یک مسیر تازه برای کشف</span>
      <h2>{query ? "هنوز پیدایش نکردیم." : "انتخاب‌ها را کمی بازتر کنیم؟"}</h2>
      <p>
        {query
          ? `برای «${query}» نتیجه دقیقی نبود. ${similar.length ? "این نام‌ها نزدیک‌ترند؛ شاید همان چیزی باشند که دنبالش بودی." : "یک نام کوتاه‌تر، برند یا مدل دیگری را امتحان کن."}`
          : "با تغییر بودجه یا مدل گوشی، گزینه‌های بیشتری ببین."}
      </p>
      <div className="discovery-actions">
        <Link className="btn secondary" href="/products">
          پاک کردن فیلترها
        </Link>
        <Link className="text-link" href="/assistant">
          با آبی پیدایش کن ↗
        </Link>
      </div>
      {similar.length > 0 && (
        <>
          <div className="suggestion-chips">
            {similar.map((p) => (
              <Link
                key={p.id}
                href={"/products?" + new URLSearchParams({ q: p.name })}
              >
                <span>شاید منظورت</span> <bdi>{p.name}</bdi> ↗
              </Link>
            ))}
          </div>
          <div className="products-grid">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
      {filtered && similar.length === 0 && (
        <span className="tiny">
          فیلتر مدل و سازگاری برای پیشنهادهای این بخش حفظ شده‌اند.
        </span>
      )}
    </div>
  );
}
