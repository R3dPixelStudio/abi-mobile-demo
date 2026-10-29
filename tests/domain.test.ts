import test from "node:test";
import assert from "node:assert/strict";
import {
  normalize,
  totals,
  resolveCart,
  recommend,
  validPhone,
} from "../src/lib/domain";
import { productSchema } from "../src/lib/validation";
import type { Product } from "../src/lib/types";
const phone: Product = {
  id: "p",
  slug: "phone",
  name: "گوشی آبی",
  brand: "Samsung",
  kind: "phone",
  category: "گوشی",
  description: "آزمایشی",
  images: ["/products/p.webp"],
  imageAlt: "گوشی",
  specs: { حافظه: "256 GB" },
  variants: [
    {
      id: "v",
      color: "آبی",
      colorHex: "#123456",
      storage: "256 GB",
      price: 20000000,
      stock: 3,
    },
  ],
  featured: true,
  offer: false,
  seo: { title: "گوشی", description: "نمونه", image: "" },
};
test("normalizes both digit sets and Arabic search characters", () =>
  assert.equal(normalize("كي ۱۲٣"), "کی 123"));
test("accepts normalized Iranian mobile numbers", () => {
  assert.equal(validPhone("۰۹۱۲۳۴۵۶۷۸۹"), true);
  assert.equal(validPhone("123"), false);
});
test("integer Toman discount and delivery calculation", () =>
  assert.deepEqual(totals(20000000, 10), {
    subtotal: 20000000,
    discount: 2000000,
    delivery: 0,
    total: 18000000,
  }));
test("discount is bounded and zero cart has zero delivery", () => {
  assert.equal(totals(100000, 200).discount, 50000);
  assert.equal(totals(0, 10).total, 0);
});
test("stale variant cannot silently complete checkout", () => {
  assert.equal(
    resolveCart(
      [{ productId: "p", variantId: "missing", quantity: 1 }],
      [phone],
    ).errors.length,
    1,
  );
});
test("overstock quantity is rejected", () =>
  assert.equal(
    resolveCart([{ productId: "p", variantId: "v", quantity: 4 }], [phone])
      .errors.length,
    1,
  ));
test("valid cart snapshots current price", () =>
  assert.equal(
    resolveCart([{ productId: "p", variantId: "v", quantity: 2 }], [phone])
      .lines[0].price,
    20000000,
  ));
test("recommendations exclude unavailable and overbudget phones", () => {
  assert.equal(recommend([phone], { budget: 10000000 }).length, 0);
  assert.equal(recommend([phone], { budget: 25000000 })[0].id, "p");
});
test("untrusted image schemes and negative prices rejected", () => {
  assert.equal(
    productSchema.safeParse({ ...phone, images: ["javascript:alert(1)"] })
      .success,
    false,
  );
  assert.equal(
    productSchema.safeParse({
      ...phone,
      variants: [{ ...phone.variants[0], price: -1 }],
    }).success,
    false,
  );
});
