"use client";
import {
  useState,
  useId,
  Children,
  isValidElement,
  cloneElement,
  type FormEvent,
  type ReactNode,
} from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type { Article, Product, Seo, Variant } from "@/lib/types";
import { articleSchema, productSchema } from "@/lib/validation";
import { imageSchema } from "@/lib/validation";
import { useStore } from "@/lib/store";

export function Field({
  label,
  hint,
  children,
  full = false,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  full?: boolean;
}) {
  const id = useId();
  return (
    <div className={`field ${full ? "admin-full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {Children.map(children, (child) =>
        isValidElement<{ id?: string; "aria-describedby"?: string }>(child) &&
        ["input", "select", "textarea"].includes(String(child.type))
          ? cloneElement(child, {
              id,
              "aria-describedby": hint ? `${id}-hint` : undefined,
            })
          : child,
      )}
      {hint && (
        <small className="muted" id={`${id}-hint`}>
          {hint}
        </small>
      )}
    </div>
  );
}
const emptySeo: Seo = { title: "", description: "", image: "" };
export function freshProduct(kind: Product["kind"]): Product {
  return {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    brand: "Apple",
    kind,
    category: kind === "phone" ? "گوشی موبایل" : "شارژر",
    description: "",
    images: ["/products/placeholder.svg"],
    imageAlt: "",
    specs:
      kind === "phone"
        ? { نمایشگر: "", پردازنده: "", باتری: "" }
        : { "نوع اتصال": "", سازگاری: "" },
    variants: [
      {
        id: crypto.randomUUID(),
        color: "مشکی",
        colorHex: "#252525",
        storage: kind === "phone" ? "128 GB" : "استاندارد",
        price: kind === "phone" ? 50000000 : 1000000,
        stock: 10,
      },
    ],
    featured: false,
    offer: false,
    seo: { ...emptySeo },
  };
}
export function freshArticle(): Article {
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    excerpt: "",
    content: [""],
    cover: "/editorial/guide-1.svg",
    imageAlt: "",
    category: "راهنمای خرید",
    tags: [],
    status: "draft",
    date: new Date().toISOString(),
    seo: { ...emptySeo },
  };
}
function SeoFields({
  value,
  onChange,
}: {
  value: Seo;
  onChange: (s: Seo) => void;
}) {
  return (
    <fieldset className="admin-fieldset">
      <legend>نمایش در جست‌وجو و شبکه‌های اجتماعی</legend>
      <p className="muted tiny">
        فیلدهای خالی از عنوان، توضیحات و تصویر اصلی استفاده می‌کنند. تغییرات
        محلی‌اند و در موتورهای جست‌وجو منتشر نمی‌شوند.
      </p>
      <div className="form-grid">
        <Field label="عنوان سئو" hint="حداکثر ۱۰۰ نویسه">
          <input
            maxLength={100}
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
        </Field>
        <Field label="تصویر شبکه‌های اجتماعی" hint="نشانی HTTPS یا مسیر محلی">
          <input
            dir="ltr"
            maxLength={1000}
            placeholder="/products/iphone-16.svg"
            value={value.image}
            onChange={(e) => onChange({ ...value, image: e.target.value })}
          />
        </Field>
        <Field label="توضیحات سئو" full hint="حداکثر ۳۰۰ نویسه">
          <textarea
            rows={2}
            maxLength={300}
            value={value.description}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
          />
        </Field>
      </div>
      <div className="seo-preview">
        <small>پیش‌نمایش محلی نتیجه جست‌وجو</small>
        <h3>{value.title || "عنوان صفحه از اطلاعات اصلی"}</h3>
        <p>{value.description || "توضیحات صفحه از متن اصلی انتخاب می‌شود."}</p>
        {value.image && imageSchema.safeParse(value.image).success && (
          <img
            src={value.image}
            alt="پیش‌نمایش تصویر اشتراک‌گذاری"
            width={240}
            height={126}
            loading="lazy"
          />
        )}
      </div>
    </fieldset>
  );
}
export function ProductEditor({
  product,
  onSaved,
}: {
  product: Product;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(product);
  const [images, setImages] = useState(product.images.join("\n"));
  const [specs, setSpecs] = useState(
    Object.entries(product.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  );
  const [error, setError] = useState("");
  const settings = useStore((s) => s.settings);
  const save = useStore((s) => s.saveProduct);
  const update = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const changeVariant = (id: string, change: Partial<Variant>) =>
    setDraft((d) => ({
      ...d,
      variants: d.variants.map((v) => (v.id === id ? { ...v, ...change } : v)),
    }));
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const rows = specs
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      rows.some(
        (row) =>
          row.indexOf(":") < 1 || !row.slice(row.indexOf(":") + 1).trim(),
      )
    ) {
      setError(
        "هر مشخصه را به شکل «عنوان: مقدار» در یک خط وارد کنید؛ مقدار خالی مجاز نیست.",
      );
      return;
    }
    const entries = rows.map((row) => [
      row.slice(0, row.indexOf(":")).trim(),
      row.slice(row.indexOf(":") + 1).trim(),
    ]);
    if (new Set(entries.map(([key]) => key)).size !== entries.length) {
      setError("عنوان مشخصات نباید تکراری باشد.");
      return;
    }
    const result = productSchema.safeParse({
      ...draft,
      images: images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specs: Object.fromEntries(entries),
    });
    if (!result.success) {
      setError(
        "اطلاعات معتبر نیست: نامک انگلیسی، نشانی تصاویر، قیمت (۱٬۰۰۰ تا ۱ میلیارد)، موجودی (۰ تا ۱۰٬۰۰۰) و فیلدهای الزامی را بررسی کنید. حداکثر ۶ تصویر و ۳۰ مشخصه مجاز است.",
      );
      return;
    }
    try {
      save(result.data);
      onSaved();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "ذخیره‌سازی انجام نشد. دوباره تلاش کنید.",
      );
    }
  }
  return (
    <form onSubmit={submit} className="stack admin-editor">
      <div className="form-grid">
        <Field label="نام محصول *">
          <input
            required
            maxLength={300}
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="نامک انگلیسی *" hint="برای نمونه: iphone-16-128">
          <input
            dir="ltr"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            minLength={2}
            maxLength={100}
            value={draft.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </Field>
        <Field label="برند *">
          <input
            list="admin-brand-list"
            required
            maxLength={300}
            value={draft.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
          <datalist id="admin-brand-list">
            {settings.brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </Field>
        <Field label="دسته‌بندی *">
          <input
            list="admin-category-list"
            required
            maxLength={300}
            value={draft.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <datalist id="admin-category-list">
            {settings.categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="نوع محصول">
          <select
            value={draft.kind}
            onChange={(e) => update("kind", e.target.value as Product["kind"])}
          >
            <option value="phone">گوشی موبایل</option>
            <option value="accessory">لوازم جانبی</option>
          </select>
        </Field>
        <Field label="متن جایگزین تصویر *">
          <input
            required
            maxLength={300}
            value={draft.imageAlt}
            onChange={(e) => update("imageAlt", e.target.value)}
          />
        </Field>
        <Field label="توضیحات محصول *" full>
          <textarea
            required
            maxLength={3000}
            rows={4}
            value={draft.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <Field
          label="تصاویر محصول *"
          full
          hint="هر خط یک نشانی HTTPS یا مسیر محلی؛ حداکثر ۶ تصویر. تصویر اول، تصویر اصلی است."
        >
          <textarea
            dir="ltr"
            required
            rows={3}
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </Field>
        <Field
          label="مشخصات فنی"
          full
          hint="هر خط: عنوان: مقدار — برای نمونه: باتری: ۵۰۰۰ میلی‌آمپرساعت"
        >
          <textarea
            rows={5}
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
          />
        </Field>
      </div>
      <fieldset className="admin-fieldset">
        <legend>تنوع، قیمت و موجودی</legend>
        <p className="tiny muted">
          قیمت‌ها به تومان هستند. موجودی صفر، تنوع را ناموجود می‌کند.
        </p>
        <div className="stack">
          {draft.variants.map((v, index) => (
            <div className="admin-variant" key={v.id}>
              <div className="admin-inline">
                <strong>
                  تنوع {new Intl.NumberFormat("fa").format(index + 1)}
                </strong>
                <button
                  className="btn secondary"
                  type="button"
                  disabled={draft.variants.length === 1}
                  aria-label={`حذف تنوع ${index + 1}`}
                  onClick={() =>
                    update(
                      "variants",
                      draft.variants.filter((x) => x.id !== v.id),
                    )
                  }
                >
                  <Trash2 size={16} /> حذف تنوع
                </button>
              </div>
              <div className="form-grid">
                <Field label="نام رنگ *">
                  <input
                    required
                    maxLength={100}
                    value={v.color}
                    onChange={(e) =>
                      changeVariant(v.id, { color: e.target.value })
                    }
                  />
                </Field>
                <Field label="کد رنگ">
                  <input
                    type="color"
                    value={v.colorHex}
                    onChange={(e) =>
                      changeVariant(v.id, { colorHex: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label={draft.kind === "phone" ? "حافظه *" : "مدل / اندازه *"}
                >
                  <input
                    required
                    maxLength={100}
                    value={v.storage}
                    onChange={(e) =>
                      changeVariant(v.id, { storage: e.target.value })
                    }
                  />
                </Field>
                <Field label="قیمت (تومان) *">
                  <input
                    type="number"
                    required
                    min={1000}
                    max={1000000000}
                    step={1}
                    value={v.price}
                    onChange={(e) =>
                      changeVariant(v.id, { price: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="موجودی *">
                  <input
                    type="number"
                    required
                    min={0}
                    max={10000}
                    step={1}
                    value={v.stock}
                    onChange={(e) =>
                      changeVariant(v.id, { stock: Number(e.target.value) })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn secondary"
          disabled={draft.variants.length >= 20}
          onClick={() =>
            update("variants", [
              ...draft.variants,
              {
                id: crypto.randomUUID(),
                color: "سفید",
                colorHex: "#eeeeee",
                storage: draft.kind === "phone" ? "256 GB" : "استاندارد",
                price: draft.variants[0].price,
                stock: 0,
              },
            ])
          }
        >
          <Plus size={16} /> افزودن تنوع
        </button>
      </fieldset>
      <div className="admin-checks">
        <label>
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />{" "}
          منتخب صفحه اصلی
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.offer}
            onChange={(e) => update("offer", e.target.checked)}
          />{" "}
          نمایش در پیشنهادها
        </label>
      </div>
      <SeoFields value={draft.seo} onChange={(v) => update("seo", v)} />
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-form-footer">
        <p className="tiny muted">ذخیره فقط در مرورگر فعلی انجام می‌شود.</p>
        <button className="btn primary" type="submit">
          <Save size={17} /> ذخیره محصول
        </button>
      </div>
    </form>
  );
}
export function ArticleEditor({
  article,
  onSaved,
}: {
  article: Article;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(article);
  const [content, setContent] = useState(article.content.join("\n\n"));
  const [tags, setTags] = useState(article.tags.join("، "));
  const [error, setError] = useState("");
  const save = useStore((s) => s.saveArticle);
  const update = <K extends keyof Article>(key: K, value: Article[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const result = articleSchema.safeParse({
      ...draft,
      content: content
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tags
        .split(/[,،]/)
        .map((t) => t.trim())
        .filter(Boolean),
    });
    if (!result.success) {
      setError(
        "نامک انگلیسی، نشانی تصویر و فیلدهای الزامی را بررسی کنید. حداکثر ۱۰ برچسب، ۳۰ پاراگراف و ۶٬۰۰۰ نویسه در هر پاراگراف مجاز است.",
      );
      return;
    }
    try {
      save(result.data);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره‌سازی انجام نشد.");
    }
  }
  return (
    <form className="stack admin-editor" onSubmit={submit}>
      <div className="form-grid">
        <Field label="عنوان مقاله *">
          <input
            required
            maxLength={300}
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </Field>
        <Field label="نامک انگلیسی *">
          <input
            dir="ltr"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            minLength={2}
            maxLength={100}
            value={draft.slug}
            onChange={(e) => update("slug", e.target.value)}
          />
        </Field>
        <Field label="دسته‌بندی *">
          <input
            required
            maxLength={300}
            value={draft.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </Field>
        <Field label="وضعیت">
          <select
            value={draft.status}
            onChange={(e) =>
              update("status", e.target.value as Article["status"])
            }
          >
            <option value="draft">پیش‌نویس</option>
            <option value="published">نمایش در مجله محلی</option>
          </select>
        </Field>
        <Field label="تصویر جلد *" hint="نشانی HTTPS یا مسیر محلی">
          <input
            dir="ltr"
            required
            maxLength={1000}
            value={draft.cover}
            onChange={(e) => update("cover", e.target.value)}
          />
        </Field>
        <Field label="متن جایگزین تصویر *">
          <input
            required
            maxLength={300}
            value={draft.imageAlt}
            onChange={(e) => update("imageAlt", e.target.value)}
          />
        </Field>
        <Field label="خلاصه مقاله *" full>
          <textarea
            required
            rows={3}
            maxLength={600}
            value={draft.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
          />
        </Field>
        <Field
          label="متن مقاله *"
          full
          hint="پاراگراف‌ها را با یک خط خالی جدا کنید. متن ساده ذخیره می‌شود؛ HTML اجرا نمی‌شود."
        >
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label="برچسب‌ها" full hint="حداکثر ۱۰ مورد؛ با ویرگول جدا کنید">
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </Field>
      </div>
      <SeoFields value={draft.seo} onChange={(v) => update("seo", v)} />
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-form-footer">
        <p className="tiny muted">
          انتشار در این بخش فقط پیش‌نمایش محلی مجله را تغییر می‌دهد.
        </p>
        <button className="btn primary" type="submit">
          <Save size={17} /> ذخیره مقاله
        </button>
      </div>
    </form>
  );
}
