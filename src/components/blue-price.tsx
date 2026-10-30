"use client";
import { number } from "@/lib/domain";
import type { Variant } from "@/lib/types";
export function BluePrice({
  variant,
  compact = false,
}: {
  variant: Variant;
  compact?: boolean;
}) {
  const reduced =
    !!variant.compareAtPrice && variant.compareAtPrice > variant.price;
  return (
    <div className={`blue-price ${compact ? "compact-price" : ""}`}>
      {reduced && (
        <div className="blue-price-before">
          <span className="sr-only">قیمت قبلی نمونه: </span>
          <del>{number(variant.compareAtPrice!)}</del>
          <span>قیمت آبی</span>
        </div>
      )}
      <div className="blue-price-now">
        <strong>{number(variant.price)}</strong>
        <small>تومان</small>
      </div>
    </div>
  );
}
