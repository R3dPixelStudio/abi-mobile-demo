import type { Product } from "./types";
export const protectionCategories = ["قاب و محافظ", "گلس و محافظ صفحه"];
export const phoneBrands = ["Apple", "Samsung", "Xiaomi", "Honor", "Google"];
export function fitsPhone(accessory: Product, phone: Product) {
  return (
    accessory.kind === "accessory" &&
    !!accessory.compatiblePhoneIds?.includes(phone.id)
  );
}
export function accessoryHref(phone: Product, category?: string) {
  const q = new URLSearchParams({
    kind: "accessory",
    phone: phone.id,
    deviceBrand: phone.brand,
  });
  if (category) q.set("category", category);
  return "/products?" + q;
}
