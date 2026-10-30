import type { Product } from "@/lib/types";
import {
  ArrowUpLeft,
  ScanLine,
  Cpu,
  Camera,
  BatteryCharging,
  Layers,
} from "lucide-react";
const groups = [
  {
    title: "طراحی و نمایشگر",
    icon: ScanLine,
    test: /نمایشگر|وضوح|نوسازی|روشنایی|ابعاد|وزن|بدنه|مقاومت|جنس|اندازه/,
  },
  {
    title: "قدرت و نرم‌افزار",
    icon: Cpu,
    test: /تراشه|پردازنده|رم|حافظه|سیستم|نسخه|سازگاری|برنامه/,
  },
  {
    title: "دوربین و تصویر",
    icon: Camera,
    test: /دوربین|فیلم|لنز|تصویر|ویدئو/,
  },
  {
    title: "انرژی و اتصال",
    icon: BatteryCharging,
    test: /باتری|شارژ|درگاه|اتصال|شبکه|بلوتوث|امنیت|فناوری|توان|کابل|موقعیت/,
  },
];
export function ProductInformation({ product: p }: { product: Product }) {
  const taken = new Set<string>();
  const sections = groups.map((g) => ({
    ...g,
    entries: Object.entries(p.specs).filter(([key]) => {
      if (g.test.test(key) && !taken.has(key)) {
        taken.add(key);
        return true;
      }
      return false;
    }),
  }));
  const others = Object.entries(p.specs).filter(([key]) => !taken.has(key));
  if (others.length)
    sections.push({
      title: "جزئیات دیگر",
      icon: Layers,
      test: /.*/,
      entries: others,
    });
  const populated = sections.filter((g) => g.entries.length);
  return (
    <>
      <nav className="detail-section-nav" aria-label="جزئیات محصول">
        {!!p.overview?.length && <a href="#product-story">از نزدیک</a>}
        <a href="#full-specifications">مشخصات کامل</a>
        {p.kind === "phone" && (
          <a href="#fitted-accessories">همراه‌های سازگار</a>
        )}
        <a href="#buying-guide">راهنمای انتخاب</a>
      </nav>
      {p.overview?.length ? (
        <section className="product-story" id="product-story">
          <div className="story-intro">
            <span className="eyebrow">جزئیات، فرق می‌سازند.</span>
            <h2>
              آشنایی نزدیک‌تر با <bdi>{p.name}</bdi>
            </h2>
            <p>
              هر قابلیت، برای یک استفاده. آنچه پیش از انتخاب این مدل بهتر است
              بدانی.
            </p>
          </div>
          <div className="product-story-grid">
            {p.overview.map((item, i) => (
              <article key={item.title}>
                <span>۰{i + 1} / ABI NOTES</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section className="complete-specifications" id="full-specifications">
        <div className="specification-heading">
          <div>
            <span className="eyebrow">یک مرجع روشن برای انتخاب</span>
            <h2>مشخصات کامل، بدون پیچیدگی.</h2>
            <p>
              مشخصات نسخه مرجع؛ گزینه‌های موجود فروشگاه در بخش رنگ و ظرفیت
              آمده‌اند.
            </p>
          </div>
          {p.referenceUrl && (
            <a
              href={p.referenceUrl}
              target="_blank"
              rel="noreferrer"
              className="spec-source"
            >
              مرجع سازنده <ArrowUpLeft size={14} />
            </a>
          )}
        </div>
        <div className="spec-jump-links">
          {populated.map((g, i) => (
            <a key={g.title} href={"#spec-group-" + i}>
              {g.title}
            </a>
          ))}
        </div>
        <div className="specification-groups">
          {populated.map((g, i) => (
            <section key={g.title} id={"spec-group-" + i}>
              <header>
                <g.icon size={23} strokeWidth={1.3} />
                <h3>{g.title}</h3>
                <span>
                  {String(g.entries.length).replace(
                    /\d/g,
                    (d) => "۰۱۲۳۴۵۶۷۸۹"[+d],
                  )}{" "}
                  ویژگی
                </span>
              </header>
              <dl>
                {g.entries.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>
                      <bdi>{value}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <p className="specification-footnote">
          امکانات شبکه، نرم‌افزار، سیم‌کارت و جعبه ممکن است بر اساس نسخه
          منطقه‌ای تغییر کنند. مقاومت در برابر آب و گردوغبار دائمی نیست و مطابق
          شرایط آزمون سازنده است. قیمت و موجودی این نسخه نمایشی‌اند.
        </p>
      </section>
    </>
  );
}
