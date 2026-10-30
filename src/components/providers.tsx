"use client";
import { Suspense, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { NavigationProgress } from "./experience-loading";
export function Providers({ children }: { children: React.ReactNode }) {
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    const failed = () => setStorageFailed(true);
    window.addEventListener("abi-storage-error", failed);
    return () => window.removeEventListener("abi-storage-error", failed);
  }, []);
  const notice = useStore((s) => s.notice);
  const notify = useStore((s) => s.notify);
  useEffect(() => {
    void Promise.resolve(useStore.persist.rehydrate()).then(() =>
      useStore.getState().setReady(),
    );
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 4000);
    return () => clearTimeout(timer);
  }, [notice, notify]);
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {storageFailed && (
        <div className="demo-note" role="alert">
          ذخیره در مرورگر در دسترس نیست؛ تغییرات این جلسه ممکن است پس از بستن
          صفحه از دست بروند.
        </div>
      )}
      {children}
      <div aria-live="polite" className={`toast ${notice ? "visible" : ""}`}>
        {notice && (
          <>
            <Check size={18} />
            <span>{notice}</span>
            <button aria-label="بستن اعلان" onClick={() => notify("")}>
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
