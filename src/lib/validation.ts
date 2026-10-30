import { z } from "zod";
export const imageSchema = z
  .string()
  .max(1000)
  .refine(
    (v) => /^\/(?!\/)[\w/ .-]+$/.test(v) || /^https:\/\/[^\s]+$/.test(v),
    "نشانی تصویر باید HTTPS یا مسیر محلی باشد",
  );
const text = z.string().trim().min(1).max(300);
const slug = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const seoSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(300),
  image: z.union([imageSchema, z.literal("")]),
});
export const variantSchema = z
  .object({
    id: text,
    color: text,
    colorHex: z.string().regex(/^#[a-fA-F0-9]{6}$/),
    storage: text,
    price: z.number().int().min(1000).max(1000000000),
    compareAtPrice: z.number().int().min(1000).max(1000000000).optional(),
    stock: z.number().int().min(0).max(10000),
  })
  .refine((v) => v.compareAtPrice === undefined || v.compareAtPrice > v.price, {
    path: ["compareAtPrice"],
    message: "قیمت قبلی باید از قیمت آبی بیشتر باشد",
  });
export const productSchema = z.object({
  referenceUrl: z.string().url().max(1000).startsWith("https://").optional(),
  overview: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        text: z.string().min(1).max(1000),
      }),
    )
    .max(8)
    .optional(),
  id: text,
  slug,
  name: text,
  brand: text,
  kind: z.enum(["phone", "accessory"]),
  category: text,
  compatiblePhoneIds: z.array(text).max(100).optional(),
  compatibleBrands: z.array(text).max(30).optional(),
  description: z.string().min(1).max(3000),
  images: z.array(imageSchema).min(1).max(6),
  imageAlt: text,
  specs: z
    .record(z.string().min(1).max(80), z.string().max(300))
    .refine((v) => Object.keys(v).length <= 30),
  variants: z
    .array(variantSchema)
    .min(1)
    .max(20)
    .refine((v) => new Set(v.map((x) => x.id)).size === v.length),
  featured: z.boolean(),
  offer: z.boolean(),
  seo: seoSchema,
});
export const articleSchema = z.object({
  id: text,
  slug,
  title: text,
  excerpt: z.string().min(1).max(600),
  content: z.array(z.string().min(1).max(6000)).min(1).max(30),
  cover: imageSchema,
  imageAlt: text,
  category: text,
  tags: z.array(text).max(10),
  status: z.enum(["published", "draft"]),
  date: z.string().datetime(),
  seo: seoSchema,
});
export const settingsSchema = z.object({
  name: text,
  tagline: text,
  heroTitle: text,
  heroText: z.string().min(1).max(600),
  banner: text,
  discountCode: z.string().min(2).max(20),
  discountPercent: z.number().int().min(0).max(50),
  brands: z.array(text).min(1).max(30),
  categories: z.array(text).min(1).max(30),
});
export const cartSchema = z
  .array(
    z.object({
      productId: text,
      variantId: text,
      quantity: z.number().int().min(1).max(10),
    }),
  )
  .max(100);
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().regex(/^09\d{9}$/),
  address: z.string().trim().min(10).max(500),
  postal: z.string().regex(/^\d{10}$/),
});
export const addressSchema = z.object({
  id: text,
  title: text,
  text: z.string().min(10).max(500),
  postal: z.string().regex(/^\d{10}$/),
});
export const orderSchema = z.object({
  bluePoints: z.number().int().min(0).max(10000000).optional(),
  id: text,
  date: z.string().datetime(),
  lines: z
    .array(
      z.object({
        productId: text,
        variantId: text,
        quantity: z.number().int().min(1).max(10),
        name: text,
        variant: text,
        price: z.number().int().min(0).max(1e9),
        image: imageSchema,
      }),
    )
    .min(1)
    .max(100),
  subtotal: z.number().min(0).max(1e12),
  discount: z.number().min(0).max(1e12),
  delivery: z.number().min(0).max(1e9),
  total: z.number().min(0).max(1e12),
  status: z.enum(["ثبت آزمایشی", "در حال آماده‌سازی", "تحویل شده"]),
  contact: contactSchema,
});
