import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../src/data/products";
import { fitsPhone } from "../src/lib/compatibility";
import { similarProducts } from "../src/lib/search";
test("fitted protection belongs to one exact model, including phones of the same brand", () => {
  for (const phone of products.filter((p) => p.kind === "phone")) {
    const accessories = products.filter((p) => fitsPhone(p, phone));
    assert.ok(accessories.some((p) => p.category === "قاب و محافظ"));
    assert.ok(accessories.some((p) => p.category === "گلس و محافظ صفحه"));
    for (const accessory of accessories) {
      for (const other of products.filter(
        (p) => p.kind === "phone" && p.id !== phone.id,
      ))
        assert.equal(fitsPhone(accessory, other), false);
    }
  }
});
test("typo suggestions use only the supplied catalog scope and leave unrelated searches empty", () => {
  const phones = products.filter((p) => p.kind === "phone");
  assert.ok(similarProducts("iphnoe", phones).some((p) => p.brand === "Apple"));
  assert.equal(similarProducts("zzqxwvv", phones).length, 0);
  const samsung = phones.filter((p) => p.brand === "Samsung");
  assert.ok(
    similarProducts("samsng", samsung).every((p) => p.brand === "Samsung"),
  );
});
