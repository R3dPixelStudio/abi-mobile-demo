import credits from "@/data/asset-credits.json";
import { Breadcrumb } from "@/components/ui";
export const metadata = { title: "منابع تصاویر و مجوزها" };
export default function Page() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "منابع تصاویر" }]} />
      <div className="information">
        <h1>منابع تصاویر و مجوزها</h1>
        <p className="info-intro">
          تصاویر مرجع مدل از ویکی‌مدیا با مجوزهای زیر استفاده شده‌اند. استفاده
          از تصویر به معنای تأیید فروشگاه توسط سازنده نیست. رنگ تصویر ممکن است
          با تنوع انتخابی متفاوت باشد.
        </p>
        {credits.map((c) => (
          <section key={c.file}>
            <h2>{c.title}</h2>
            <p>
              اثر: <bdi>{c.author}</bdi>
            </p>
            <p>
              <a
                className="text-link"
                href={c.source}
                target="_blank"
                rel="noreferrer"
              >
                صفحه منبع
              </a>{" "}
              ·{" "}
              <a
                className="text-link"
                href={c.licenseUrl}
                target="_blank"
                rel="noreferrer"
              >
                {c.license}
              </a>
            </p>
            <p className="tiny">
              تصاویر برداری بدون تغییر؛ تصاویر عکاسی با اندازه کاهش‌یافته در
              صورت دسترس‌بودن.
            </p>
          </section>
        ))}
        <section>
          <h2>تصویرسازی‌های اختصاصی</h2>
          <p>
            تصویر لوازم جانبی، جلد راهنماها و جای‌نگهدارهای تصاویر، طرح‌های
            برداری اختصاصی این پروژه‌اند. لوازم جانبی کالاهای عمومی نمایشی هستند
            و تصویر آنها عکس محصول واقعی نیست.
          </p>
        </section>
      </div>
    </div>
  );
}
