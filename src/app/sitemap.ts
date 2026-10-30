import type { MetadataRoute } from "next";
import { branding } from "@/lib/brand";
import { repository } from "@/lib/repository";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/products",
    "/blog", "/club",
    "/about",
    "/contact",
    "/faq",
    "/delivery",
    "/returns",
    "/policy",
    ...repository.products().map((p) => `/products/${p.slug}`),
    ...repository.articles().map((a) => `/blog/${a.slug}`),
  ].map((path) => ({ url: `${branding.url}${path}` }));
}
