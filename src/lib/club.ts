import type { Order } from "./types";
export const BLUE_POINT_TOMAN = 100_000;
export function bluePointsFor(merchandisePaid: number) {
  return Math.floor(
    Math.max(0, Number.isFinite(merchandisePaid) ? merchandisePaid : 0) /
      BLUE_POINT_TOMAN,
  );
}
export function orderBluePoints(order: Order) {
  return order.bluePoints ?? bluePointsFor(order.subtotal - order.discount);
}
export function clubBalance(orders: Order[]) {
  return Array.from(new Map(orders.map((o) => [o.id, o])).values()).reduce(
    (n, o) => n + orderBluePoints(o),
    0,
  );
}
