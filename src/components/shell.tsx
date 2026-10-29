"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  Sparkles,
  Heart,
  ArrowUpLeft,
  Smartphone,
  GitCompareArrows,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { number } from "@/lib/domain";
import { Modal } from "./ui";
const links = [
  ["/products?kind=phone", "گوشی موبایل"],
  ["/products?kind=accessory", "لوازم جانبی"],
  ["/products?offer=1", "پیشنهادهای ویژه"],
  ["/blog", "مجله آبی"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useStore((s) => s.cart);
  const settings = useStore((s) => s.settings);
  const path = usePathname();
  return (
    <>
      <div className="announcement">
        <span>{settings.banner}</span>
        <Link href="/about">
          درباره این تجربه <ArrowUpLeft size={12} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <button
            className="icon-btn mobile-only"
            aria-label="باز کردن منو"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <Link
            className="wordmark"
            href="/"
            aria-label={`${settings.name}، صفحه اصلی`}
          >
            <span className="brand-symbol">
              <span />
              <span />
              <span />
            </span>
            <span>
              {settings.name}
              <small>انتخاب روشن، دنیای همراه</small>
            </span>
          </Link>
          <form action="/products" className="header-search" role="search">
            <Search size={20} />
            <input
              name="q"
              aria-label="جستجوی محصولات"
              placeholder="دنبال چه چیزی می‌گردی؟"
              autoComplete="off"
            />
            <kbd>جستجو</kbd>
          </form>
          <div className="header-actions">
            <Link className="account-link" href="/account">
              <UserRound size={20} />
              <span>حساب من</span>
            </Link>
            <span className="divider" />
            <Link
              className="icon-btn cart-icon"
              href="/cart"
              aria-label={`سبد خرید، ${number(cart.reduce((n, l) => n + l.quantity, 0))} کالا`}
            >
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <b>{number(cart.reduce((n, l) => n + l.quantity, 0))}</b>
              )}
            </Link>
          </div>
        </div>
        <nav className="container nav-row" aria-label="منوی اصلی">
          <div>
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={path === "/blog" && href === "/blog" ? "active" : ""}
              >
                {label}
              </Link>
            ))}
          </div>
          <Link className="assistant-nav" href="/assistant">
            <Sparkles size={17} /> دستیار انتخاب آبی{" "}
            <span>هوشمندانه‌تر انتخاب کن</span>
          </Link>
        </nav>
        <form action="/products" className="mobile-search" role="search">
          <Search size={18} />
          <input
            name="q"
            aria-label="جستجو در فروشگاه"
            placeholder="جستجوی گوشی، برند و لوازم جانبی"
          />
        </form>
      </header>
      <Modal open={open} onClose={() => setOpen(false)} title="آبی‌موبایل">
        <nav className="mobile-menu">
          {[
            ...links,
            ["/compare", "مقایسه گوشی‌ها"],
            ["/account/wishlist", "علاقه‌مندی‌ها"],
            ["/assistant", "دستیار انتخاب"],
            ["/admin", "پنل مدیریت نمایشی"],
          ].map(([href, label]) => (
            <Link onClick={() => setOpen(false)} key={href} href={href}>
              {label}
              <ArrowUpLeft size={18} />
            </Link>
          ))}
        </nav>
      </Modal>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link className="wordmark" href="/">
            <span className="brand-symbol">
              <span />
              <span />
              <span />
            </span>
            آبی‌موبایل
          </Link>
          <p>
            فناوری وقتی بهتر است که به زندگی تو نزدیک‌تر باشد.
            <br />
            اینجا، برای یک انتخاب روشن کنارت هستیم.
          </p>
          <span className="tiny">فروشگاه مفهومی · نسخه ارائه به مشتری</span>
        </div>
        <div>
          <h3>دنیای آبی</h3>
          <Link href="/products">همه محصولات</Link>
          <Link href="/blog">مجله و راهنمای خرید</Link>
          <Link href="/about">درباره آبی‌موبایل</Link>
          <Link href="/contact">ارتباط با ما</Link>
          <Link href="/credits">منابع تصاویر</Link>
        </div>
        <div>
          <h3>همراه شما</h3>
          <Link href="/faq">پرسش‌های متداول</Link>
          <Link href="/delivery">روش‌های ارسال</Link>
          <Link href="/returns">شرایط بازگشت</Link>
          <Link href="/policy">حریم خصوصی و قوانین</Link>
        </div>
        <div className="footer-assistant">
          <Sparkles size={25} />
          <h3>هنوز انتخاب نکردی؟</h3>
          <p>
            بودجه و نیازت را بگو.
            <br />
            با هم گزینه‌ها را پیدا می‌کنیم.
          </p>
          <Link className="text-link" href="/assistant">
            شروع گفت‌وگو <ArrowUpLeft size={18} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          همه قیمت‌ها نمونه و به تومان هستند. هیچ پرداخت واقعی انجام نمی‌شود.
        </span>
        <Link href="/admin">
          ورود به مدیریت دمو <ArrowUpLeft size={14} />
        </Link>
      </div>
    </footer>
  );
}
export function MobileDock() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <nav className="mobile-dock" aria-label="دسترسی سریع">
      {[
        [Smartphone, "/products", "فروشگاه"],
        [GitCompareArrows, "/compare", "مقایسه"],
        [Sparkles, "/assistant", "دستیار"],
        [Heart, "/account/wishlist", "ذخیره‌ها"],
        [UserRound, "/account", "حساب من"],
      ].map(([Icon, href, label]) => {
        const I = Icon as typeof Smartphone;
        return (
          <Link
            key={String(href)}
            href={String(href)}
            className={path === href ? "active" : ""}
          >
            <I size={20} />
            <span>{String(label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
