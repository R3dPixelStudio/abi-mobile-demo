"use client";
import Link from "next/link";
import { useCatalog } from "@/lib/store";
import { accessoryHref, phoneBrands } from "@/lib/compatibility";
export function AccessoryFinder({
  deviceBrand = "",
  phoneId = "",
  onBrand,
  onPhone,
}: {
  deviceBrand?: string;
  phoneId?: string;
  onBrand?: (v: string) => void;
  onPhone?: (v: string) => void;
}) {
  const phones = useCatalog().filter(
    (p) => p.kind === "phone" && (!deviceBrand || p.brand === deviceBrand),
  );
  return (
    <div className="accessory-finder">
      <div>
        <span className="eyebrow">دقیقاً برای گوشی تو</span>
        <h2>اول مدل، بعد قاب و گلس.</h2>
        <p>برش دوربین و اندازه صفحه در هر مدل متفاوت است.</p>
      </div>
      <div className="fit-selects">
        <label className="field">
          برند گوشی
          <select
            value={deviceBrand}
            onChange={(e) => onBrand?.(e.target.value)}
          >
            <option value="">همه برندهای گوشی</option>
            {phoneBrands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="field">
          مدل دقیق گوشی
          <select value={phoneId} onChange={(e) => onPhone?.(e.target.value)}>
            <option value="">انتخاب مدل گوشی</option>
            {phones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
export function AccessoryLinks({
  phone,
}: {
  phone: import("@/lib/types").Product;
}) {
  return (
    <div className="compatibility-links">
      <Link href={accessoryHref(phone, "قاب و محافظ")}>
        قاب مخصوص این مدل ↗
      </Link>
      <Link href={accessoryHref(phone, "گلس و محافظ صفحه")}>
        گلس مخصوص این مدل ↗
      </Link>
    </div>
  );
}
