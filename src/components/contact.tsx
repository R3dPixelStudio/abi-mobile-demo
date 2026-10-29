"use client";
import { useState } from "react";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Breadcrumb, DemoNote } from "./ui";
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "ارتباط با ما" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">گفت‌وگو، شروع یک تجربه بهتر</span>
          <h1>از تو می‌شنویم.</h1>
          <p>این فرم فقط رفتار رابط را نمایش می‌دهد و پیامی ارسال نمی‌کند.</p>
        </div>
      </div>
      <div className="contact-grid">
        <div className="panel stack">
          <MessageCircle size={35} color="#1268ce" />
          <h2>همراهت هستیم.</h2>
          <p>
            اطلاعات تماس و ساعت پاسخ‌گویی پس از تأیید فروشگاه در این بخش قرار
            می‌گیرند.
          </p>
          <p>
            <Mail size={17} style={{ display: "inline" }} /> ایمیل: در انتظار
            اطلاعات فروشگاه
          </p>
          <p>
            <MapPin size={17} style={{ display: "inline" }} /> نشانی: در انتظار
            تأیید مشتری
          </p>
          <DemoNote>
            شماره یا نشانی کسب‌وکار واقعی برای این برند مفهومی تعریف نشده است.
          </DemoNote>
        </div>
        <form
          className="panel stack"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="field">
            نام نمایشی
            <input
              required
              minLength={2}
              maxLength={80}
              placeholder="کاربر آزمایشی"
            />
          </label>
          <label className="field">
            موضوع
            <select>
              <option>راهنمای انتخاب</option>
              <option>پیشنهاد درباره دمو</option>
              <option>سؤال درباره سفارش آزمایشی</option>
            </select>
          </label>
          <label className="field">
            پیام نمونه
            <textarea
              required
              minLength={5}
              maxLength={1000}
              placeholder="لطفاً اطلاعات شخصی وارد نکنید."
            />
          </label>
          <button className="btn primary">نمایش نتیجه آزمایشی</button>
          {sent && (
            <p className="demo-note" role="status">
              پیش‌نمایش تکمیل شد. هیچ پیامی ارسال یا ذخیره نشده است.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
