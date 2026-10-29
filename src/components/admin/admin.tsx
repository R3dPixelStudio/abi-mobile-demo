"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  CircleHelp,
  Eye,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Tags,
  Trash2,
} from "lucide-react";
import { useArticles, useCatalog, useStore } from "@/lib/store";
import { date, money, normalize, number, priceOf } from "@/lib/domain";
import { settingsSchema } from "@/lib/validation";
import type { Article, Product, StoreSettings, Order } from "@/lib/types";
import { DemoNote, Modal } from "@/components/ui";
import {
  ArticleEditor,
  Field,
  freshArticle,
  freshProduct,
  ProductEditor,
} from "./editors";

export const adminSections = [
  "products",
  "articles",
  "orders",
  "offers",
  "homepage",
  "taxonomies",
  "settings",
] as const;
export type AdminSection = (typeof adminSections)[number] | "dashboard";
const navigation = [
  { id: "dashboard", label: "نمای کلی", icon: LayoutDashboard },
  { id: "products", label: "محصولات", icon: Package },
  { id: "orders", label: "سفارش‌ها", icon: ShoppingBag },
  { id: "articles", label: "مجله", icon: BookOpen },
  { id: "taxonomies", label: "برندها و دسته‌ها", icon: Tags },
  { id: "offers", label: "پیشنهادها و تخفیف", icon: Tag },
  { id: "homepage", label: "صفحه اصلی", icon: Home },
  { id: "settings", label: "تنظیمات", icon: Settings },
];
const statuses: Order["status"][] = [
  "ثبت آزمایشی",
  "در حال آماده‌سازی",
  "تحویل شده",
];
function NoRows({ text }: { text: string }) {
  return (
    <div className="admin-no-rows">
      <Package size={32} />
      <p>{text}</p>
    </div>
  );
}
function ProductTable({
  products,
  edit,
  remove,
}: {
  products: Product[];
  edit: (p: Product) => void;
  remove: (p: Product) => void;
}) {
  return products.length ? (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>محصول</th>
            <th>دسته‌بندی</th>
            <th>قیمت از</th>
            <th>موجودی کل</th>
            <th>نمایش</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="admin-product-cell">
                  <img src={p.images[0]} alt="" width={42} height={52} />
                  <div>
                    <strong>{p.name}</strong>
                    <small dir="ltr">
                      {p.brand} · {p.slug}
                    </small>
                  </div>
                </div>
              </td>
              <td>{p.category}</td>
              <td className="admin-nowrap">{money(priceOf(p))}</td>
              <td>
                <span
                  className={`badge ${p.variants.some((v) => v.stock > 0) ? "admin-in-stock" : "admin-out-stock"}`}
                >
                  {number(p.variants.reduce((n, v) => n + v.stock, 0))} عدد
                </span>
              </td>
              <td>
                <div className="admin-badges">
                  {p.featured && <span className="badge">منتخب</span>}
                  {p.offer && <span className="badge">پیشنهاد</span>}
                  {!p.featured && !p.offer && (
                    <span className="muted">معمولی</span>
                  )}
                </div>
              </td>
              <td>
                <div className="admin-actions">
                  <Link
                    className="admin-icon-button"
                    title="پیش‌نمایش محصول"
                    aria-label={`پیش‌نمایش ${p.name}`}
                    href={`/preview/product?id=${encodeURIComponent(p.id)}`}
                  >
                    <Eye size={17} />
                  </Link>
                  <button
                    className="admin-icon-button"
                    aria-label={`ویرایش ${p.name}`}
                    onClick={() => edit(p)}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    className="admin-icon-button admin-delete"
                    aria-label={`حذف ${p.name}`}
                    onClick={() => remove(p)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <NoRows text="محصولی با این مشخصات پیدا نشد." />
  );
}
function Orders({ compact = false }: { compact?: boolean }) {
  const orders = useStore((s) => s.orders);
  const update = useStore((s) => s.updateOrder);
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const filtered = orders
    .filter((o) => !filter || o.status === filter)
    .slice(0, compact ? 5 : 100);
  return (
    <>
      <div className="admin-section-head">
        <div>
          <h2>{compact ? "آخرین سفارش‌ها" : "سفارش‌های آزمایشی"}</h2>
          <p className="tiny muted">
            سفارش‌های ساختگی اولیه و خریدهای آزمایشی همین مرورگر.
          </p>
        </div>
        {compact ? (
          <Link href="/admin/orders" className="text-link">
            مشاهده همه <ChevronLeft size={16} />
          </Link>
        ) : (
          <label className="field">
            <span className="sr-only">فیلتر وضعیت سفارش</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">همه وضعیت‌ها</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {filtered.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>سفارش</th>
                <th>مشتری</th>
                <th>تاریخ</th>
                <th>مبلغ</th>
                <th>وضعیت</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td dir="ltr">{o.id}</td>
                  <td>{o.contact.name}</td>
                  <td className="admin-nowrap">{date(o.date)}</td>
                  <td className="admin-nowrap">{money(o.total)}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      aria-label={`وضعیت سفارش ${o.id}`}
                      value={o.status}
                      onChange={(e) =>
                        update(o.id, e.target.value as Order["status"])
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="admin-icon-button"
                      aria-label={`جزئیات سفارش ${o.id}`}
                      onClick={() => setDetail(o)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoRows
          text={
            filter
              ? "سفارشی با این وضعیت وجود ندارد."
              : "هنوز سفارش آزمایشی ثبت نشده است. از فروشگاه یک خرید نمونه انجام دهید."
          }
        />
      )}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="جزئیات سفارش آزمایشی"
      >
        {detail && (
          <div className="stack">
            <strong dir="ltr">{detail.id}</strong>
            <p>
              {detail.contact.name} · <bdi>{detail.contact.phone}</bdi>
            </p>
            <p>{detail.contact.address}</p>
            <p className="tiny muted">
              کد پستی: <bdi>{detail.contact.postal}</bdi>
            </p>
            {detail.lines.map((l) => (
              <div
                key={`${l.productId}-${l.variantId}`}
                className="admin-inline"
              >
                <div>
                  <strong>{l.name}</strong>
                  <p className="tiny muted">
                    {l.variant} · {number(l.quantity)} عدد
                  </p>
                </div>
                <span>{money(l.price * l.quantity)}</span>
              </div>
            ))}
            <hr />
            <div className="admin-inline">
              <span>تخفیف</span>
              <strong>{money(detail.discount)}</strong>
            </div>
            <div className="admin-inline">
              <span>هزینه ارسال</span>
              <strong>{money(detail.delivery)}</strong>
            </div>
            <div className="admin-inline">
              <span>جمع کل</span>
              <strong>{money(detail.total)}</strong>
            </div>
            <DemoNote>
              این رسید آزمایشی است؛ هیچ پرداخت یا ارسال واقعی انجام نشده است.
            </DemoNote>
          </div>
        )}
      </Modal>
    </>
  );
}
function SettingsForm({ section }: { section: AdminSection }) {
  const current = useStore((s) => s.settings);
  const save = useStore((s) => s.saveSettings);
  const products = useCatalog();
  const saveProduct = useStore((s) => s.saveProduct);
  const [draft, setDraft] = useState(current);
  const [brands, setBrands] = useState(current.brands.join("\n"));
  const [categories, setCategories] = useState(current.categories.join("\n"));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  };
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const split = (s: string) => [
      ...new Set(
        s
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean),
      ),
    ];
    const result = settingsSchema.safeParse({
      ...draft,
      brands: split(brands),
      categories: split(categories),
    });
    if (!result.success) {
      setError(
        "فیلدهای الزامی را کامل کنید. درصد تخفیف بین ۰ تا ۵۰، کد ۲ تا ۲۰ نویسه، و فهرست برند و دسته هر کدام ۱ تا ۳۰ مورد باشد.",
      );
      return;
    }
    try {
      save(result.data);
      setSaved(true);
    } catch {
      setError("ذخیره‌سازی انجام نشد. ورودی‌ها را بررسی کنید.");
    }
  }
  return (
    <div className="stack">
      <form className="panel stack admin-settings" onSubmit={submit}>
        <h2>
          {section === "offers"
            ? "کد تخفیف فروشگاه"
            : section === "homepage"
              ? "محتوای صفحه اصلی"
              : section === "taxonomies"
                ? "فهرست‌های کاتالوگ"
                : "هویت فروشگاه"}
        </h2>
        <div className="form-grid">
          {section === "settings" && (
            <>
              <Field label="نام فروشگاه *">
                <input
                  required
                  maxLength={300}
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field label="شعار برند *">
                <input
                  required
                  maxLength={300}
                  value={draft.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </Field>
            </>
          )}
          {section === "homepage" && (
            <>
              <Field
                label="عنوان اصلی *"
                full
                hint="برای شکست سطر از Enter استفاده کنید."
              >
                <textarea
                  required
                  rows={2}
                  maxLength={300}
                  value={draft.heroTitle}
                  onChange={(e) => update("heroTitle", e.target.value)}
                />
              </Field>
              <Field label="متن معرفی *" full>
                <textarea
                  required
                  rows={3}
                  maxLength={600}
                  value={draft.heroText}
                  onChange={(e) => update("heroText", e.target.value)}
                />
              </Field>
              <Field label="متن نوار اطلاع‌رسانی *" full>
                <input
                  required
                  maxLength={300}
                  value={draft.banner}
                  onChange={(e) => update("banner", e.target.value)}
                />
              </Field>
            </>
          )}
          {section === "offers" && (
            <>
              <Field
                label="کد تخفیف *"
                hint="این کد در سبد خرید نمونه قابل استفاده است."
              >
                <input
                  dir="ltr"
                  required
                  minLength={2}
                  maxLength={20}
                  value={draft.discountCode}
                  onChange={(e) =>
                    update("discountCode", e.target.value.trim().toUpperCase())
                  }
                />
              </Field>
              <Field
                label="درصد تخفیف *"
                hint="بین ۰ تا ۵۰ درصد؛ صفر یعنی بدون تخفیف"
              >
                <input
                  required
                  type="number"
                  min={0}
                  max={50}
                  step={1}
                  value={draft.discountPercent}
                  onChange={(e) =>
                    update("discountPercent", Number(e.target.value))
                  }
                />
              </Field>
            </>
          )}
          {section === "taxonomies" && (
            <>
              <Field label="برندها *" hint="هر خط یک برند؛ حداکثر ۳۰ مورد">
                <textarea
                  required
                  rows={9}
                  value={brands}
                  onChange={(e) => {
                    setBrands(e.target.value);
                    setSaved(false);
                  }}
                />
              </Field>
              <Field
                label="دسته‌بندی محصولات *"
                hint="هر خط یک دسته؛ حداکثر ۳۰ مورد"
              >
                <textarea
                  required
                  rows={9}
                  value={categories}
                  onChange={(e) => {
                    setCategories(e.target.value);
                    setSaved(false);
                  }}
                />
              </Field>
              <p className="admin-full tiny muted">
                این فهرست‌ها گزینه‌های فرم محصول را تغییر می‌دهند. برای تغییر
                برند یا دسته محصولات موجود، خود محصول را ویرایش کنید.
              </p>
            </>
          )}
        </div>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-inline">
          <button className="btn primary" type="submit">
            ذخیره تغییرات
          </button>
          {saved && (
            <span role="status" className="admin-saved">
              <Check size={17} /> تغییرات محلی ذخیره شد
            </span>
          )}
        </div>
      </form>
      {(section === "homepage" || section === "offers") && (
        <section className="panel stack">
          <h2>
            {section === "homepage"
              ? "محصولات منتخب صفحه اصلی"
              : "محصولات بخش پیشنهادها"}
          </h2>
          <p className="muted tiny">
            انتخاب هر محصول بلافاصله در فروشگاه محلی اعمال می‌شود.
          </p>
          <div className="admin-pick-grid">
            {products.map((p) => (
              <label className="admin-product-pick" key={p.id}>
                <input
                  type="checkbox"
                  checked={section === "homepage" ? p.featured : p.offer}
                  onChange={(e) =>
                    saveProduct({
                      ...p,
                      [section === "homepage" ? "featured" : "offer"]:
                        e.target.checked,
                    })
                  }
                />
                <img src={p.images[0]} alt="" width={36} height={44} />
                <span>
                  {p.name}
                  <small>{money(priceOf(p))}</small>
                </span>
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export function Admin({ section = "dashboard" }: { section?: AdminSection }) {
  const ready = useStore((s) => s.ready);
  const admin = useStore((s) => s.admin);
  const patch = useStore((s) => s.patch);
  const settings = useStore((s) => s.settings);
  const products = useCatalog();
  const articles = useArticles();
  const orders = useStore((s) => s.orders);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const deleteArticle = useStore((s) => s.deleteArticle);
  const reset = useStore((s) => s.reset);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [confirm, setConfirm] = useState<{
    kind: "product" | "article" | "reset";
    id?: string;
    label: string;
  } | null>(null);
  const page = navigation.find((n) => n.id === section)!;
  const visibleProducts = products.filter(
    (p) =>
      (!kind || p.kind === kind) &&
      normalize(`${p.name} ${p.brand} ${p.slug}`).includes(normalize(search)),
  );
  const visibleArticles = articles.filter((a) =>
    normalize(`${a.title} ${a.category} ${a.slug}`).includes(normalize(search)),
  );
  const lowStock = products.filter((p) => p.variants.some((v) => v.stock <= 3));
  function doDelete() {
    if (!confirm) return;
    if (confirm.kind === "reset") reset();
    else if (confirm.kind === "product") deleteProduct(confirm.id!);
    else deleteArticle(confirm.id!);
    setConfirm(null);
  }
  if (!ready)
    return (
      <main className="admin-login" aria-busy="true">
        <p>در حال آماده‌سازی پنل…</p>
      </main>
    );
  if (!admin)
    return (
      <main className="admin-login" dir="rtl">
        <div className="admin-login-card">
          <Link className="admin-wordmark" href="/">
            آبی<span>موبایل</span>
            <i />
          </Link>
          <div className="admin-login-icon">
            <ShieldCheck size={34} strokeWidth={1.5} />
          </div>
          <span className="eyebrow">پشت صحنه یک انتخاب روشن</span>
          <h1>فضای مدیریت فروشگاه</h1>
          <p className="muted">
            محصولات، مجله و تجربه فروشگاه را در یک پنل ساده مدیریت کنید.
          </p>
          <DemoNote>
            این پنل یک دموی محلی بدون احراز هویت است. تغییرات فقط در مرورگر شما
            ذخیره می‌شوند. اطلاعات حساس یا واقعی وارد نکنید.
          </DemoNote>
          <button
            className="btn primary"
            onClick={() => patch({ admin: true })}
          >
            ورود به پنل نمایشی <ArrowUpLeft size={18} />
          </button>
          <Link className="text-link" href="/">
            بازگشت به فروشگاه <ChevronLeft size={16} />
          </Link>
        </div>
      </main>
    );
  return (
    <div className="admin-shell" dir="rtl">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-wordmark">
          آبی<span>موبایل</span>
          <i />
        </Link>
        <span className="admin-sidebar-caption">مدیریت فروشگاه</span>
        <nav aria-label="منوی مدیریت">
          {navigation.map((n) => (
            <Link
              key={n.id}
              href={n.id === "dashboard" ? "/admin" : `/admin/${n.id}`}
              aria-current={n.id === section ? "page" : undefined}
              className={n.id === section ? "active" : ""}
            >
              <n.icon size={20} strokeWidth={1.7} />
              <span>{n.label}</span>
              {n.id === "orders" && orders.length > 0 && (
                <small>{number(orders.length)}</small>
              )}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-local-pill">
            <span /> نسخه نمایشی محلی
          </div>
          <p>
            فضایی برای تجربه مدیریت،
            <br />
            پیش از راه‌اندازی واقعی.
          </p>
          <Link href="/" className="btn secondary">
            مشاهده فروشگاه <ArrowUpLeft size={16} />
          </Link>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="muted">پنل مدیریت</span>
            <ChevronLeft size={14} />
            <strong>{page.label}</strong>
          </div>
          <div>
            <span className="admin-avatar">آ</span>
            <span className="admin-user-label">مدیر نمایشی</span>
            <button
              className="admin-icon-button"
              title="خروج از پنل"
              aria-label="خروج از پنل نمایشی"
              onClick={() => patch({ admin: false })}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="admin-content" id="main">
          <div className="page-heading admin-page-heading">
            <div>
              <span className="eyebrow">
                {section === "dashboard"
                  ? "یک نگاه، همه چیز روشن"
                  : "فروشگاه شما، به سلیقه شما"}
              </span>
              <h1>
                {section === "dashboard" ? "سلام، روزتان روشن" : page.label}
              </h1>
              <p className="muted">
                {section === "dashboard"
                  ? "امروز در فروشگاه آبی‌موبایل چه خبر است؟"
                  : "تغییرات این بخش فقط در پیش‌نمایش همین مرورگر ذخیره می‌شوند."}
              </p>
            </div>
            <Link className="btn secondary" href="/">
              مشاهده فروشگاه <ArrowUpLeft size={17} />
            </Link>
          </div>
          {section === "dashboard" && (
            <>
              <div className="stat-grid">
                {[
                  {
                    label: "محصول در کاتالوگ",
                    value: number(products.length),
                    icon: Package,
                    note: `${number(products.filter((p) => p.featured).length)} محصول منتخب`,
                    tint: "blue",
                  },
                  {
                    label: "سفارش آزمایشی",
                    value: number(orders.length),
                    icon: ShoppingBag,
                    note: "فقط سفارش‌های این مرورگر",
                    tint: "green",
                  },
                  {
                    label: "مبلغ سفارش‌های نمونه",
                    value: money(orders.reduce((n, o) => n + o.total, 0)),
                    icon: BarChart3,
                    note: "هیچ پرداخت واقعی انجام نشده",
                    tint: "violet",
                  },
                  {
                    label: "مقاله مجله",
                    value: number(articles.length),
                    icon: BookOpen,
                    note: `${number(articles.filter((a) => a.status === "draft").length)} پیش‌نویس`,
                    tint: "orange",
                  },
                ].map((s) => (
                  <div className="stat-card" key={s.label}>
                    <div className="admin-inline">
                      <span className="muted">{s.label}</span>
                      <span className={`admin-stat-icon ${s.tint}`}>
                        <s.icon size={21} />
                      </span>
                    </div>
                    <strong>{s.value}</strong>
                    <small>{s.note}</small>
                  </div>
                ))}
              </div>
              <div className="admin-dashboard-grid">
                <section className="panel admin-welcome">
                  <span className="eyebrow">از اینجا شروع کنید</span>
                  <h2>
                    ویترین بعدی شما،
                    <br />
                    با یک انتخاب تازه.
                  </h2>
                  <p>
                    محصول جدید اضافه کنید، یک راهنمای خرید بنویسید یا صفحه اصلی
                    را به‌روز کنید.
                  </p>
                  <div className="admin-actions">
                    <button
                      className="btn primary"
                      onClick={() => setProduct(freshProduct("phone"))}
                    >
                      <Plus size={17} /> محصول جدید
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => setArticle(freshArticle())}
                    >
                      نوشتن مقاله <Pencil size={16} />
                    </button>
                  </div>
                  <div className="admin-welcome-art" aria-hidden="true">
                    <Package size={100} strokeWidth={0.7} />
                  </div>
                </section>
                <section className="panel admin-stock">
                  <div className="admin-section-head">
                    <h2>نیازمند توجه</h2>
                    <span className="badge">
                      {number(lowStock.length)} محصول
                    </span>
                  </div>
                  <p className="tiny muted">
                    محصولاتی با حداقل یک تنوع با موجودی ۳ یا کمتر
                  </p>
                  {lowStock.slice(0, 3).map((p) => (
                    <button
                      className="admin-stock-row"
                      key={p.id}
                      onClick={() => setProduct(p)}
                    >
                      <span>{p.name}</span>
                      <span className="admin-low-stock">
                        موجودی کم <ChevronLeft size={14} />
                      </span>
                    </button>
                  ))}
                  {!lowStock.length && (
                    <p className="admin-saved">
                      <Check size={18} /> موجودی همه تنوع‌ها مناسب است.
                    </p>
                  )}
                  <Link href="/admin/products" className="text-link">
                    مدیریت موجودی <ChevronLeft size={15} />
                  </Link>
                </section>
              </div>
              <section className="panel">
                <Orders compact />
              </section>
              <div className="admin-help">
                <CircleHelp size={19} />
                <p>
                  پنل نمایشی است؛ داده‌ها روی دستگاه شما باقی می‌مانند. برای
                  بازگشت به نمونه اولیه از بخش تنظیمات استفاده کنید.
                </p>
              </div>
            </>
          )}
          {section === "products" && (
            <section className="panel">
              <div className="admin-toolbar">
                <label className="admin-search">
                  <Search size={18} />
                  <input
                    aria-label="جست‌وجوی محصولات"
                    placeholder="جست‌وجو در محصولات…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <select
                  aria-label="نوع محصول"
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                >
                  <option value="">همه محصولات</option>
                  <option value="phone">گوشی موبایل</option>
                  <option value="accessory">لوازم جانبی</option>
                </select>
                <div className="admin-actions">
                  <button
                    className="btn primary"
                    onClick={() => setProduct(freshProduct("phone"))}
                  >
                    <Plus size={16} /> گوشی جدید
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => setProduct(freshProduct("accessory"))}
                  >
                    لوازم جانبی جدید
                  </button>
                </div>
              </div>
              <ProductTable
                products={visibleProducts}
                edit={setProduct}
                remove={(p) =>
                  setConfirm({ kind: "product", id: p.id, label: p.name })
                }
              />
              <div className="admin-table-footer">
                {number(visibleProducts.length)} محصول · برای ویرایش قیمت و
                موجودی، محصول را باز کنید.
              </div>
            </section>
          )}
          {section === "articles" && (
            <section className="panel">
              <div className="admin-toolbar">
                <label className="admin-search">
                  <Search size={18} />
                  <input
                    aria-label="جست‌وجوی مقالات"
                    placeholder="جست‌وجو در مجله…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <button
                  className="btn primary"
                  onClick={() => setArticle(freshArticle())}
                >
                  <Plus size={17} /> مقاله جدید
                </button>
              </div>
              {visibleArticles.length ? (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>عنوان مقاله</th>
                        <th>دسته</th>
                        <th>وضعیت</th>
                        <th>تاریخ</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleArticles.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <strong>{a.title}</strong>
                            <small className="admin-table-sub" dir="ltr">
                              {a.slug}
                            </small>
                          </td>
                          <td>{a.category}</td>
                          <td>
                            <span className="badge">
                              {a.status === "draft"
                                ? "پیش‌نویس"
                                : "منتشرشده محلی"}
                            </span>
                          </td>
                          <td className="admin-nowrap">{date(a.date)}</td>
                          <td>
                            <div className="admin-actions">
                              <Link
                                className="admin-icon-button"
                                aria-label={`پیش‌نمایش ${a.title}`}
                                href={`/preview/article?id=${encodeURIComponent(a.id)}`}
                              >
                                <Eye size={17} />
                              </Link>
                              <button
                                className="admin-icon-button"
                                aria-label={`ویرایش ${a.title}`}
                                onClick={() => setArticle(a)}
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                className="admin-icon-button admin-delete"
                                aria-label={`حذف ${a.title}`}
                                onClick={() =>
                                  setConfirm({
                                    kind: "article",
                                    id: a.id,
                                    label: a.title,
                                  })
                                }
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <NoRows text="مقاله‌ای پیدا نشد. اولین نوشته را به مجله اضافه کنید." />
              )}
            </section>
          )}
          {section === "orders" && (
            <section className="panel">
              <Orders />
            </section>
          )}
          {["settings", "homepage", "offers", "taxonomies"].includes(
            section,
          ) && <SettingsForm key={section} section={section} />}
          {section === "settings" && (
            <section className="panel admin-reset">
              <div>
                <h2>بازنشانی نسخه نمایشی</h2>
                <p className="muted">
                  همه تغییرات محصولات، مقالات، سبد، علاقه‌مندی‌ها، سفارش‌ها و
                  تنظیمات این مرورگر پاک می‌شوند و نمونه اولیه برمی‌گردد.
                </p>
              </div>
              <button
                className="btn danger"
                onClick={() =>
                  setConfirm({ kind: "reset", label: "همه داده‌های محلی" })
                }
              >
                <RotateCcw size={17} /> بازنشانی داده‌ها
              </button>
            </section>
          )}
          <footer className="admin-footer">
            <span>{settings.name} · پنل نمایشی</span>
            <span>ساخته‌شده برای یک تجربه روشن</span>
          </footer>
        </main>
      </div>
      <Modal
        wide
        open={!!product}
        onClose={() => setProduct(null)}
        title={product?.name ? `ویرایش ${product.name}` : "افزودن محصول جدید"}
      >
        {product && (
          <ProductEditor
            key={product.id}
            product={product}
            onSaved={() => setProduct(null)}
          />
        )}
      </Modal>
      <Modal
        wide
        open={!!article}
        onClose={() => setArticle(null)}
        title={article?.title ? "ویرایش مقاله" : "مقاله جدید"}
      >
        {article && (
          <ArticleEditor
            key={article.id}
            article={article}
            onSaved={() => setArticle(null)}
          />
        )}
      </Modal>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={
          confirm?.kind === "reset"
            ? "بازنشانی همه داده‌ها؟"
            : "حذف از پیش‌نمایش محلی؟"
        }
      >
        {confirm && (
          <div className="stack">
            <p>
              «{confirm.label}»{" "}
              {confirm.kind === "reset"
                ? "بازنشانی خواهد شد. تغییرات و سفارش‌های ذخیره‌شده از دست می‌روند و از پنل خارج می‌شوید."
                : "از این مرورگر حذف می‌شود. این کار روی فروشگاه واقعی اثری ندارد."}
            </p>
            <div className="admin-actions">
              <button className="btn danger" onClick={doDelete}>
                {confirm.kind === "reset"
                  ? "بله، بازنشانی همه داده‌ها"
                  : "بله، حذف شود"}
              </button>
              <button
                className="btn secondary"
                onClick={() => setConfirm(null)}
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
