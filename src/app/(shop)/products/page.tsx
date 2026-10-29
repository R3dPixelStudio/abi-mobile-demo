import { Suspense } from "react";
import { Listing } from "@/components/listing";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "گوشی و لوازم جانبی",
    "جستجو و مقایسه گوشی و لوازم جانبی با فیلتر برند، بودجه و مشخصات. قیمت‌های نمایشی به تومان.",
    "/products",
  );
export default function Page() {
  return (
    <Suspense
      fallback={<div className="empty">در حال آماده‌سازی فروشگاه…</div>}
    >
      <Listing />
    </Suspense>
  );
}
