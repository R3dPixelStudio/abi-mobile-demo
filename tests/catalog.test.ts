import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { products } from "../src/data/products";
import { articles } from "../src/data/articles";
import { productSchema, articleSchema } from "../src/lib/validation";
import { productJson } from "../src/lib/seo";
import { useStore } from "../src/lib/store";
import { mergeProducts, productHref } from "../src/lib/repository";
test("catalog counts, identities and all seed schemas are valid", () => {
  assert.equal(products.filter((p) => p.kind === "phone").length, 20);
  assert.ok(products.filter((p) => p.kind === "accessory").length >= 12);
  assert.equal(articles.length, 6);
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
  for (const p of products)
    assert.equal(
      productSchema.safeParse(p).success,
      true,
      `${p.id}: ${JSON.stringify(productSchema.safeParse(p))}`,
    );
  for (const a of articles)
    assert.equal(articleSchema.safeParse(a).success, true, a.id);
});
test("every bundled image exists and SVGs contain no executable content", () => {
  for (const path of [
    ...products.flatMap((p) => p.images),
    ...articles.map((a) => a.cover),
  ]) {
    assert.ok(existsSync(`public${path}`), path);
    if (path.endsWith(".svg"))
      assert.doesNotMatch(
        readFileSync(`public${path}`, "utf8"),
        /<script|onload=|javascript:|<foreignObject/i,
      );
  }
});
test("expanded catalog has watches and complete model-specific phone information", () => {
  assert.ok(products.filter((p) => p.category === "ساعت هوشمند").length >= 7);
  for (const p of products.filter((p) => p.kind === "phone")) {
    assert.ok(Object.keys(p.specs).length >= 20, p.id);
    assert.equal(p.overview?.length, 4, p.id);
    assert.ok(p.referenceUrl?.startsWith("https://"), p.id);
    assert.ok(p.images.length >= 1, p.id);
    assert.ok(
      p.images.every((image) => !/placeholder|unavailable/.test(image)),
      p.id,
    );
  }
  assert.ok(
    products.filter((p) => p.kind === "phone" && p.images.length >= 2).length >=
      16,
  );
});
test("JSON-LD explicitly converts Toman to Rial", () => {
  const p = products[0];
  assert.equal(productJson(p).offers[0].price, p.variants[0].price * 10);
  assert.equal(productJson(p).offers[0].priceCurrency, "IRR");
});
test("customer and admin flow keeps one consistent local catalog", () => {
  const s = () => useStore.getState();
  s().reset();
  const p = products[0];
  s().add(p, p.variants[0].id, 2);
  s().toggleWish(p.id);
  s().patch({ account: true });
  assert.equal(s().cart[0].quantity, 2);
  assert.ok(s().wishlist.includes(p.id));
  s().saveProduct({
    ...p,
    variants: p.variants.map((v) => ({ ...v, price: 10000000, stock: 3 })),
  });
  s().patch({
    checkout: {
      name: "کاربر آزمایشی",
      phone: "09120000000",
      address: "تهران، خیابان نمونه، پلاک ۱۲",
      postal: "1111111111",
    },
  });
  const order = s().placeOrder(10);
  assert.ok(order);
  assert.equal(order.total, 18000000);
  assert.equal(s().cart.length, 0);
  assert.equal(s().orders.length, 3);
  s().saveProduct({
    ...p,
    variants: p.variants.map((v) => ({ ...v, price: 5000000 })),
  });
  assert.equal(s().orders[0].total, 18000000);
  s().updateOrder(order.id, "تحویل شده");
  assert.equal(s().orders[0].status, "تحویل شده");
  s().reset();
  assert.equal(s().orders.length, 2);
  assert.equal(s().wishlist.length, 0);
  assert.equal(Object.keys(s().products).length, 0);
});
test("new local product has working preview path; duplicate slugs rejected", () => {
  const s = () => useStore.getState();
  s().reset();
  const p = { ...products[0], id: "new-local", slug: "new-local" };
  s().saveProduct(p);
  assert.equal(productHref(p), "/preview/product?id=new-local");
  assert.equal(
    mergeProducts(s().products, s().deletedProducts).length,
    products.length + 1,
  );
  assert.throws(() => s().saveProduct({ ...p, id: "duplicate" }));
  s().deleteProduct(p.id);
  assert.equal(
    mergeProducts(s().products, s().deletedProducts).length,
    products.length,
  );
  s().reset();
});
