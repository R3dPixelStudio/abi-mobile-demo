"use client";
import { useSearchParams } from "next/navigation";
import { ProductDetail } from "./product-detail";
import { ArticleDetail } from "./blog";
import { useArticles } from "@/lib/store";
import { Empty } from "./ui";
export function ProductPreview() {
  const id = useSearchParams().get("id") || "";
  return <ProductDetail previewId={id} />;
}
export function ArticlePreview() {
  const id = useSearchParams().get("id") || "";
  const article = useArticles().find((a) => a.id === id);
  return article ? (
    <ArticleDetail article={article} preview />
  ) : (
    <Empty
      title="مقاله پیدا نشد"
      text="این پیش‌نمایش فقط در مرورگری که مقاله در آن ذخیره شده در دسترس است."
      href="/blog"
    />
  );
}
