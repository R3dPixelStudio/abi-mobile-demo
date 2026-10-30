"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ArrowLeft,
  Smartphone,
  Plus,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useCatalog, useStore } from "@/lib/store";
import { digits, validPhone, money, date } from "@/lib/domain";
import { addressSchema } from "@/lib/validation";
import type { Address } from "@/lib/types";
import { Breadcrumb, DemoNote, Empty, Modal } from "./ui";
import { ProductCard } from "./product-card";
import { ClubPanel } from "./club";
import { orderBluePoints } from "@/lib/club";
import { number } from "@/lib/domain";
const tabs = [
  ["", "نمای کلی", UserRound],
  ["orders", "سفارش‌های من", Package],
  ["club", "باشگاه آبی", Sparkles],
  ["addresses", "نشانی‌ها", MapPin],
  ["wishlist", "علاقه‌مندی‌ها", Heart],
  ["settings", "تنظیمات حساب", Settings],
] as const;
export function Account({ section = "" }: { section?: string }) {
  const s = useStore();
  const catalog = useCatalog();
  const query = useSearchParams();
  const [phone, setPhone] = useState("09120000000");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState<Address | null>(null);
  const [remove, setRemove] = useState<string | null>(null);
  const [draftProfile, setProfile] = useState<typeof s.profile | null>(null);
  const profile = draftProfile ?? s.profile;
  const [saved, setSaved] = useState(false);
  const order = s.orders.find((o) => o.id === query.get("id"));
  const canBrowse = section === "wishlist";
  const login = () =>
    s.patch({
      account: true,
      profile: { name: "کاربر آزمایشی", phone: digits(phone) },
    });
  if (!s.ready) return <div className="empty">در حال بازیابی حساب نمایشی…</div>;
  if (!s.account && !canBrowse)
    return (
      <div className="container login-wrap">
        <div className="login-art">
          <span className="brand-symbol">
            <span />
            <span />
            <span />
          </span>
          <h1>
            دنیای آبی،
            <br />
            کمی شخصی‌تر.
          </h1>
          <p>
            انتخاب‌ها، سفارش‌ها و همراه‌های موردعلاقه‌ات،
            <br />
            همه در یک جای آرام و مرتب.
          </p>
          <Smartphone size={160} strokeWidth={0.65} />
          <span className="tiny">حساب کاربری شبیه‌سازی‌شده</span>
        </div>
        <div className="panel login-panel">
          <span className="eyebrow">خوش آمدی</span>
          <h2>{step ? "کد ورود نمایشی" : "ورود به حساب آبی"}</h2>
          <p className="muted">
            هیچ پیامکی ارسال نمی‌شود. از شماره نمونه استفاده کن.
          </p>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (!step) {
                if (!validPhone(phone)) {
                  setError(
                    "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد.",
                  );
                  return;
                }
                setStep(1);
              } else if (digits(otp) === "123456") login();
              else setError("کد نمایشی ۱۲۳۴۵۶ را وارد کنید.");
            }}
          >
            <label className="field">
              {step ? "کد یک‌بارمصرف (OTP) نمایشی" : "شماره موبایل نمونه"}
              <input
                dir="ltr"
                inputMode={step ? "numeric" : "tel"}
                value={step ? otp : phone}
                maxLength={step ? 6 : 11}
                onChange={(e) =>
                  step
                    ? setOtp(digits(e.target.value))
                    : setPhone(digits(e.target.value))
                }
                required
              />
            </label>
            {step && (
              <DemoNote>
                کد آزمایشی: <bdi>123456</bdi> · هیچ کدی ارسال نشده است.
              </DemoNote>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn primary">
              {step ? "تأیید و ورود نمایشی" : "دریافت کد نمایشی"}
              <ArrowLeft size={17} />
            </button>
            {step && (
              <button
                type="button"
                className="text-link"
                onClick={() => setStep(0)}
              >
                ویرایش شماره
              </button>
            )}
          </form>
          <div className="login-divider">یا</div>
          <button
            className="btn secondary"
            onClick={() => {
              s.patch({
                account: true,
                profile: { name: "کاربر گوگل نمایشی", phone: "09120000000" },
              });
            }}
          >
            <span className="google-g" aria-hidden="true">
              G
            </span>{" "}
            شبیه‌سازی ورود با گوگل
          </button>
          <p className="tiny">
            این دکمه به گوگل متصل نیست و هیچ رمز یا حساب واقعی درخواست نمی‌کند.
            سبد و علاقه‌مندی‌ها حفظ می‌شوند.
          </p>
        </div>
      </div>
    );
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "حساب من" }]} />
      <div className="account-layout">
        <aside className="panel account-sidebar">
          <div className="avatar">
            <UserRound size={27} />
          </div>
          <h3>{s.account ? s.profile.name : "مهمان آبی"}</h3>
          <p className="tiny">
            {s.account
              ? "حساب نمایشی · اطلاعات ساختگی"
              : "ذخیره‌ها بدون نیاز به ورود"}
          </p>
          <nav>
            {tabs.map(([href, label, Icon]) => (
              <Link
                key={href}
                href={`/account${href ? "/" + href : ""}`}
                className={section === href ? "active" : ""}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            {s.account ? (
              <button onClick={() => s.patch({ account: false })}>
                <LogOut size={18} />
                خروج از حساب نمایشی
              </button>
            ) : (
              <Link href="/account">
                <UserRound size={18} />
                ورود نمایشی
              </Link>
            )}
          </nav>
        </aside>
        <div className="account-main stack">
          <div className="page-heading">
            <div>
              <span className="eyebrow">دنیای شخصی تو</span>
              <h1>{tabs.find((t) => t[0] === section)?.[1] || "حساب من"}</h1>
            </div>
          </div>
          <DemoNote>
            حساب و داده‌ها آزمایشی‌اند و فقط در این مرورگر ذخیره می‌شوند.
            اطلاعات واقعی وارد نکنید.
          </DemoNote>
          {section === "club" ? (
            <ClubPanel embedded />
          ) : section === "wishlist" ? (
            <>
              {catalog.filter((p) => s.wishlist.includes(p.id)).length ? (
                <div className="products-grid account-products">
                  {catalog
                    .filter((p) => s.wishlist.includes(p.id))
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              ) : (
                <Empty
                  title="انتخاب‌های دوست‌داشتنی‌ات را ذخیره کن"
                  text="روی قلب کنار هر محصول بزن تا بعداً راحت‌تر پیدایش کنی."
                />
              )}
            </>
          ) : section === "orders" ? (
            order ? (
              <div className="panel stack">
                <div className="row between">
                  <h2>
                    <bdi>{order.id}</bdi>
                  </h2>
                  <span className="badge">{order.status}</span>
                </div>
                <p className="tiny">
                  {date(order.date)} · سفارش آزمایشی، بدون پرداخت
                </p>
                {order.lines.map((l) => (
                  <div className="order-line" key={l.variantId}>
                    <img src={l.image} width={60} height={65} alt={l.name} />
                    <div>
                      <h3>
                        <bdi>{l.name}</bdi>
                      </h3>
                      <p className="tiny">
                        {l.variant} · تعداد {l.quantity}
                      </p>
                    </div>
                    <strong>{money(l.price * l.quantity)}</strong>
                  </div>
                ))}
                <div className="row between">
                  <span>کاهش با قیمت آبی</span>
                  <span>{money(order.discount)}</span>
                </div>
                <div className="row between">
                  <span>ارسال</span>
                  <span>{money(order.delivery)}</span>
                </div>
                <div className="row between">
                  <span>مبلغ نمایشی</span>
                  <strong>{money(order.total)}</strong>
                </div>
                <div className="order-earned-points">
                  ✦ {number(orderBluePoints(order))} امتیاز آبی از این سفارش
                  آزمایشی
                </div>
                <p>
                  {order.contact.name} · {order.contact.address}
                </p>
                <Link className="text-link" href="/account/orders">
                  بازگشت به سفارش‌ها
                </Link>
              </div>
            ) : s.orders.length ? (
              <div className="stack">
                {s.orders.map((o) => (
                  <Link
                    className="panel order-card"
                    key={o.id}
                    href={`/account/orders?id=${o.id}`}
                  >
                    <div>
                      <h3>
                        <bdi>{o.id}</bdi>
                      </h3>
                      <p className="tiny">
                        {date(o.date)} · {o.lines.length} کالا
                      </p>
                    </div>
                    <span className="badge">{o.status}</span>
                    <strong>{money(o.total)}</strong>
                    <ArrowLeft size={18} />
                  </Link>
                ))}
              </div>
            ) : (
              <Empty
                title="اولین سفارش آزمایشی‌ات را ثبت کن"
                text="با انتخاب محصول و تکمیل اطلاعات نمونه، مسیر خرید را تا پایان تجربه کن."
              />
            )
          ) : section === "addresses" ? (
            <>
              <button
                className="btn secondary"
                onClick={() => {
                  setError("");
                  setAddress({
                    id: crypto.randomUUID(),
                    title: "خانه",
                    text: "",
                    postal: "",
                  });
                }}
              >
                <Plus size={18} />
                نشانی جدید
              </button>
              {s.addresses.map((a) => (
                <div className="panel stack" key={a.id}>
                  <div className="row between">
                    <h3>
                      <MapPin size={16} style={{ display: "inline" }} />{" "}
                      {a.title}
                    </h3>
                    <div className="row">
                      <button
                        className="icon-btn"
                        aria-label={`ویرایش ${a.title}`}
                        onClick={() => {
                          setAddress(a);
                          setError("");
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={`حذف ${a.title}`}
                        onClick={() => setRemove(a.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p>{a.text}</p>
                  <p className="tiny">
                    کد پستی: <bdi>{a.postal}</bdi>
                  </p>
                </div>
              ))}
            </>
          ) : section === "settings" ? (
            <div className="panel stack">
              <h2>ترجیحات حساب</h2>
              <label className="check">
                <input
                  type="checkbox"
                  checked={s.notifications}
                  onChange={(e) => s.patch({ notifications: e.target.checked })}
                />{" "}
                دریافت اطلاع‌رسانی پیشنهادها (شبیه‌سازی)
              </label>
              <p className="tiny">
                هیچ پیام یا ایمیلی ارسال نمی‌شود. این انتخاب تنها در مرورگر
                ذخیره می‌شود.
              </p>
              <Link href="/policy" className="text-link">
                حریم خصوصی نسخه نمایشی <ArrowLeft size={15} />
              </Link>
            </div>
          ) : (
            <>
              <ClubPanel compact />
              <div className="account-stats">
                <Link className="panel" href="/account/orders">
                  <Package />
                  <strong>{s.orders.length}</strong>
                  <span>سفارش آزمایشی</span>
                </Link>
                <Link className="panel" href="/account/wishlist">
                  <Heart />
                  <strong>{s.wishlist.length}</strong>
                  <span>انتخاب ذخیره‌شده</span>
                </Link>
                <Link className="panel" href="/account/addresses">
                  <MapPin />
                  <strong>{s.addresses.length}</strong>
                  <span>نشانی نمونه</span>
                </Link>
              </div>
              <form
                className="panel stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  setError("");
                  if (
                    profile.name.trim().length < 2 ||
                    !validPhone(profile.phone)
                  ) {
                    setError("نام و شماره موبایل نمونه معتبر وارد کنید.");
                    return;
                  }
                  s.patch({ profile });
                  setSaved(true);
                }}
              >
                <h2>اطلاعات پروفایل</h2>
                <div className="form-grid">
                  <label className="field">
                    نام نمایشی
                    <input
                      value={profile.name}
                      maxLength={80}
                      onChange={(e) => {
                        setProfile({ ...profile, name: e.target.value });
                        setSaved(false);
                      }}
                    />
                  </label>
                  <label className="field">
                    موبایل نمونه
                    <input
                      dir="ltr"
                      value={profile.phone}
                      maxLength={11}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          phone: digits(e.target.value),
                        });
                        setSaved(false);
                      }}
                    />
                  </label>
                </div>
                {error && <p className="error">{error}</p>}
                <button className="btn primary">ذخیره اطلاعات</button>
                {saved && (
                  <p role="status" className="badge">
                    اطلاعات محلی ذخیره شد
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
      <Modal
        title="نشانی نمایشی"
        open={!!address}
        onClose={() => setAddress(null)}
      >
        {address && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = addressSchema.safeParse(address);
              if (!parsed.success) {
                setError(
                  "عنوان، نشانی حداقل ۱۰ حرفی و کد پستی ۱۰ رقمی لازم است.",
                );
                return;
              }
              s.patch({
                addresses: [
                  ...s.addresses.filter((a) => a.id !== address.id),
                  parsed.data,
                ],
              });
              setAddress(null);
            }}
          >
            <label className="field">
              عنوان
              <input
                maxLength={60}
                value={address.title}
                onChange={(e) =>
                  setAddress({ ...address, title: e.target.value })
                }
              />
            </label>
            <label className="field">
              نشانی ساختگی
              <textarea
                value={address.text}
                maxLength={500}
                onChange={(e) =>
                  setAddress({ ...address, text: e.target.value })
                }
              />
            </label>
            <label className="field">
              کد پستی
              <input
                dir="ltr"
                inputMode="numeric"
                value={address.postal}
                maxLength={10}
                onChange={(e) =>
                  setAddress({ ...address, postal: digits(e.target.value) })
                }
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn primary">ذخیره نشانی</button>
          </form>
        )}
      </Modal>
      <Modal title="حذف نشانی" open={!!remove} onClose={() => setRemove(null)}>
        <div className="stack">
          <p>این نشانی از داده‌های محلی حذف شود؟</p>
          <button
            className="btn danger"
            onClick={() => {
              s.patch({
                addresses: s.addresses.filter((a) => a.id !== remove),
              });
              setRemove(null);
            }}
          >
            حذف نشانی
          </button>
        </div>
      </Modal>
    </div>
  );
}
