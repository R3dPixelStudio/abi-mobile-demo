import type { StoreSettings } from "./types";
export const branding = {
  name: "آبی‌موبایل",
  latin: "abi mobile",
  description: "انتخاب روشن، دنیای همراه",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
export const defaultSettings: StoreSettings = {
  name: branding.name,
  tagline: branding.description,
  heroTitle: "یک انتخاب روشن.\nیک دنیای تازه.",
  heroText:
    "از اولین پیام صبح تا آخرین عکس سفر؛ همراهی را پیدا کن که برای دنیای تو ساخته شده.",
  banner:
    "نسخه نمایشی آبی‌موبایل · قیمت‌ها نمونه هستند و خرید واقعی انجام نمی‌شود",
  discountCode: "ABI10",
  discountPercent: 10,
  brands: ["Apple", "Samsung", "Xiaomi", "Honor", "Google"],
  categories: [
    "گوشی موبایل",
    "ساعت هوشمند",
    "شارژر",
    "کابل",
    "هدفون",
    "قاب و محافظ",
    "گلس و محافظ صفحه",
    "پاوربانک",
  ],
};
