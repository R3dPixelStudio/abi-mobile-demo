"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { sampleOrders } from "@/data/orders";
import { browserStorage } from "./storage";
import { defaultSettings } from "./brand";
import {
  productSchema,
  articleSchema,
  settingsSchema,
  cartSchema,
  orderSchema,
  addressSchema,
  contactSchema,
} from "./validation";
import type { Product, Article, Order, StoreSettings } from "./types";
import { mergeProducts, mergeArticles } from "./repository";
import { resolveCart, totals } from "./domain";
import { bluePointsFor } from "./club";
const persistedSchema = z.object({
  cart: cartSchema,
  coupon: z.string().max(20).default(""),
  wishlist: z.array(z.string().max(100)).max(200),
  compare: z.array(z.string().max(100)).max(3),
  products: z.record(z.string(), productSchema),
  articles: z.record(z.string(), articleSchema),
  deletedProducts: z.array(z.string()).max(200),
  deletedArticles: z.array(z.string()).max(100),
  settings: settingsSchema,
  orders: z.array(orderSchema).max(100),
  addresses: z.array(addressSchema).max(20),
  account: z.boolean(),
  admin: z.boolean(),
  profile: z.object({ name: z.string().max(80), phone: z.string().max(20) }),
  notifications: z.boolean(),
  checkout: z.object({
    name: z.string().max(80),
    phone: z.string().max(20),
    address: z.string().max(500),
    postal: z.string().max(20),
  }),
});
type Data = z.infer<typeof persistedSchema>;
type Store = Data & {
  ready: boolean;
  notice: string;
  setReady: () => void;
  notify: (s: string) => void;
  add: (p: Product, variantId: string, quantity: number) => void;
  quantity: (productId: string, variantId: string, quantity: number) => void;
  toggleWish: (id: string) => void;
  toggleCompare: (id: string) => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  saveArticle: (a: Article) => void;
  deleteArticle: (id: string) => void;
  saveSettings: (s: StoreSettings) => void;
  patch: (
    data: Partial<
      Pick<
        Data,
        | "profile"
        | "notifications"
        | "checkout"
        | "addresses"
        | "account"
        | "admin"
        | "coupon"
      >
    >,
  ) => void;
  placeOrder: (percent: number) => Order | null;
  updateOrder: (id: string, status: Order["status"]) => void;
  reset: () => void;
};
const initial: Data = {
  cart: [],
  coupon: "",
  wishlist: [],
  compare: [],
  products: {},
  articles: {},
  deletedProducts: [],
  deletedArticles: [],
  settings: defaultSettings,
  orders: sampleOrders,
  addresses: [
    {
      id: "demo-address",
      title: "خانه نمونه",
      text: "تهران، خیابان نمونه، کوچه آزمایشی، پلاک ۱۲",
      postal: "1111111111",
    },
  ],
  account: false,
  admin: false,
  profile: { name: "کاربر آزمایشی", phone: "09120000000" },
  notifications: false,
  checkout: { name: "", phone: "", address: "", postal: "" },
};
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initial,
      ready: false,
      notice: "",
      setReady: () => set({ ready: true }),
      notify: (notice) => set({ notice }),
      add: (p, id, quantity) => {
        const v = p.variants.find((v) => v.id === id);
        if (!v || v.stock < 1) return;
        const cart = get().cart;
        const existing = cart.find(
          (l) => l.productId === p.id && l.variantId === id,
        );
        const qty = Math.min(
          v.stock,
          10,
          (existing?.quantity || 0) + Math.max(1, Math.floor(quantity)),
        );
        set({
          cart: [
            ...cart.filter((l) => l !== existing),
            { productId: p.id, variantId: id, quantity: qty },
          ],
          notice: "به سبد خرید اضافه شد",
        });
      },
      quantity: (productId, variantId, quantity) =>
        set({
          cart: get().cart.flatMap((l) =>
            l.productId === productId && l.variantId === variantId
              ? quantity <= 0
                ? []
                : [{ ...l, quantity: Math.min(10, Math.floor(quantity)) }]
              : [l],
          ),
        }),
      toggleWish: (id) =>
        set({
          wishlist: get().wishlist.includes(id)
            ? get().wishlist.filter((x) => x !== id)
            : [...get().wishlist, id],
        }),
      toggleCompare: (id) => {
        const ids = get().compare;
        if (ids.includes(id)) set({ compare: ids.filter((x) => x !== id) });
        else if (ids.length < 3)
          set({ compare: [...ids, id], notice: "به مقایسه اضافه شد" });
        else set({ notice: "حداکثر سه گوشی را می‌توانید مقایسه کنید" });
      },
      saveProduct: (p) => {
        const valid = productSchema.parse(p);
        const all = mergeProducts(get().products, get().deletedProducts);
        if (all.some((x) => x.slug === p.slug && x.id !== p.id))
          throw Error("این نامک قبلاً استفاده شده است");
        set({
          products: { ...get().products, [p.id]: valid },
          deletedProducts: get().deletedProducts.filter((x) => x !== p.id),
          notice: "محصول در این مرورگر ذخیره شد",
        });
      },
      deleteProduct: (id) =>
        set({
          deletedProducts: [...new Set([...get().deletedProducts, id])],
          notice: "محصول از پیش‌نمایش محلی حذف شد",
        }),
      saveArticle: (a) => {
        const valid = articleSchema.parse(a);
        if (
          mergeArticles(get().articles, get().deletedArticles).some(
            (x) => x.slug === a.slug && x.id !== a.id,
          )
        )
          throw Error("این نامک قبلاً استفاده شده است");
        set({
          articles: { ...get().articles, [a.id]: valid },
          deletedArticles: get().deletedArticles.filter((x) => x !== a.id),
          notice: "مقاله در این مرورگر ذخیره شد",
        });
      },
      deleteArticle: (id) =>
        set({
          deletedArticles: [...new Set([...get().deletedArticles, id])],
          notice: "مقاله از پیش‌نمایش محلی حذف شد",
        }),
      saveSettings: (s) =>
        set({
          settings: settingsSchema.parse(s),
          notice: "تنظیمات محلی ذخیره شد",
        }),
      patch: (data) => set(data),
      placeOrder: (percent) => {
        const state = get();
        const contact = contactSchema.safeParse(state.checkout);
        const cart = resolveCart(
          state.cart,
          mergeProducts(state.products, state.deletedProducts),
        );
        if (!contact.success || cart.errors.length || !cart.lines.length) {
          set({ notice: "اطلاعات و موجودی سبد را دوباره بررسی کنید" });
          return null;
        }
        const amount = totals(cart.subtotal, percent);
        const order: Order = {
          id: `ABI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          date: new Date().toISOString(),
          lines: cart.lines,
          ...amount,
          bluePoints: bluePointsFor(amount.subtotal - amount.discount),
          status: "ثبت آزمایشی",
          contact: contact.data,
        };
        set({
          orders: [order, ...state.orders],
          cart: [],
          coupon: "",
          checkout: initial.checkout,
          notice: "سفارش آزمایشی ثبت شد؛ پرداختی انجام نشد",
        });
        return order;
      },
      updateOrder: (id, status) =>
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
          notice: "وضعیت سفارش محلی تغییر کرد",
        }),
      reset: () =>
        set({
          ...initial,
          ready: true,
          notice: "داده‌های نمایشی به حالت اولیه برگشتند",
        }),
    }),
    {
      name: "abi-mobile-demo-v1",
      version: 1,
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      partialize: (s) =>
        Object.fromEntries(
          Object.keys(initial).map((k) => [k, s[k as keyof Data]]),
        ),
      merge: (persisted, current) => {
        const parsed = persistedSchema.safeParse(persisted);
        return { ...current, ...(parsed.success ? parsed.data : initial) };
      },
      onRehydrateStorage: () => (state) => state?.setReady(),
    },
  ),
);
export function useCatalog() {
  const overrides = useStore((s) => s.products);
  const deleted = useStore((s) => s.deletedProducts);
  return mergeProducts(overrides, deleted);
}
export function useArticles() {
  const overrides = useStore((s) => s.articles);
  const deleted = useStore((s) => s.deletedArticles);
  return mergeArticles(overrides, deleted);
}
