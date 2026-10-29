import type { Metadata } from "next";
import { branding } from "./brand";
import type { Product } from "./types";
export function metadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      ...(image ? { images: [image] } : {}),
    },
  };
}
export function productJson(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((i) => new URL(i, branding.url).href),
    sku: p.id,
    brand: { "@type": "Brand", name: p.brand },
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      name: `${p.name} ${v.color} ${v.storage}`,
      price: v.price * 10,
      priceCurrency: "IRR",
      availability: `https://schema.org/${v.stock ? "InStock" : "OutOfStock"}`,
      url: `${branding.url}/products/${p.slug}`,
    })),
  };
}
export function breadcrumbJson(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "آبی‌موبایل", path: "/" }, ...items].map(
      (x, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: x.name,
        item: new URL(x.path, branding.url).href,
      }),
    ),
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
