import { products } from "@/data/products";
import { articles } from "@/data/articles";
import type { Product, Article } from "./types";
export const repository = {
  products: () => products,
  product: (slug: string) => products.find((p) => p.slug === slug),
  articles: () => articles.filter((a) => a.status === "published"),
  article: (slug: string) =>
    articles.find((a) => a.slug === slug && a.status === "published"),
};
export function mergeRecords<T extends { id: string }>(
  seed: T[],
  overrides: Record<string, T>,
  deleted: string[],
) {
  return [
    ...seed.map((p) => overrides[p.id] || p),
    ...Object.values(overrides).filter((p) => !seed.some((s) => s.id === p.id)),
  ].filter((p) => !deleted.includes(p.id));
}
export const mergeProducts = (
  overrides: Record<string, Product>,
  deleted: string[],
) => mergeRecords(products, overrides, deleted);
export const mergeArticles = (
  overrides: Record<string, Article>,
  deleted: string[],
) => mergeRecords(articles, overrides, deleted);
export const productHref = (p: Product) =>
  products.some((s) => s.id === p.id && s.slug === p.slug)
    ? `/products/${p.slug}`
    : `/preview/product?id=${encodeURIComponent(p.id)}`;
