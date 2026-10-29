"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useArticles } from "@/lib/store";
import { date } from "@/lib/domain";
import type { Article } from "@/lib/types";
import { Breadcrumb, DemoNote, Empty } from "./ui";
import { repository } from "@/lib/repository";
export const articleHref = (a: Article) =>
  repository.articles().some((s) => s.id === a.id && s.slug === a.slug)
    ? `/blog/${a.slug}`
    : `/preview/article?id=${encodeURIComponent(a.id)}`;
export function Blog() {
  const articles = useArticles().filter((a) => a.status === "published");
  const [category, setCategory] = useState("");
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "مجله آبی" }]} />
      <div className="blog-intro">
        <BookOpen size={35} strokeWidth={1.3} />
        <span className="eyebrow">کمی بیشتر بدان، بهتر انتخاب کن</span>
        <h1>مجله آبی</h1>
        <p>
          راهنماهای کاربردی برای انتخاب گوشی و لوازمی که با زندگی تو هماهنگ‌اند.
        </p>
      </div>
      <div className="tabs">
        <button
          className={!category ? "active" : ""}
          onClick={() => setCategory("")}
        >
          همه نوشته‌ها
        </button>
        {[...new Set(articles.map((a) => a.category))].map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="article-grid blog-grid">
        {articles
          .filter((a) => !category || a.category === category)
          .map((a) => (
            <Link className="article-card" key={a.id} href={articleHref(a)}>
              <img src={a.cover} alt={a.imageAlt} width={400} height={240} />
              <div>
                <div className="meta">
                  <span>{a.category}</span>
                  <span>{date(a.date)}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <span className="text-link" style={{ marginTop: 12 }}>
                  ادامه مطلب <ArrowLeft size={15} />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
export function ArticleDetail({
  article: seed,
  preview = false,
}: {
  article: Article;
  preview?: boolean;
}) {
  const articles = useArticles();
  const article = articles.find((a) => a.id === seed.id);
  if (!article || (!preview && article.status === "draft"))
    return (
      <Empty
        title="این مقاله در پیش‌نمایش نمایش داده نمی‌شود"
        text="ممکن است نوشته حذف شده یا به پیش‌نویس تغییر کرده باشد."
        href="/blog"
        action="بازگشت به مجله"
      />
    );
  return (
    <div className="container">
      <Breadcrumb
        items={[{ label: "مجله آبی", href: "/blog" }, { label: article.title }]}
      />
      <article className="reading">
        <header>
          <span className="eyebrow">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="tiny">
            {date(article.date)} · تحریریه نمایشی آبی · راهنمای خرید
          </div>
        </header>
        {(preview || JSON.stringify(seed) !== JSON.stringify(article)) && (
          <DemoNote>
            این پیش‌نمایش محلی است. وضعیت انتشار و سئوی سایت عمومی تغییر نکرده
            است.
          </DemoNote>
        )}
        <img
          className="article-cover"
          src={article.cover}
          alt={article.imageAlt}
          width={900}
          height={500}
        />
        <div className="article-body">
          {article.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="row">
          {article.tags.map((t) => (
            <span className="badge" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="panel reading-cta">
          <h2>حالا نوبت انتخاب توست.</h2>
          <p>گزینه‌های کاتالوگ را با نیاز و بودجه‌ات مقایسه کن.</p>
          <Link className="btn primary" href="/products">
            دیدن محصولات <ArrowLeft size={16} />
          </Link>
        </div>
      </article>
    </div>
  );
}
