import type { CartLine, OrderLine, Product } from "./types";
export const digits = (v: string) =>
  v.replace(/[۰-۹٠-٩]/g, (c) =>
    String(c.charCodeAt(0) - (c >= "۰" ? 1776 : 1632)),
  );
export const normalize = (v: string) =>
  digits(v)
    .replace(/ي|ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim()
    .toLowerCase();
export const number = (v: number) => new Intl.NumberFormat("fa-IR").format(v);
export const money = (v: number) => `${number(v)} تومان`;
export const date = (v: string) =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(v));
export const validPhone = (v: string) =>
  /^09\d{9}$/.test(digits(v).replace(/\s/g, ""));
export const priceOf = (p: Product) =>
  Math.min(...p.variants.map((v) => v.price));
export const inStock = (p: Product) => p.variants.some((v) => v.stock > 0);
export function totals(subtotal: number, percent = 0) {
  subtotal = Math.max(0, Math.round(Number.isFinite(subtotal) ? subtotal : 0));
  const discount = Math.floor(
    (subtotal *
      Math.min(50, Math.max(0, Number.isFinite(percent) ? percent : 0))) /
      100,
  );
  const delivery = subtotal === 0 || subtotal >= 5000000 ? 0 : 65000;
  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
  };
}
export function resolveCart(cart: CartLine[], catalog: Product[]) {
  const lines: OrderLine[] = [];
  const errors: string[] = [];
  for (const item of cart) {
    const p = catalog.find((p) => p.id === item.productId);
    const v = p?.variants.find((v) => v.id === item.variantId);
    if (!p || !v) {
      errors.push(
        "یکی از کالاها یا تنوع‌های انتخاب‌شده دیگر در کاتالوگ نیست. آن را از سبد حذف کنید.",
      );
      continue;
    }
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > Math.min(10, v.stock)
    )
      errors.push(`موجودی ${p.name} برای تعداد انتخابی کافی نیست.`);
    lines.push({
      ...item,
      name: p.name,
      variant: `${v.color} · ${v.storage}`,
      price: v.price,
      image: p.images[0],
    });
  }
  return {
    lines,
    errors,
    subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
  };
}
export type Preferences = {
  budget: number;
  brand?: string;
  use?: string;
  storage?: number;
};
export function recommend(catalog: Product[], pref: Preferences) {
  return catalog
    .filter(
      (p) =>
        p.kind === "phone" &&
        p.variants.some(
          (v) =>
            v.stock > 0 &&
            v.price <= pref.budget &&
            (!pref.storage ||
              (parseInt(digits(v.storage)) || 0) >= pref.storage),
        ) &&
        (!pref.brand || p.brand === pref.brand),
    )
    .sort((a, b) => {
      const score = (p: Product) => {
        const text = normalize(
          Object.values(p.specs).join(" ") + " " + p.description,
        );
        let n = 0;
        if (
          pref.use === "camera" &&
          /pro|ultra|pixel/.test(p.name.toLowerCase())
        )
          n += 3;
        if (
          pref.use === "gaming" &&
          /snapdragon 8|a18|a17|dimensity 9/i.test(text)
        )
          n += 3;
        if (pref.use === "battery" && /5000|5100|5200|6000/.test(text)) n += 3;
        return n;
      };
      return score(b) - score(a) || priceOf(b) - priceOf(a);
    })
    .slice(0, 3);
}
