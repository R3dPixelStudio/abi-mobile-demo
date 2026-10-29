"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowLeft, Minus, Plus, PackageOpen } from "lucide-react";
import { number } from "@/lib/domain";
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      const previous = document.activeElement as HTMLElement;
      dialog.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        dialog.close();
        document.body.style.overflow = old;
        previous?.focus();
      };
    } else dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
      aria-label={title}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" aria-label="بستن" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  href,
  link = "مشاهده همه",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <ArrowLeft size={17} />
        </Link>
      )}
    </div>
  );
}
export function Empty({
  title,
  text,
  href = "/products",
  action = "گشت‌وگذار در فروشگاه",
}: {
  title: string;
  text: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <PackageOpen size={42} strokeWidth={1.2} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="btn primary" href={href}>
        {action}
        <ArrowLeft size={17} />
      </Link>
    </div>
  );
}
export function Quantity({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="کاهش تعداد"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <Minus size={16} />
      </button>
      <output aria-label="تعداد">{number(value)}</output>
      <button
        type="button"
        aria-label="افزایش تعداد"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <Link href="/">آبی‌موبایل</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-note">
      {children ||
        "این یک تجربه نمایشی است. قیمت‌ها نمونه‌اند و خرید، پرداخت یا ارسال واقعی انجام نمی‌شود."}
    </div>
  );
}
