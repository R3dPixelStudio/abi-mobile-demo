import test from "node:test";
import assert from "node:assert/strict";
import {
  assistantInput,
  candidatesFor,
  validateRanking,
  readBoundedJson,
} from "../src/lib/assistant";
import type { Product } from "../src/lib/types";

const phone = (
  id: string,
  price: number,
  stock = 2,
  storage = "256 GB",
): Product => ({
  id,
  slug: id,
  name: id,
  brand: "Samsung",
  kind: "phone",
  category: "گوشی",
  description: "",
  images: ["/phone.png"],
  imageAlt: "",
  specs: { battery: "5000 mAh" },
  variants: [
    {
      id: id + "-v",
      price,
      stock,
      storage,
      color: "مشکی",
      colorHex: "#000000",
    },
  ],
  featured: false,
  offer: false,
  seo: { title: "", description: "", image: "" },
});

test("accepts Persian and Arabic grouped Toman budgets, rejects malformed values", () => {
  assert.equal(
    assistantInput.parse({ budget: "۳۰٬۰۰۰٬۰۰۰", use: "camera" }).budget,
    30_000_000,
  );
  assert.equal(
    assistantInput.parse({ budget: "٣٠,٠٠٠,٠٠٠" }).budget,
    30_000_000,
  );
  for (const budget of [
    "-10000000",
    "25abc000000",
    "",
    null,
    Infinity,
    1_000_000_001,
  ])
    assert.equal(assistantInput.safeParse({ budget }).success, false);
});
test("retrieval strictly enforces budget, stock, brand and storage and returns valid variants only", () => {
  const p = phone("valid", 25_000_000);
  p.variants.push({ ...p.variants[0], id: "sold", price: 1_000_000, stock: 0 });
  const result = candidatesFor(
    [
      p,
      phone("expensive", 40_000_000),
      phone("sold-out", 10_000_000, 0),
      phone("small", 10_000_000, 2, "128 GB"),
    ],
    assistantInput.parse({
      budget: 30_000_000,
      storage: 256,
      brand: "Samsung",
    }),
  );
  assert.deepEqual(
    result.map((x) => x.id),
    ["valid"],
  );
  assert.equal(result[0].variants.length, 1);
  assert.equal(result[0].variants[0].price, 25_000_000);
});
test("ranking rejects unknown, duplicate, empty, and excessive model IDs", () => {
  const candidates = [phone("one", 10_000_000), phone("two", 12_000_000)];
  assert.deepEqual(validateRanking({ ids: ["two", "one"] }, candidates), [
    "two",
    "one",
  ]);
  for (const ids of [
    [],
    ["unknown"],
    ["one", "one"],
    ["one", "two", "three", "four"],
  ])
    assert.throws(() => validateRanking({ ids }, candidates));
});
test("body limit uses actual stream bytes even without Content-Length", async () => {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode('{"x":"' + "a".repeat(4096) + '"}'),
      );
      controller.close();
    },
  });
  await assert.rejects(readBoundedJson(body, 4096), /large/);
  const valid = new Response('{"budget":30000000}');
  assert.deepEqual(await readBoundedJson(valid.body, 4096), {
    budget: 30000000,
  });
});
