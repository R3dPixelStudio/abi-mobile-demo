import test from "node:test";
import assert from "node:assert/strict";
import { bluePointsFor, orderBluePoints, clubBalance } from "../src/lib/club";
import { sampleOrders } from "../src/data/orders";
import { useStore } from "../src/lib/store";
import { products } from "../src/data/products";
import { orderSchema, variantSchema } from "../src/lib/validation";
test("blue points use discounted merchandise, exclude delivery, and round down", () => {
  assert.equal(bluePointsFor(199999), 1);
  assert.equal(bluePointsFor(-1), 0);
  const order = {
    ...sampleOrders[0],
    subtotal: 500000,
    discount: 50000,
    delivery: 65000,
    total: 515000,
    bluePoints: undefined,
  };
  assert.equal(orderBluePoints(order), 4);
  assert.equal(clubBalance([order, order]), 4);
});
test("checkout snapshots earned points and preserves them through persistence without changing payable prices", () => {
  const s = useStore.getState;
  s().reset();
  const p = products.find(
    (p) => p.offer && p.variants.some((v) => v.stock > 0),
  )!;
  const v = p.variants.find((v) => v.stock > 0)!;
  s().add(p, v.id, 1);
  useStore.setState({
    checkout: {
      name: "کاربر نمونه",
      phone: "09120000000",
      address: "تهران، نشانی نمونه برای سفارش آزمایشی",
      postal: "1111111111",
    },
  });
  const order = s().placeOrder(10)!;
  assert.ok(order);
  assert.equal(order.subtotal, v.price);
  assert.equal(
    order.bluePoints,
    Math.floor((order.subtotal - order.discount) / 100000),
  );
  const restored = orderSchema.parse(JSON.parse(JSON.stringify(order)));
  assert.equal(restored.bluePoints, order.bluePoints);
  assert.equal(clubBalance([restored, restored]), order.bluePoints);
  assert.equal(
    variantSchema.safeParse({ ...v, compareAtPrice: v.price }).success,
    false,
  );
  s().reset();
});
