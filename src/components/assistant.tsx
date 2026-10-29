"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpLeft,
  Bot,
  Camera,
  Check,
  Gamepad2,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  BatteryFull,
} from "lucide-react";
import { products } from "@/data/products";
import {
  assistantInput,
  candidatesFor,
  purposeAdvice,
  purposeLabels,
  validateRanking,
  type AssistantPreferences,
  type AssistantResult,
} from "@/lib/assistant";
import { money, number } from "@/lib/domain";
import { ProductCard } from "./product-card";
import { Breadcrumb, DemoNote } from "./ui";
import "./assistant.css";

const icons = {
  everyday: Smartphone,
  camera: Camera,
  battery: BatteryFull,
  gaming: Gamepad2,
};
const brands = [
  ...new Set(products.filter((p) => p.kind === "phone").map((p) => p.brand)),
];
const initial = assistantInput.parse({ budget: 30_000_000 });
const modeText: Record<AssistantResult["reason"], string> = {
  demo: "پیشنهاد نمایشی بر اساس فیلترهای شما",
  live: "مرتب‌سازی با Groq، از کاتالوگ نمونه",
  unconfigured: "اتصال زنده تنظیم نشده؛ پیشنهاد نمایشی آماده است.",
  unavailable: "اتصال زنده پاسخ نداد؛ پیشنهاد نمایشی آماده است.",
  "rate-limit":
    "سرویس زنده فعلاً در دسترس نیست یا سقف درخواست پر شده؛ پیشنهاد نمایشی آماده است.",
};

export function Assistant() {
  const [budget, setBudget] = useState("۳۰٬۰۰۰٬۰۰۰");
  const [brand, setBrand] = useState("");
  const [purpose, setPurpose] =
    useState<AssistantPreferences["use"]>("everyday");
  const [storage, setStorage] = useState(0);
  const [question, setQuestion] = useState("");
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<{
    preferences: AssistantPreferences;
    result: AssistantResult;
  } | null>(null);
  const pending = useRef<AbortController | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(
    () => () => {
      const controller = pending.current;
      pending.current = null;
      controller?.abort();
    },
    [],
  );
  useEffect(() => {
    if (answer) resultHeading.current?.focus({ preventScroll: true });
  }, [answer]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = assistantInput.safeParse({
      budget,
      brand,
      use: purpose,
      storage,
      question,
      live,
    });
    if (!parsed.success) {
      setError(
        "بودجه را به تومان و بین ۱ میلیون تا ۱ میلیارد وارد کنید. توضیحات حداکثر ۵۰۰ کاراکتر است.",
      );
      return;
    }
    const preferences = parsed.data;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    const candidates = candidatesFor(products, preferences);
    let result: AssistantResult = {
      ids: candidates.slice(0, 3).map((p) => p.id),
      mode: "demo",
      reason: "demo",
    };
    let stale = false;
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      if (live && candidates.length) {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
          signal: controller.signal,
        });
        if (!response.ok) throw Error("Request failed");
        const data: unknown = await response.json();
        if (
          !data ||
          typeof data !== "object" ||
          !("ids" in data) ||
          !("mode" in data) ||
          !("reason" in data)
        )
          throw Error("Invalid result");
        const ids = validateRanking({ ids: data.ids }, candidates);
        if (
          (data.mode !== "live" && data.mode !== "demo") ||
          typeof data.reason !== "string" ||
          !Object.hasOwn(modeText, data.reason)
        )
          throw Error("Invalid mode");
        result = {
          ids,
          mode: data.mode,
          reason: data.reason as AssistantResult["reason"],
        };
      }
    } catch {
      if (pending.current !== controller) return;
      result = { ...result, reason: "unavailable" };
    } finally {
      clearTimeout(timeout);
      stale = pending.current !== controller;
      if (!stale) {
        pending.current = null;
        setBusy(false);
      }
    }
    if (stale) return;
    setAnswer({ preferences, result });
  }

  const matches = answer ? candidatesFor(products, answer.preferences) : [];
  const selected =
    answer?.result.ids.flatMap((id) => {
      const product = matches.find((p) => p.id === id);
      return product ? [product] : [];
    }) || [];
  return (
    <div className="container assistant-page">
      <Breadcrumb items={[{ label: "دستیار خرید" }]} />
      <header className="assistant-heading">
        <div className="assistant-orb">
          <Sparkles size={30} />
        </div>
        <span className="eyebrow">یک انتخاب آگاهانه‌تر</span>
        <h1>
          گوشی مناسب تو،
          <br />
          <span>با چند سؤال ساده.</span>
        </h1>
        <p>
          از بودجه شروع کنیم. برای کار، عکس، بازی یا روزهای شلوغ؛ گزینه‌ها را با
          هم کوتاه می‌کنیم.
        </p>
        <div className="assistant-trust">
          <span>
            <ShieldCheck size={16} /> فقط از کاتالوگ فروشگاه
          </span>
          <span>
            <Check size={16} /> رعایت سقف بودجه
          </span>
          <span className="badge">نسخه نمایشی</span>
        </div>
      </header>
      <div className="assistant-layout">
        <section
          className="panel assistant-form-panel"
          aria-labelledby="assistant-form-title"
        >
          <div className="assistant-panel-head">
            <span className="assistant-step">۰۱</span>
            <div>
              <h2 id="assistant-form-title">از نیازت بگو</h2>
              <p className="muted tiny">انتخاب بهتر، با چند جزئیات کوچک</p>
            </div>
          </div>
          <form className="stack" onSubmit={submit}>
            <label className="field">
              حداکثر بودجه <span className="muted tiny">تومان</span>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                inputMode="numeric"
                maxLength={20}
                aria-describedby="budget-hint"
                required
              />
              <small className="muted" id="budget-hint">
                مثلاً ۳۰٬۰۰۰٬۰۰۰ تومان، برابر با ۳۰ میلیون
              </small>
            </label>
            <div className="assistant-budgets" aria-label="بودجه‌های پیشنهادی">
              {[20, 30, 50, 80].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setBudget(number(n * 1_000_000))}
                >
                  {number(n)} میلیون
                </button>
              ))}
            </div>
            <fieldset className="assistant-purposes">
              <legend>بیشتر برای چه کاری؟</legend>
              <div>
                {Object.entries(purposeLabels).map(([key, label]) => {
                  const value = key as AssistantPreferences["use"];
                  const Icon = icons[value];
                  return (
                    <button
                      type="button"
                      key={key}
                      className={purpose === key ? "active" : ""}
                      aria-pressed={purpose === key}
                      onClick={() => setPurpose(value)}
                    >
                      <Icon size={19} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="form-grid">
              <label className="field">
                برند مورد علاقه
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">فرقی ندارد</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                حداقل حافظه
                <select
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                >
                  <option value={0}>فرقی ندارد</option>
                  {[128, 256, 512, 1024].map((n) => (
                    <option key={n} value={n}>
                      {number(n)} گیگابایت
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="assistant-live">
              <input
                type="checkbox"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
              />
              <span>
                <strong>مرتب‌سازی با هوش مصنوعی زنده</strong>
                <small>
                  در صورت پیکربندی سرور، ترجیحات و توضیح شما به Groq ارسال
                  می‌شود.
                </small>
              </span>
            </label>
            <label className="field">
              چیز دیگری مهم است؟{" "}
              <span className="muted tiny">اختیاری؛ فقط در حالت زنده</span>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={500}
                rows={3}
                disabled={!live}
                placeholder="مثلاً بیشتر در سفر عکاسی می‌کنم و بازی سنگین ندارم."
              />
              <small className="muted">
                اطلاعات شخصی، شماره تماس یا آدرس وارد نکنید.
              </small>
            </label>
            {error && (
              <p className="assistant-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="btn primary assistant-submit"
              type="submit"
              disabled={busy}
            >
              {busy ? (
                <LoaderCircle size={19} className="assistant-spinner" />
              ) : (
                <Sparkles size={19} />
              )}{" "}
              {busy ? "در حال بررسی گزینه‌ها…" : "پیشنهادهای من را پیدا کن"}
              {!busy && <ArrowUpLeft size={19} />}
            </button>
          </form>
        </section>
        <section className="assistant-conversation" aria-busy={busy}>
          {!answer ? (
            <div className="assistant-welcome panel">
              <div className="assistant-bot">
                <Bot size={28} />
              </div>
              <span className="eyebrow">سلام، من دستیار آبی‌موبایلم</span>
              <h2>
                لیست بلند را
                <br />
                به چند انتخاب خوب برسانیم.
              </h2>
              <p>
                بودجه و اولویت‌هایت را انتخاب کن تا حداکثر سه گوشی موجود در
                کاتالوگ نمونه را پیشنهاد بدهم.
              </p>
              <div className="assistant-example">
                <span>مثلاً دنبال این هستی؟</span>
                <p>
                  «تا ۳۰ میلیون، برای کارهای روزمره و با حافظه ۲۵۶ گیگابایت»
                </p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setBudget(number(initial.budget));
                    setPurpose("everyday");
                    setStorage(256);
                    setBrand("");
                  }}
                >
                  استفاده از این مثال <ArrowUpLeft size={16} />
                </button>
              </div>
              <p className="tiny muted">
                در حالت نمایشی، فیلترها و قواعد ساده انتخاب را انجام می‌دهند.
                این حالت از مدل هوش مصنوعی استفاده نمی‌کند.
              </p>
            </div>
          ) : (
            <>
              <div className="assistant-request">
                <span>انتخاب من</span>
                <p>
                  تا {money(answer.preferences.budget)}، برای{" "}
                  {purposeLabels[answer.preferences.use]}
                  {answer.preferences.brand &&
                    `، برند ${answer.preferences.brand}`}
                  {answer.preferences.storage > 0 &&
                    `، حداقل ${number(answer.preferences.storage)} گیگابایت`}
                </p>
              </div>
              <div className="assistant-answer panel">
                <div className="assistant-answer-head">
                  <span className="assistant-bot">
                    <Sparkles size={20} />
                  </span>
                  <span className="badge">
                    {answer.result.mode === "live"
                      ? "اتصال زنده"
                      : "حالت نمایشی"}
                  </span>
                </div>
                <h2 ref={resultHeading} tabIndex={-1}>
                  {selected.length
                    ? `${number(selected.length)} گزینه برای شروع مقایسه`
                    : "با این فیلترها، گزینه‌ای پیدا نشد."}
                </h2>
                <p role="status">{modeText[answer.result.reason]}</p>
                <p>
                  {selected.length
                    ? purposeAdvice[answer.preferences.use]
                    : "بودجه را کمی بیشتر کنید، حافظه موردنیاز را کاهش دهید یا برند را روی «فرقی ندارد» بگذارید. هیچ کالای گران‌تر یا ناموجودی جایگزین نشده است."}
                </p>
                {selected.length > 0 && (
                  <p className="tiny muted">
                    قیمت کارت‌ها مربوط به تنوع موجود و متناسب با فیلتر شماست.
                    رنگ و حافظه را در صفحه محصول دوباره انتخاب کنید.
                  </p>
                )}
              </div>
              <div className="assistant-results">
                {selected.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
      <DemoNote>
        این دستیار از کاتالوگ اولیه و قیمت‌های نمونه استفاده می‌کند. تغییرات پنل
        مدیریت فقط در مرورگر ذخیره می‌شوند و به دستیار یا سرویس Groq منتقل
        نمی‌شوند. پیشنهادها تضمین کیفیت یا موجودی واقعی نیستند.
      </DemoNote>
    </div>
  );
}
