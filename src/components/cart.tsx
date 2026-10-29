"use client";
import Link from "next/link";
import { useState } from "react";
import { Trash2, ArrowLeft, Tag, CircleCheck, ShieldCheck } from "lucide-react";
import { useCatalog, useStore } from "@/lib/store";
import { resolveCart, totals, money, normalize, digits } from "@/lib/domain";
import { contactSchema } from "@/lib/validation";
import { Breadcrumb, DemoNote, Empty, Quantity } from "./ui";
import type { Order } from "@/lib/types";
export function Cart({ checkout = false }: { checkout?: boolean }) {
  const catalog = useCatalog();
  const cart = useStore((s) => s.cart);
  const quantity = useStore((s) => s.quantity);
  const settings = useStore((s) => s.settings);
  const ready = useStore((s) => s.ready);
  const contact = useStore((s) => s.checkout);
  const patch = useStore((s) => s.patch);
  const placeOrder = useStore((s) => s.placeOrder);
  const coupon = useStore((s) => s.coupon);
  const [draftCode, setCode] = useState<string | null>(null);
  const code = draftCode ?? coupon;
  const applied =
    !!coupon && normalize(coupon) === normalize(settings.discountCode);
  const setApplied = (v: boolean) => patch({ coupon: v ? code : "" });
  const [codeError, setCodeError] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const resolved = resolveCart(cart, catalog);
  const amount = totals(
    resolved.subtotal,
    applied ? settings.discountPercent : 0,
  );
  const apply = () => {
    if (normalize(code) === normalize(settings.discountCode)) {
      setApplied(true);
      setCodeError("");
    } else {
      setApplied(false);
      setCodeError("کد واردشده معتبر نیست. کد نمونه را امتحان کنید.");
    }
  };
  if (order)
    return (
      <div className="container confirmation">
        <div className="confirmation-icon">
          <CircleCheck size={42} />
        </div>
        <span className="eyebrow">بدون پرداخت واقعی</span>
        <h1>سفارش آزمایشی‌ات ثبت شد.</h1>
        <p>
          این فقط یک شبیه‌سازی است. کالا ارسال نمی‌شود و مبلغی از شما دریافت
          نشده است.
        </p>
        <div className="panel stack">
          <div className="row between">
            <span>شماره سفارش</span>
            <bdi>{order.id}</bdi>
          </div>
          <div className="row between">
            <span>مبلغ نمایشی</span>
            <strong>{money(order.total)}</strong>
          </div>
          {order.lines.map((l) => (
            <div key={l.variantId} className="row between">
              <bdi>{l.name}</bdi>
              <span>
                {l.quantity} × {money(l.price)}
              </span>
            </div>
          ))}
        </div>
        <div className="row">
          <Link className="btn primary" href={`/account/orders?id=${order.id}`}>
            مشاهده سفارش
          </Link>
          <Link className="btn secondary" href="/products">
            ادامه گشت‌وگذار
          </Link>
        </div>
      </div>
    );
  if (!ready) return <div className="empty">در حال بازیابی سبد خرید…</div>;
  if (!cart.length)
    return (
      <div className="container">
        <Breadcrumb items={[{ label: "سبد خرید" }]} />
        <Empty
          title="سبدت منتظر یک انتخاب خوب است"
          text="گوشی یا لوازم جانبی دلخواهت را پیدا کن. برای افزودن به سبد نیازی به ورود نیست."
        />
      </div>
    );
  return (
    <div className="container">
      <Breadcrumb
        items={[
          { label: "سبد خرید", href: checkout ? "/cart" : undefined },
          ...(checkout ? [{ label: "ثبت سفارش آزمایشی" }] : []),
        ]}
      />
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {checkout ? "فقط یک قدم تا تجربه کامل" : "انتخاب‌های تو"}
          </span>
          <h1>{checkout ? "ثبت سفارش آزمایشی" : "سبد خرید"}</h1>
        </div>
        <div className="checkout-steps">
          <span className={!checkout ? "active" : ""}>۱. سبد</span>
          <span className={checkout ? "active" : ""}>۲. اطلاعات</span>
          <span>۳. تأیید</span>
        </div>
      </div>
      <DemoNote>
        از اطلاعات ساختگی استفاده کنید. این سایت پرداخت، پیامک و ارسال واقعی
        ندارد. اطلاعات واردشده فقط در مرورگر شما می‌ماند.
      </DemoNote>
      <div className="cart-layout">
        <div className="stack">
          {resolved.errors.map((e, i) => (
            <p role="alert" key={i} className="error">
              {e}
            </p>
          ))}
          {cart.map((l) => {
            const p = catalog.find((p) => p.id === l.productId);
            const v = p?.variants.find((v) => v.id === l.variantId);
            return (
              <article className="cart-line" key={l.productId + l.variantId}>
                {p && (
                  <img
                    src={p.images[0]}
                    alt={p.imageAlt}
                    width={100}
                    height={110}
                  />
                )}
                <div className="cart-line-info">
                  <h3>
                    <bdi>{p?.name || "محصول حذف‌شده"}</bdi>
                  </h3>
                  <p>
                    {v
                      ? `${v.color} · ${v.storage}`
                      : "تنوع انتخابی دیگر موجود نیست"}
                  </p>
                  {v && <strong>{money(v.price * l.quantity)}</strong>}
                </div>
                <div className="cart-line-actions">
                  {v && (
                    <Quantity
                      value={l.quantity}
                      max={Math.min(10, v.stock)}
                      onChange={(n) => quantity(l.productId, l.variantId, n)}
                    />
                  )}
                  <button
                    className="remove-btn"
                    aria-label={`حذف ${p?.name || "محصول"} از سبد`}
                    onClick={() => quantity(l.productId, l.variantId, 0)}
                  >
                    <Trash2 size={17} />
                    <span>حذف</span>
                  </button>
                </div>
              </article>
            );
          })}
          {checkout && (
            <form
              id="checkout-form"
              className="panel stack"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                const parsed = contactSchema.safeParse({
                  ...contact,
                  phone: digits(contact.phone),
                  postal: digits(contact.postal),
                });
                if (!parsed.success) {
                  setError(
                    "نام، شماره موبایل ۱۱ رقمی، نشانی حداقل ۱۰ حرفی و کد پستی ۱۰ رقمی را کامل کنید.",
                  );
                  return;
                }
                if (!confirmed) {
                  setError("نمایشی بودن سفارش را تأیید کنید.");
                  return;
                }
                patch({ checkout: parsed.data });
                const result = placeOrder(
                  applied ? settings.discountPercent : 0,
                );
                if (result) setOrder(result);
                else
                  setError(
                    "سبد یا اطلاعات معتبر نیست؛ موجودی و تعداد را بررسی کنید.",
                  );
              }}
            >
              <div className="row between">
                <h2>اطلاعات تحویل نمایشی</h2>
                <button
                  className="text-link"
                  type="button"
                  onClick={() =>
                    patch({
                      checkout: {
                        name: "کاربر آزمایشی",
                        phone: "09120000000",
                        address: "تهران، خیابان نمونه، کوچه آزمایشی، پلاک ۱۲",
                        postal: "1111111111",
                      },
                    })
                  }
                >
                  پر کردن اطلاعات نمونه
                </button>
              </div>
              <div className="form-grid">
                <label className="field">
                  نام گیرنده
                  <input
                    required
                    maxLength={80}
                    value={contact.name}
                    autoComplete="off"
                    onChange={(e) =>
                      patch({ checkout: { ...contact, name: e.target.value } })
                    }
                  />
                </label>
                <label className="field">
                  شماره موبایل نمایشی
                  <input
                    required
                    dir="ltr"
                    inputMode="tel"
                    maxLength={11}
                    value={contact.phone}
                    placeholder="09120000000"
                    autoComplete="off"
                    onChange={(e) =>
                      patch({
                        checkout: { ...contact, phone: digits(e.target.value) },
                      })
                    }
                  />
                </label>
                <label className="field full">
                  نشانی ساختگی
                  <textarea
                    required
                    maxLength={500}
                    value={contact.address}
                    autoComplete="off"
                    onChange={(e) =>
                      patch({
                        checkout: { ...contact, address: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="field">
                  کد پستی نمونه
                  <input
                    required
                    dir="ltr"
                    inputMode="numeric"
                    value={contact.postal}
                    maxLength={10}
                    placeholder="1111111111"
                    autoComplete="off"
                    onChange={(e) =>
                      patch({
                        checkout: {
                          ...contact,
                          postal: digits(e.target.value),
                        },
                      })
                    }
                  />
                </label>
                <div className="field">
                  <span>روش ارسال</span>
                  <div className="delivery-option">
                    ارسال عادی آزمایشی · بدون ارسال واقعی
                  </div>
                </div>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />{" "}
                می‌دانم این سفارش نمایشی است و هیچ پرداختی انجام نمی‌شود.
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
        <aside className="order-summary panel stack">
          <h2>خلاصه سفارش</h2>
          <div className="row between">
            <span>جمع کالاها</span>
            <strong>{money(amount.subtotal)}</strong>
          </div>
          {applied && (
            <div className="row between discount">
              <span>تخفیف نمایشی</span>
              <strong>− {money(amount.discount)}</strong>
            </div>
          )}
          <div className="row between">
            <span>ارسال نمایشی</span>
            <strong>
              {amount.delivery ? money(amount.delivery) : "رایگان"}
            </strong>
          </div>
          <div className="coupon">
            <label htmlFor="discount">
              <Tag size={15} /> کد تخفیف
            </label>
            <div>
              <input
                id="discount"
                dir="ltr"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setApplied(false);
                }}
                placeholder={settings.discountCode}
                maxLength={20}
              />
              <button className="text-link" onClick={apply}>
                اعمال
              </button>
            </div>
            <small>
              کد نمونه: <bdi>{settings.discountCode}</bdi>
            </small>
            {codeError && (
              <span className="error" role="alert">
                {codeError}
              </span>
            )}
            {applied && <span className="discount">تخفیف اعمال شد</span>}
          </div>
          <div className="summary-total row between">
            <span>مبلغ نهایی</span>
            <strong>{money(amount.total)}</strong>
          </div>
          {checkout ? (
            <button
              className="btn primary"
              type="submit"
              form="checkout-form"
              disabled={!!resolved.errors.length}
            >
              ثبت سفارش نمایشی <CircleCheck size={18} />
            </button>
          ) : resolved.errors.length ? (
            <button disabled className="btn primary">
              ابتدا سبد را اصلاح کنید
            </button>
          ) : (
            <Link className="btn primary" href="/checkout">
              ادامه و ثبت سفارش <ArrowLeft size={18} />
            </Link>
          )}
          <p className="tiny">
            <ShieldCheck size={13} style={{ display: "inline" }} /> پرداخت بانکی
            و ورود واقعی در این نسخه غیرفعال است.
          </p>
        </aside>
      </div>
    </div>
  );
}
