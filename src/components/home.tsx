"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Smartphone,
  Headphones,
  Cable,
  BatteryCharging,
  Shield,
  Zap,
  GitCompareArrows,
  SlidersHorizontal,
  CircleCheck,
  MoveUpRight,
} from "lucide-react";
import { useCatalog, useArticles, useStore } from "@/lib/store";
import { money, date } from "@/lib/domain";
import { articleHref } from "./blog";
import { productHref } from "@/lib/repository";
import { ProductCard } from "./product-card";
import { SectionTitle } from "./ui";
const Optics = dynamic(() => import("./optics"), {
  ssr: false,
  loading: () => null,
});
export function Home() {
  const catalog = useCatalog();
  const articles = useArticles().filter((a) => a.status === "published");
  const settings = useStore((s) => s.settings);
  const hero = catalog.find((p) => p.slug === "iphone-16-pro") || catalog[0];
  const root = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
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
        setWebgl(false);
      }
    };
    reduced.addEventListener("change", change);
    const observer = new IntersectionObserver(
      ([e]) => {
        setWebgl(e.isIntersecting && !reduced.matches);
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
      <div ref={root} className="hero">
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
        <div className="hero-art">
          {webgl && <Optics />}
          {hero && (
            <>
              <img
                className="hero-product"
                src={hero.images[0]}
                alt={hero.imageAlt}
                width={400}
                height={420}
                fetchPriority="high"
              />
              <div className="hero-chip">
                <Sparkles size={15} /> جزئیاتی که تفاوت می‌سازند
              </div>
              <Link href={productHref(hero)} className="hero-label">
                <strong dir="ltr">{hero.name}</strong>
                <span>
                  از {money(hero.variants[0].price)}{" "}
                  <MoveUpRight
                    size={12}
                    style={{ display: "inline", marginInlineStart: 9 }}
                  />
                </span>
              </Link>
            </>
          )}
        </div>
        <div className="hero-pagination" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="benefit-strip">
        {[
          [GitCompareArrows, "مقایسه کنار هم", "تفاوت‌ها را دقیق‌تر ببین"],
          [
            SlidersHorizontal,
            "انتخاب متناسب با بودجه",
            "از اقتصادی تا حرفه‌ای",
          ],
          [Sparkles, "راهنمای انتخاب آبی", "پیشنهاد بر اساس نیاز تو"],
          [Shield, "یک تجربه شفاف", "قیمت و موجودی نمایشی"],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof Shield;
          return (
            <div key={String(title)}>
              <I />
              <div>
                <strong>{String(title)}</strong>
                <span>{String(text)}</span>
              </div>
            </div>
          );
        })}
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
            [Headphones, "هدفون و هندزفری", "صدای دنیای تو", "category=هدفون"],
            [BatteryCharging, "پاوربانک", "انرژی در مسیر", "category=پاوربانک"],
            [Zap, "شارژر", "آماده برای ادامه", "category=شارژر"],
            [Shield, "قاب و محافظ", "خیالت راحت‌تر", "category=قاب"],
            [Cable, "کابل و اتصال", "همه‌چیز متصل", "category=کابل"],
          ].map(([Icon, title, text, query]) => {
            const I = Icon as typeof Shield;
            return (
              <Link
                className="category-card"
                key={String(title)}
                href={`/products?${query}`}
              >
                <I />
                <strong>{String(title)}</strong>
                <span>{String(text)}</span>
              </Link>
            );
          })}
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
          title="پیشنهادهای ویژه"
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
            .filter((p) => p.kind === "accessory")
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
