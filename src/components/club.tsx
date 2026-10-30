"use client";
import Link from "next/link";
import { Sparkles, ArrowLeft, Truck, Gift, Ticket, Tag } from "lucide-react";
import { useStore } from "@/lib/store";
import { number, date } from "@/lib/domain";
import {
  BLUE_POINT_TOMAN,
  bluePointsFor,
  clubBalance,
  orderBluePoints,
} from "@/lib/club";
export function PointsHint({ amount }: { amount: number }) {
  return (
    <div className="blue-points-hint">
      <span className="blue-point-symbol">✦</span>
      <div>
        <strong>{number(bluePointsFor(amount))} امتیاز آبی</strong>
        <small>با ثبت این سفارش آزمایشی · بدون احتساب ارسال</small>
      </div>
      <Link href="/club" aria-label="درباره امتیاز آبی">
        ↗
      </Link>
    </div>
  );
}
export function ClubTeaser() {
  return (
    <Link href="/club" className="club-teaser">
      <div className="club-mini-orbit" aria-hidden="true">
        ✦<i />
        <i />
      </div>
      <div>
        <span>باشگاه آبی</span>
        <h2>هر انتخاب، یک قدم آبی‌تر.</h2>
        <p>خریدهایت امتیاز می‌شوند؛ برای فرصت‌های بعدی.</p>
      </div>
      <span className="club-teaser-link">
        کشف باشگاه <ArrowLeft size={17} />
      </span>
    </Link>
  );
}
export function ClubPanel({
  compact = false,
  embedded = false,
}: {
  compact?: boolean;
  embedded?: boolean;
}) {
  const Heading = compact || embedded ? "h2" : "h1";
  const orders = useStore((s) => s.orders);
  const ready = useStore((s) => s.ready);
  const account = useStore((s) => s.account);
  const points = clubBalance(orders);
  const goal = 500,
    remaining = Math.max(0, goal - points);
  const progress = Math.min(100, (points / goal) * 100);
  return (
    <div className={`club-experience ${compact ? "compact-club" : ""}`}>
      <section className="club-hero">
        <div className="club-optics" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>✦</span>
        </div>
        <div className="club-hero-copy">
          <span className="club-eyebrow">ABI / BLUE CLUB</span>
          <Heading>
            {compact ? "باشگاه آبی تو" : "هر انتخاب، یک قدم آبی‌تر."}
          </Heading>
          <p>
            همراهی تو ارزش دارد. با هر خرید، امتیاز آبی جمع کن و برای تجربه‌های
            بعدی آماده باش.
          </p>
          <span className="club-demo-label">
            پیش‌نمایش باشگاه · امتیازها و مزایا نمایشی‌اند
          </span>
        </div>
        <div className="club-member-card">
          <span>
            امتیاز آبی تو <Sparkles size={15} />
          </span>
          <strong>
            {ready ? number(points) : "—"}
            <small>BLUE POINTS</small>
          </strong>
          <div className="club-progress">
            <i style={{ width: progress + "%" }} />
          </div>
          <p>
            {remaining
              ? `${number(remaining)} امتیاز تا نشان «همراه آبی» در این طرح نمونه`
              : "نشان «همراه آبی» در این طرح نمونه"}
          </p>
          <span className="club-card-foot">
            {account ? "حساب آزمایشی آبی" : "نمایش موجودی حساب نمونه"}{" "}
            <bdi>ABI · DEMO</bdi>
          </span>
        </div>
      </section>
      {compact ? (
        <div className="club-compact-footer">
          <span>
            هر {number(BLUE_POINT_TOMAN)} تومان خرید کالا پس از کسر پیشنهادها،
            یک امتیاز.
          </span>
          <Link href="/account/club" className="text-link">
            دنیای امتیازها ↗
          </Link>
        </div>
      ) : (
        <>
          <section className="club-rewards">
            <div className="club-section-heading">
              <span className="eyebrow">فرصت‌های پیش رو</span>
              <h2>امتیازهای کوچک. اتفاق‌های خوب.</h2>
              <p>
                این مسیرها برای آینده باشگاه در نظر گرفته شده‌اند؛ در دمو قابل
                استفاده نیستند.
              </p>
            </div>
            <div className="club-reward-grid">
              {[
                [
                  Tag,
                  "قیمت‌های آبی‌تر",
                  "امکان تبدیل امتیاز به کدهای خرید ویژه.",
                ],
                [
                  Truck,
                  "ارسال مهمان ما",
                  "استفاده از اعتبار برای هزینه ارسال.",
                ],
                [
                  Ticket,
                  "دعوت به اتفاق‌ها",
                  "دسترسی به رویدادها و تجربه‌های باشگاه.",
                ],
                [
                  Gift,
                  "یک جایزه بزرگ",
                  "جایزه ویژه در برنامه‌های آینده باشگاه.",
                ],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof Gift;
                return (
                  <article key={String(title)}>
                    <I />
                    <span>در آینده</span>
                    <h3>{String(title)}</h3>
                    <p>{String(text)}</p>
                  </article>
                );
              })}
            </div>
          </section>
          <div className="club-how">
            <div>
              <span className="eyebrow">ساده و روشن</span>
              <h2>امتیازها چطور جمع می‌شوند؟</h2>
              <p>
                در این طرح نمایشی، به ازای هر {number(BLUE_POINT_TOMAN)} تومان
                از مبلغ کالاها پس از کسر پیشنهادها، یک امتیاز می‌گیری. هزینه
                ارسال امتیاز ندارد. امتیاز هر سفارش یک‌بار ثبت می‌شود؛ تازه‌کردن
                صفحه امتیاز اضافه نمی‌کند.
              </p>
              <p className="tiny">
                نرخ امتیاز، شرایط استفاده، نشان‌ها و برنامه جایزه نیازمند تأیید
                فروشگاه‌اند. فعلاً برداشت، جایزه یا اعتبار مالی واقعی وجود
                ندارد.
              </p>
            </div>
            <div className="club-ledger">
              <h3>ردِ انتخاب‌های آبی</h3>
              <span className="tiny">سفارش‌های ساختگی این مرورگر</span>
              {ready &&
                orders.slice(0, 5).map((o) => (
                  <div key={o.id}>
                    <span>
                      <bdi>{o.id}</bdi>
                      <small>{date(o.date)}</small>
                    </span>
                    <strong>+{number(orderBluePoints(o))} ✦</strong>
                  </div>
                ))}
              {ready && !orders.length && (
                <p>با اولین سفارش آزمایشی، اینجا روشن می‌شود.</p>
              )}
            </div>
          </div>
          <div className="club-bottom">
            <Link className="btn primary" href="/products">
              یک انتخاب تازه <ArrowLeft size={16} />
            </Link>
            <Link
              className="text-link"
              href={account ? "/account/orders" : "/account"}
            >
              {account ? "دیدن سفارش‌های من" : "ورود به حساب نمایشی"} ↗
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
