import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="empty">
      <span className="eyebrow">۴۰۴</span>
      <h1>این صفحه را پیدا نکردیم</h1>
      <p>
        ممکن است نشانی تغییر کرده باشد یا این پیش‌نمایش فقط در مرورگر سازنده
        ذخیره شده باشد.
      </p>
      <Link className="btn primary" href="/products">
        بازگشت به فروشگاه
      </Link>
    </main>
  );
}
