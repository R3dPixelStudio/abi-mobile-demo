"use client";
import Link from "next/link";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useCatalog, useStore } from "@/lib/store";
import { productHref } from "@/lib/repository";
import { money, priceOf } from "@/lib/domain";
import { Breadcrumb, Empty } from "./ui";
export function Compare() {
  const catalog = useCatalog().filter((p) => p.kind === "phone");
  const ready = useStore((s) => s.ready);
  const ids = useStore((s) => s.compare);
  const toggle = useStore((s) => s.toggleCompare);
  const [only, setOnly] = useState(false);
  const selected = ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p) => !!p);
  const keys = [...new Set(selected.flatMap((p) => Object.keys(p.specs)))];
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "مقایسه گوشی‌ها" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">کنار هم، روشن‌تر</span>
          <h1>مقایسه گوشی‌ها</h1>
          <p>دو یا سه گوشی را انتخاب کن و تفاوت‌ها را ببین.</p>
        </div>
      </div>
      <div className="compare-controls panel">
        <label className="field">
          افزودن گوشی به مقایسه
          <select
            aria-label="انتخاب گوشی برای مقایسه"
            value=""
            onChange={(e) => e.target.value && toggle(e.target.value)}
            disabled={!ready || ids.length >= 3}
          >
            <option value="">انتخاب گوشی…</option>
            {catalog
              .filter((p) => !ids.includes(p.id))
              .map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={only}
            onChange={(e) => setOnly(e.target.checked)}
          />{" "}
          فقط تفاوت‌ها
        </label>
      </div>
      {selected.length ? (
        <div className="table-wrap comparison">
          <table>
            <thead>
              <tr>
                <th>ویژگی</th>
                {selected.map((p) => (
                  <th key={p.id}>
                    <button
                      className="icon-btn"
                      aria-label={`حذف ${p.name} از مقایسه`}
                      onClick={() => toggle(p.id)}
                    >
                      <X size={15} />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.imageAlt}
                      width={150}
                      height={170}
                    />
                    <Link href={productHref(p)}>
                      <bdi>{p.name}</bdi>
                    </Link>
                    <p>{money(priceOf(p))}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys
                .filter(
                  (k) =>
                    !only ||
                    new Set(selected.map((p) => p.specs[k] || "—")).size > 1,
                )
                .map((k) => (
                  <tr
                    key={k}
                    className={
                      new Set(selected.map((p) => p.specs[k] || "—")).size > 1
                        ? "difference"
                        : ""
                    }
                  >
                    <th>{k}</th>
                    {selected.map((p) => (
                      <td key={p.id}>
                        <bdi>{p.specs[k] || "—"}</bdi>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title="جای انتخاب‌های تو اینجاست"
          text="از فهرست بالا گوشی اضافه کن، یا از صفحه محصول دکمه مقایسه را بزن."
        />
      )}
      {selected.length === 1 && (
        <p className="demo-note" style={{ marginTop: 20 }}>
          <Plus size={14} style={{ display: "inline" }} /> یک گوشی دیگر اضافه کن
          تا تفاوت‌ها مشخص شوند.
        </p>
      )}
    </div>
  );
}
