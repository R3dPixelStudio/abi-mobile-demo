"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Smartphone,
  Watch,
  Headphones,
  Cable,
  BatteryCharging,
  Shield,
  Zap,
  GitCompareArrows,
  CircleCheck,
} from "lucide-react";
import { useCatalog, useArticles, useStore } from "@/lib/store";
import { date } from "@/lib/domain";
import { articleHref } from "./blog";
import { ProductCard } from "./product-card";
import { SectionTitle } from "./ui";
import { AccessoryBrandLinks } from "./accessory-menu";
import { ClubTeaser } from "./club";
const Optics = dynamic(() => import("./optics"), {
  ssr: false,
  loading: () => null,
});
const PhoneExperience = dynamic(() => import("./phone-experience"), {
  ssr: false,
  loading: () => (
    <div className="phone-loading">
      <span>آبی</span>
      <small>یک دنیای کوچک، در حال آماده‌شدن…</small>
    </div>
  ),
});
export function Home() {
  const catalog = useCatalog();
  const articles = useArticles().filter((a) => a.status === "published");
  const settings = useStore((s) => s.settings);
  const [mood, setMood] = useState<"explore" | "compare" | "budget">("explore");
  const root = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [sceneActive, setSceneActive] = useState(true);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let context: { revert: () => void } | undefined;
    let cancelled = false;
    void import("gsap").then(({ gsap }) => {
      if (cancelled || reduced.matches) return;
      context = gsap.context(() => {
        gsap.fromTo(
          ".hero-copy > *",
          { y: 14, opacity: 0.5 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.065,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "all",
          },
        );
      }, root);
    });
    const change = () => {
      if (reduced.matches) {
        context?.revert();
      }
    };
    reduced.addEventListener("change", change);
    const observer = new IntersectionObserver(
      ([e]) => {
        setWebgl((loaded) => loaded || e.isIntersecting);
        setSceneActive(e.isIntersecting);
      },
      { rootMargin: "0px" },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      cancelled = true;
      context?.revert();
      observer.disconnect();
      reduced.removeEventListener("change", change);
    };
  }, []);
  return (
    <div className="container">
      <div ref={root} className="hero-experience">
        {webgl && (
          <Optics
            active={sceneActive}
            tone={mood === "budget" ? 1 : mood === "compare" ? 2 : 0}
          />
        )}
        <div className="hero immersive-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <i /> تکنولوژی، به سلیقه تو
            </div>
            <h1>
              {settings.heroTitle.split("\n")[0]}
              <br />
              <em>{settings.heroTitle.split("\n")[1] || "یک دنیای تازه."}</em>
            </h1>
            <p>{settings.heroText}</p>
            <div className="hero-links">
              <Link className="btn primary" href="/products?kind=phone">
                همراهت را پیدا کن <ArrowLeft size={17} />
              </Link>
              <Link className="text-link" href="/assistant">
                <Sparkles size={16} /> کمک برای انتخاب
              </Link>
            </div>
            <div className="hero-bottom">
              <CircleCheck size={14} /> انتخاب آگاهانه، با مقایسه شفاف مشخصات
            </div>
          </div>
          <div className="hero-art immersive-art">
            {webgl ? (
              <PhoneExperience mood={mood} active={sceneActive} />
            ) : (
              <div className="phone-loading">
                <span>آبی</span>
                <small>دنیای همراه تو</small>
              </div>
            )}
          </div>
        </div>
        <div className="experience-console">
          <div className="console-heading">
            <span className="console-dot" />
            <span>از زاویه تو.</span>
            <small>بچرخان. لمس کن. کشف کن.</small>
          </div>
          <div className="console-options" aria-label="حالت تجربه سه‌بعدی">
            {(
              [
                ["explore", "۰۱", "کشف آبی", "رو به یک دنیای تازه"],
                ["compare", "۰۲", "نگاهی نزدیک‌تر", "جزئیات، کمی نزدیک‌تر"],
                ["budget", "۰۳", "زیر نور آبی", "لبه‌ها و جزئیات تازه"],
              ] as const
            ).map(([id, n, title, description]) => (
              <button
                key={id}
                className={mood === id ? "active" : ""}
                onClick={() => setMood(id)}
                aria-pressed={mood === id}
              >
                <span>{n}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
                <ArrowLeft size={16} />
              </button>
            ))}
          </div>
          <div className="console-links">
            <Link href="/compare">مقایسه گوشی‌ها ↗</Link>
            <Link href="/assistant">انتخاب با بودجه تو ↗</Link>
          </div>
        </div>
      </div>
      <section className="section">
        <SectionTitle
          eyebrow="دنیای تو، انتخاب تو"
          title="از کجا شروع کنیم؟"
          href="/products"
          link="همه دسته‌ها"
        />
        <div className="category-grid">
          {[
            [Smartphone, "گوشی موبایل", "همراه هر روز", "kind=phone"],
            [Watch, "ساعت هوشمند", "ریتم زندگی تو", "category=ساعت هوشمند"],
            [Headphones, "هدفون و هندزفری", "صدای دنیای تو", "category=هدفون"],
            [BatteryCharging, "پاوربانک", "انرژی در مسیر", "category=پاوربانک"],
            [Zap, "شارژر", "آماده برای ادامه", "category=شارژر"],
            [Shield, "قاب و محافظ", "خیالت راحت‌تر", "category=قاب"],
            [Cable, "کابل و اتصال", "همه‌چیز متصل", "category=کابل"],
          ].map(([Icon, title, text, query]) => {
            const I = Icon as typeof Shield;
            return (
              <div className={"category-with-brands"} key={String(title)}>
                <Link className="category-card" href={`/products?${query}`}>
                  <I />
                  <strong>{String(title)}</strong>
                  <span>{String(text)}</span>
                </Link>
                {query === "kind=phone" && (
                  <div className="category-brand-dropdown">
                    <span>گوشی محبوبت، از برند محبوبت</span>
                    {["Apple", "Samsung", "Xiaomi", "Honor", "Google"].map(
                      (b) => (
                        <Link key={b} href={`/products?kind=phone&brand=${b}`}>
                          <b dir="ltr">{b}</b>
                          <ArrowLeft size={14} />
                        </Link>
                      ),
                    )}
                  </div>
                )}
                {String(query).startsWith("category=") && (
                  <div className="category-brand-dropdown">
                    <span>دسته و برند را انتخاب کن</span>
                    <AccessoryBrandLinks category={String(query).slice(9)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section className="section watch-showcase">
        <div className="watch-showcase-copy">
          <span className="eyebrow">زمان، به سلیقه تو</span>
          <h2>زندگی را همراهت ببند.</h2>
          <p>
            ساعت‌های هوشمند و دست‌بندهای منتخب؛ برای ریتم روز، فعالیت و لحظه‌های
            خودت.
          </p>
          <Link
            className="text-link"
            href="/products?kind=accessory&category=ساعت هوشمند"
          >
            کشف دنیای ساعت‌ها ↗
          </Link>
        </div>
        <div className="watch-showcase-products">
          {catalog
            .filter((p) => p.category === "ساعت هوشمند")
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="با دقت انتخاب شده"
          title="همراه‌های پیشنهادی آبی"
          href="/products?kind=phone"
        />
        <div className="products-grid">
          {catalog
            .filter((p) => p.kind === "phone" && p.featured)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="تازه‌های کاتالوگ نمایشی"
          title="تازه به ویترین رسیده"
          href="/products?kind=phone"
        />
        <div className="products-grid">
          {catalog
            .filter((p) => p.kind === "phone")
            .slice(-4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="section offer-section">
        <SectionTitle
          eyebrow="فرصتی برای یک انتخاب بهتر"
          title="قیمت آبی"
          href="/products?offer=1"
        />
        <div className="products-grid">
          {catalog
            .filter((p) => p.offer)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
        <p className="tiny" style={{ marginTop: 15 }}>
          قیمت‌های این بخش نیز نمونه‌اند؛ کد {settings.discountCode} را در سبد
          آزمایش کنید.
        </p>
      </section>
      <div className="split-promos section">
        <Link className="promo" href="/products?kind=accessory">
          <Headphones />
          <span className="eyebrow">جزئیات کوچک، تفاوت بزرگ</span>
          <h2>همراه‌های همراهت.</h2>
          <p>لوازمی که تجربه روزمره‌ات را کامل می‌کنند.</p>
          <span className="text-link">
            کشف لوازم جانبی <ArrowLeft size={15} />
          </span>
        </Link>
        <Link className="promo" href="/compare">
          <GitCompareArrows />
          <span className="eyebrow">بین چند گزینه مرددی؟</span>
          <h2>کنار هم، روشن‌تر.</h2>
          <p>مشخصات گوشی‌ها را بدون پیچیدگی مقایسه کن.</p>
          <span className="text-link">
            شروع مقایسه <ArrowLeft size={15} />
          </span>
        </Link>
      </div>
      <ClubTeaser />
      <div className="brand-row section" aria-label="خرید بر اساس برند">
        {["Apple", "SAMSUNG", "Xiaomi", "HONOR", "Google"].map((b, i) => (
          <Link
            key={b}
            href={`/products?brand=${["Apple", "Samsung", "Xiaomi", "Honor", "Google"][i]}`}
          >
            {b}
          </Link>
        ))}
      </div>
      <section className="section">
        <SectionTitle
          eyebrow="کامل‌کننده تجربه تو"
          title="کوچک، کاربردی، دوست‌داشتنی"
          href="/products?kind=accessory"
        />
        <div className="products-grid">
          {catalog
            .filter((p) =>
              [
                "anker-nano-3-30w",
                "soundcore-p30i",
                "anker-powerbank-87w",
                "iphone-16-pro-case",
              ].includes(p.id),
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="ai-banner section">
        <Sparkles />
        <div>
          <h2>انتخاب خوب، از یک گفت‌وگو شروع می‌شود.</h2>
          <p>
            بودجه، سلیقه و نیازت را بگو؛ دستیار آبی گزینه‌های مناسب کاتالوگ را
            پیدا می‌کند.
          </p>
        </div>
        <Link className="btn" href="/assistant">
          با آبی مشورت کن <ArrowLeft size={17} />
        </Link>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="قبل از انتخاب، بیشتر بدان"
          title="خواندنی‌های مجله آبی"
          href="/blog"
        />
        <div className="article-grid">
          {articles.slice(0, 3).map((a) => (
            <Link href={articleHref(a)} key={a.id} className="article-card">
              <img
                src={a.cover}
                alt={a.imageAlt}
                width={400}
                height={230}
                loading="lazy"
              />
              <div>
                <div className="meta">
                  <span>{a.category}</span>
                  <span>{date(a.date)}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
