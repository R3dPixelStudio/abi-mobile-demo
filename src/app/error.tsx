"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty">
      <h1>بارگذاری این بخش کامل نشد</h1>
      <p>دوباره تلاش کنید؛ داده‌های نمایشی مرورگر شما حفظ شده‌اند.</p>
      <button className="btn primary" onClick={reset}>
        تلاش دوباره
      </button>
    </div>
  );
}
