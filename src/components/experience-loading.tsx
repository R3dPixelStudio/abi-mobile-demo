"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
export function NavigationProgress() {
  const node = useRef<HTMLDivElement>(null),
    delay = useRef<ReturnType<typeof setTimeout> | null>(null),
    limit = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = usePathname(),
    search = useSearchParams();
  useEffect(() => {
    const stop = () => {
      if (delay.current) clearTimeout(delay.current);
      if (limit.current) clearTimeout(limit.current);
      node.current?.removeAttribute("data-pending");
    };
    const start = () => {
      stop();
      delay.current = setTimeout(
        () => node.current?.setAttribute("data-pending", "true"),
        120,
      );
      limit.current = setTimeout(stop, 20000);
    };
    const click = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (
        url.origin === location.origin &&
        url.pathname + url.search !== location.pathname + location.search
      )
        start();
    };
    const submit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (
        !e.defaultPrevented &&
        new URL(form.action, location.href).origin === location.origin
      )
        start();
    };
    document.addEventListener("click", click, true);
    document.addEventListener("submit", submit);
    window.addEventListener("abi-navigation-start", start);
    window.addEventListener("pageshow", stop);
    return () => {
      stop();
      document.removeEventListener("click", click, true);
      document.removeEventListener("submit", submit);
      window.removeEventListener("abi-navigation-start", start);
      window.removeEventListener("pageshow", stop);
    };
  }, []);
  useEffect(() => {
    if (delay.current) clearTimeout(delay.current);
    if (limit.current) clearTimeout(limit.current);
    node.current?.removeAttribute("data-pending");
  }, [path, search]);
  return (
    <div
      ref={node}
      className="navigation-progress"
      role="status"
      aria-label="در حال باز کردن صفحه"
    >
      <span />
      <div className="navigation-pill">
        <i />
        <i />
        <i />
        <small>یک لحظه تا دنیای آبی…</small>
      </div>
    </div>
  );
}
export function AbiLoader() {
  return (
    <div className="abi-loading" role="status" aria-label="در حال بارگذاری">
      <div className="abi-loading-mark">
        <span>آ</span>
        <i />
        <i />
        <i />
      </div>
      <h2>انتخاب روشن، در راه است.</h2>
      <p>در حال آماده‌کردن دنیای آبی برای تو…</p>
      <div className="loading-preview">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
