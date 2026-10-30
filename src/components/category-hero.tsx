"use client";
import Link from "next/link";
import { number } from "@/lib/domain";
const scenes = [
  {
    match: "ساعت",
    id: "watch",
    name: "ساعت هوشمند",
    title: "زمان، به سلیقه تو.",
    text: "همراه ریتم روزت؛ از قدم‌های صبح تا آخرین اعلان شب. ساعت مناسب گوشی و سبک زندگی‌ات را پیدا کن.",
    art: "watch",
    detail: "ریتم روز / جزئیات همراه",
  },
  {
    match: "قاب",
    id: "case",
    name: "قاب و محافظ",
    title: "یک لایه از سلیقه تو.",
    text: "هم‌اندازه گوشی‌ات. نزدیک به سلیقه‌ات. از مدل دقیق شروع کن و همراهش را پیدا کن.",
    art: "case",
    detail: "برش دقیق / طراحی شخصی",
  },
  {
    match: "گلس",
    id: "glass",
    name: "گلس و محافظ صفحه",
    title: "شفاف. دقیق. هم‌اندازه.",
    text: "یک لایه آرام، برای تمام چیزهایی که از پشت این صفحه می‌بینی.",
    art: "glass",
    detail: "شفافیت / تناسب / محافظت",
  },
  {
    match: "هدفون",
    id: "audio",
    name: "هدفون و هندزفری",
    title: "صدای دنیای خودت.",
    text: "از خیابان‌های شلوغ تا لحظه‌های آرام؛ همراه شنیدن‌های هر روزت را انتخاب کن.",
    art: "earbuds",
    image: "/products/gallery/airpods-pro-2-1.webp",
    detail: "ریتم تو / دنیای تو",
  },
  {
    match: "پاوربانک",
    id: "power",
    name: "پاوربانک",
    title: "آزاد از پریز.",
    text: "برای راه‌های طولانی و روزهایی که هنوز تمام نشده‌اند؛ انرژی را همراهت ببر.",
    art: "powerbank",
    image: "/products/gallery/anker-powerbank-87w-reference-1.webp",
    detail: "آماده برای مسیر بعدی",
  },
  {
    match: "شارژر",
    id: "charge",
    name: "شارژر",
    title: "انرژی برای ادامه.",
    text: "کوچک روی میز، مهم در روز تو. توان و درگاه مناسب همراهت را پیدا کن.",
    art: "charger",
    image: "/products/gallery/anker-nano-3-30w-1.webp",
    detail: "اتصال دقیق / انرژی تازه",
  },
  {
    match: "کابل",
    id: "cable",
    name: "کابل و اتصال",
    title: "فاصله‌ها را وصل کن.",
    text: "جزئیاتی ساده که کارهای هر روز را روان‌تر می‌کنند؛ یک اتصال درست، بارها و بارها.",
    art: "cable",
    detail: "یک مسیر ساده برای اتصال",
  },
];
export function CategoryHero({
  kind,
  category,
  brand,
  count,
  offer = false,
  image,
}: {
  kind: string;
  category: string;
  brand: string;
  count: number;
  offer?: boolean;
  image?: string;
}) {
  const all = !kind && !category && !offer;
  const selected = scenes.find((s) => category.includes(s.match));
  const phone = kind === "phone" || category === "گوشی موبایل";
  const theme = offer
    ? "blue-price"
    : phone
      ? "phone"
      : selected?.id || "accessories";
  const title = all
    ? "همراه‌های دنیای آبی."
    : offer
      ? "قیمت آبی. انتخاب روشن."
      : phone
        ? "همراه بعدی تو."
        : selected?.title || "جزئیات کوچک. دنیای بزرگ.";
  const label = all
    ? "فروشگاه آبی"
    : offer
      ? "قیمت آبی"
      : phone
        ? `گوشی موبایل${brand ? " · " + brand : ""}`
        : selected?.name || "لوازم جانبی";
  return (
    <>
      <section
        className={`category-hero category-scene-${theme}`}
        aria-label={`ویترین ${label}`}
      >
        <div className="category-live-field" aria-hidden="true">
          <svg viewBox="0 0 700 350" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern
                id={"grid-" + theme}
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M32 0H0V32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".4"
                />
              </pattern>
            </defs>
            <rect
              width="700"
              height="350"
              fill={`url(#grid-${theme})`}
              opacity=".25"
            />
            <g className="category-orbits">
              <ellipse cx="210" cy="190" rx="155" ry="80" />
              <ellipse cx="210" cy="190" rx="205" ry="105" />
              <ellipse cx="210" cy="190" rx="255" ry="130" />
            </g>
            <path
              className="category-wave"
              d="M-100 250 Q130 10 350 180 T850 80"
            />
            <circle className="category-satellite" cx="320" cy="130" r="4" />
          </svg>
        </div>
        <div className="category-hero-copy">
          <div className="category-series">
            <i /> دنیای آبی <span> / {label}</span>
          </div>
          <h1>{title}</h1>
          <p>
            {selected?.text ||
              (phone
                ? "از اولین پیام صبح تا آخرین قاب شب، همراهی پیدا کن که به دنیای تو نزدیک‌تر است."
                : "چیزهای کوچکی که تجربه روزمره را کامل می‌کنند؛ از یک صدای تازه تا قابی مخصوص همراهت.")}
          </p>
          <div className="category-hero-actions">
            <a href="#catalog" className="btn primary">
              {offer ? "کشف قیمت‌های آبی" : "کشف " + label} <span>↓</span>
            </a>
            <span>{number(count)} انتخاب در ویترین</span>
          </div>
        </div>
        <div className="category-hero-art" aria-hidden="true">
          <div className="category-object-platform" />
          {phone ? (
            <img
              className="category-main-object"
              src={image || "/products/iphone-16-pro.svg"}
              width="350"
              height="350"
              alt=""
            />
          ) : (
            <img
              className="category-main-object"
              src={
                category.includes("ساعت")
                  ? "/products/gallery/apple-watch-10-showcase.webp"
                  : image ||
                    selected?.image ||
                    "/products/gallery/airpods-pro-2-1.webp"
              }
              width="350"
              height="350"
              alt=""
            />
          )}
          {!selected && !phone && (
            <>
              <img
                className="category-side-object side-a"
                src="/products/gallery/anker-nano-3-30w-1.webp"
                width="140"
                height="140"
                alt=""
              />
              <img
                className="category-side-object side-b"
                src="/products/gallery/xiaomi-watch-s3-1.webp"
                width="140"
                height="140"
                alt=""
              />
            </>
          )}
          <span className="category-art-caption">
            {selected?.detail || "طراحی‌شده برای همراهی"}
            <b>ABI / {theme.toUpperCase()}</b>
          </span>
        </div>
      </section>
      {!phone && (
        <nav className="category-collections" aria-label="دنیای لوازم جانبی">
          {scenes.map((s) => (
            <Link
              key={s.id}
              className={selected?.id === s.id ? "active" : ""}
              href={
                "/products?" +
                new URLSearchParams({ kind: "accessory", category: s.name })
              }
            >
              <span>{s.name}</span>
              <small>↗</small>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
