import credits from "@/data/asset-credits.json";
import photoCredits from "@/data/catalog-photo-credits.json";
import media from "@/data/catalog-media.json";
import { products } from "@/data/products";
import { Breadcrumb } from "@/components/ui";
export const metadata = { title: "منابع تصاویر و مجوزها" };
export default function Page() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "منابع تصاویر" }]} />
      <div className="information">
        <h1>منابع تصاویر و مجوزها</h1>
        <p className="info-intro">
          بخشی از تصاویر مرجع از ویکی‌مدیا با مجوزهای زیر استفاده شده‌اند.
          استفاده از تصویر به معنای تأیید فروشگاه توسط سازنده نیست. رنگ تصویر
          ممکن است با تنوع انتخابی متفاوت باشد.
        </p>
        {[...credits, ...photoCredits].map((c) => (
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
          <h2>تصاویر مرجع سازندگان؛ بازبینی محلی</h2>
          <p>
            تصاویر تکمیلی گالری از صفحات رسمی سازندگان گردآوری، کوچک و در برخی
            موارد برش داده شده‌اند. این منابع مجوز آزاد اعلام نکرده‌اند؛ تأیید
            حق استفاده از رسانه توسط صاحب برند یا تأمین‌کننده، پیش از انتشار
            عمومی و فروش واقعی لازم است. این نسخه برای بازبینی محلی طراحی آماده
            شده است.
          </p>
          <ul>
            {Object.entries(media)
              .filter(([, records]) =>
                records.some(
                  (r) => r.path && r.rights.includes("Manufacturer"),
                ),
              )
              .map(([id, records]) => (
                <li key={id}>
                  <a
                    className="text-link"
                    href={records.find((r) => r.path)?.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {products.find((p) => p.id === id)?.name || id}
                  </a>
                </li>
              ))}
          </ul>
        </section>
        <section>
          <h2>مدل سه‌بعدی هیرو</h2>
          <p>
            مدل Apple iPhone 18 Pro Max Burgundy 2026، اثر extraakash، از فایل
            ارائه‌شده توسط صاحب پروژه استفاده شده است. رنگ بدنه برای هویت آبی
            تغییر کرده و صفحه تعاملی به آن اضافه شده است.
          </p>
          <p>
            <a
              className="text-link"
              href="https://sketchfab.com/3d-models/apple-iphone-18-pro-max-burgundy-2026-604acc18b5d5455d820a16359b45b003"
              target="_blank"
              rel="noreferrer"
            >
              صفحه مدل و سازنده
            </a>{" "}
            ·{" "}
            <a
              className="text-link"
              href="https://sketchfab.com/licenses"
              target="_blank"
              rel="noreferrer"
            >
              Sketchfab Standard License
            </a>
          </p>
        </section>
        <section>
          <h2>تصویرسازی‌های اختصاصی</h2>
          <p>
            تصویرهای شماتیک لوازم عمومی آبی استودیو، قاب‌ها، گلس‌ها و جلد
            راهنماها طرح‌های برداری اختصاصی این پروژه‌اند و عکس کالای واقعی
            نیستند. عکس‌های مرجع محصولات برنددار در بخش منابع سازندگان مشخص
            شده‌اند.
          </p>
        </section>
      </div>
    </div>
  );
}
