import { z } from "zod";
import { digits, normalize } from "./domain";
import type { Product } from "./types";

export const purposeLabels = {
  everyday: "استفاده روزمره",
  camera: "عکاسی و ویدئو",
  battery: "شارژدهی",
  gaming: "بازی",
} as const;
export const assistantInput = z
  .object({
    budget: z.preprocess(
      (value) =>
        typeof value === "string" &&
        /^\d+$/.test(digits(value).replace(/[,٬\s]/g, ""))
          ? Number(digits(value).replace(/[,٬\s]/g, ""))
          : value,
      z.number().int().min(1_000_000).max(1_000_000_000),
    ),
    brand: z.string().trim().max(40).default(""),
    use: z
      .enum(["everyday", "camera", "battery", "gaming"])
      .default("everyday"),
    storage: z
      .union([
        z.literal(0),
        z.literal(128),
        z.literal(256),
        z.literal(512),
        z.literal(1024),
      ])
      .default(0),
    question: z.string().trim().max(500).default(""),
    live: z.boolean().default(false),
  })
  .strict();
export type AssistantPreferences = z.infer<typeof assistantInput>;
export type AssistantResult = {
  ids: string[];
  mode: "demo" | "live";
  reason: "demo" | "unconfigured" | "unavailable" | "rate-limit" | "live";
};

function storageGb(value: string) {
  const text = digits(value);
  const n = parseFloat(text) || 0;
  return /tb|ترابایت/i.test(text) ? n * 1024 : n;
}
export function candidatesFor(
  catalog: Product[],
  pref: AssistantPreferences,
): Product[] {
  const score = (product: Product) => {
    const text = normalize(
      Object.values(product.specs).join(" ") +
        " " +
        product.description +
        " " +
        product.name,
    );
    if (pref.use === "gaming")
      return /snapdragon 8|a18|a17|dimensity 9/i.test(text) ? 3 : 0;
    if (pref.use === "camera")
      return /pro|ultra|pixel/i.test(product.slug) ? 3 : 0;
    if (pref.use === "battery")
      return /[5-9]\d{3}\s*(mah|میلی)/i.test(text) ? 3 : 0;
    return 0;
  };
  return catalog
    .filter(
      (p) =>
        p.kind === "phone" &&
        (!pref.brand || normalize(p.brand) === normalize(pref.brand)),
    )
    .map((p) => ({
      ...p,
      variants: p.variants
        .filter(
          (v) =>
            v.stock > 0 &&
            v.price <= pref.budget &&
            storageGb(v.storage) >= pref.storage,
        )
        .sort((a, b) => a.price - b.price),
    }))
    .filter((p) => p.variants.length > 0)
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        a.variants[0].price - b.variants[0].price ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 12);
}
export function validateRanking(
  value: unknown,
  candidates: Product[],
): string[] {
  const result = z
    .object({ ids: z.array(z.string().max(100)).min(1).max(3) })
    .strict()
    .parse(value);
  if (
    new Set(result.ids).size !== result.ids.length ||
    result.ids.some((id) => !candidates.some((p) => p.id === id))
  )
    throw Error("Invalid catalog IDs");
  return result.ids;
}
export async function readBoundedJson(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
): Promise<unknown> {
  if (!body) throw Error("Empty body");
  const reader = body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw Error("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
}

export const purposeAdvice: Record<AssistantPreferences["use"], string> = {
  everyday:
    "برای کارهای روزمره، قیمت مناسب و حافظه کافی را اولویت بدهید؛ گران‌ترین گوشی همیشه انتخاب لازم نیست.",
  camera:
    "نام سری Pro، Ultra یا Pixel فقط نشانه اولیه برای مرتب‌سازی است؛ کیفیت واقعی دوربین با نمونه عکس و بررسی مستقل مشخص می‌شود.",
  battery:
    "ظرفیت باتری یک نشانه اولیه است؛ نمایشگر، شبکه و الگوی مصرف روی شارژدهی واقعی اثر دارند.",
  gaming:
    "مدل پردازنده برای انتخاب اولیه کمک می‌کند؛ عملکرد طولانی بازی به خنک‌سازی و خود بازی هم وابسته است.",
};
