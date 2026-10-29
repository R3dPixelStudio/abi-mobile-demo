import assert from "node:assert/strict";
import { products } from "../src/data/products";
import { articles } from "../src/data/articles";
async function main() {
  const base = process.env.TEST_BASE_URL || "http://127.0.0.1:8787";
  const routes = [
    "/",
    "/products",
    "/cart",
    "/checkout",
    "/compare",
    "/assistant",
    "/blog",
    "/account",
    "/account/orders",
    "/account/addresses",
    "/account/wishlist",
    "/account/settings",
    "/admin",
    "/admin/products",
    "/admin/articles",
    "/admin/orders",
    "/admin/homepage",
    "/admin/offers",
    "/admin/taxonomies",
    "/admin/settings",
    "/about",
    "/contact",
    "/faq",
    "/delivery",
    "/returns",
    "/policy",
    "/credits",
    "/preview/product?id=local-only",
    "/preview/article?id=local-only",
    ...products.map((p) => "/products/" + p.slug),
    ...articles.map((a) => "/blog/" + a.slug),
  ];
  let count = 0;
  for (const route of routes) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("x-robots-tag") || "", /noindex/, route);
    const html = await response.text();
    assert.match(html, /<html[^>]*lang="fa"[^>]*dir="rtl"/, route);
    const product = products.find((p) => route === "/products/" + p.slug);
    if (product)
      assert.ok(html.includes(product.name), `Missing SSR product ${route}`);
    const article = articles.find((a) => route === "/blog/" + a.slug);
    if (article)
      assert.ok(
        html.includes(article.content[0]),
        `Missing SSR article ${route}`,
      );
    count++;
  }
  for (const path of new Set([
    ...products.flatMap((p) => p.images),
    ...articles.map((a) => a.cover),
  ])) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") || "", /^image\//, path);
    count++;
  }
  for (const route of [
    "/products/not-a-real-model",
    "/blog/not-an-article",
    "/not-a-route",
  ])
    assert.equal((await fetch(base + route)).status, 404, route);
  const post = (body: string, origin = base, type = "application/json") =>
    fetch(base + "/api/assistant", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": type },
      body,
    });
  let response = await post(JSON.stringify({ budget: "۳۰٬۰۰۰٬۰۰۰" }));
  assert.equal(response.status, 200);
  let result = await response.json();
  assert.equal(result.mode, "demo");
  assert.ok(result.ids.length > 0);
  assert.ok(
    result.ids.every((id: string) => products.some((p) => p.id === id)),
  );
  response = await post(JSON.stringify({ budget: 30_000_000, live: true }));
  assert.equal(response.status, 200);
  result = await response.json();
  assert.equal(result.mode, "demo");
  assert.equal(result.reason, "unconfigured");
  assert.equal((await post("{}", "https://unrelated.example")).status, 403);
  assert.equal((await post("{}", base, "text/plain")).status, 415);
  assert.equal((await post("{")).status, 400);
  assert.equal((await post(JSON.stringify({ budget: -10 }))).status, 400);
  assert.equal(
    (await post(JSON.stringify({ question: "x".repeat(5000) }))).status,
    413,
  );
  assert.equal((await fetch(base + "/api/assistant")).status, 405);
  for (const route of ["/sitemap.xml", "/robots.txt"])
    assert.equal((await fetch(base + route)).status, 200, route);
  console.log(
    `PASS ${count} page/asset requests; 3 missing routes; 8 API cases; sitemap and robots. Runtime: ${base}`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
