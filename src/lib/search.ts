import type { Product } from "./types";
import { normalize } from "./domain";
export function searchText(value: string) {
  return normalize(value)
    .replace(/آیفون|ایفون/g, "iphone")
    .replace(/سامسونگ/g, "samsung")
    .replace(/شیائومی/g, "xiaomi")
    .replace(/گوگل|پیکسل/g, "pixel")
    .replace(/آنر|انر/g, "honor")
    .replace(/[-·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function productSearchText(p: Product) {
  return searchText(
    [
      p.name,
      p.slug,
      p.brand,
      p.category,
      p.description,
      ...Object.values(p.specs),
    ].join(" "),
  );
}
function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      previous = old;
    }
  }
  return row[b.length];
}
export function similarProducts(query: string, catalog: Product[]) {
  const terms = searchText(query)
    .slice(0, 100)
    .split(" ")
    .filter((t) => t.length > 1)
    .slice(0, 8);
  if (!terms.length) return [];
  return catalog
    .map((p) => {
      const words = searchText(p.name + " " + p.brand + " " + p.category)
        .split(" ")
        .filter((w) => w.length > 1);
      let score = 0;
      for (const t of terms) {
        let best = 0;
        for (const word of words) {
          if (t === word) best = 1;
          else if (word.startsWith(t) || t.startsWith(word))
            best = Math.max(best, 0.75);
          else if (
            t.length > 2 &&
            word.length > 2 &&
            Math.abs(t.length - word.length) <= 2
          )
            best = Math.max(
              best,
              1 - distance(t, word) / Math.max(t.length, word.length),
            );
        }
        score += best >= 0.55 ? best : 0;
      }
      return { product: p, score: score / terms.length };
    })
    .filter((x) => x.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.product);
}
