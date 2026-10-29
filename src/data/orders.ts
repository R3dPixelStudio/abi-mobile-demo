import { products } from "./products";
import { totals } from "../lib/domain";
import type { Order } from "../lib/types";
export const sampleOrders: Order[] = ["galaxy-a55", "charger-20w"].map(
  (id, i) => {
    const p = products.find((p) => p.id === id)!;
    const v = p.variants[0];
    return {
      id: `DEMO-100${i + 1}`,
      date: `2026-10-${25 - i}T10:00:00.000Z`,
      lines: [
        {
          productId: p.id,
          variantId: v.id,
          quantity: 1,
          name: p.name,
          variant: `${v.color} · ${v.storage}`,
          price: v.price,
          image: p.images[0],
        },
      ],
      ...totals(v.price),
      status: i ? "تحویل شده" : "در حال آماده‌سازی",
      contact: {
        name: "مشتری ساختگی",
        phone: "09120000000",
        address: "تهران، خیابان نمونه، پلاک آزمایشی ۱۲",
        postal: "1111111111",
      },
    };
  },
);
