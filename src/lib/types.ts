export type Seo = { title: string; description: string; image: string };
export type Variant = {
  id: string;
  color: string;
  colorHex: string;
  storage: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
};
export type Product = {
  referenceUrl?: string;
  overview?: { title: string; text: string }[];
  id: string;
  slug: string;
  name: string;
  brand: string;
  kind: "phone" | "accessory";
  category: string;
  compatiblePhoneIds?: string[];
  compatibleBrands?: string[];
  description: string;
  images: string[];
  imageAlt: string;
  specs: Record<string, string>;
  variants: Variant[];
  featured: boolean;
  offer: boolean;
  seo: Seo;
};
export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  cover: string;
  imageAlt: string;
  category: string;
  tags: string[];
  status: "published" | "draft";
  date: string;
  seo: Seo;
};
export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};
export type OrderLine = CartLine & {
  name: string;
  variant: string;
  price: number;
  image: string;
};
export type Order = {
  bluePoints?: number;
  id: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: "ثبت آزمایشی" | "در حال آماده‌سازی" | "تحویل شده";
  contact: { name: string; phone: string; address: string; postal: string };
};
export type Address = {
  id: string;
  title: string;
  text: string;
  postal: string;
};
export type StoreSettings = {
  name: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  banner: string;
  discountCode: string;
  discountPercent: number;
  brands: string[];
  categories: string[];
};
