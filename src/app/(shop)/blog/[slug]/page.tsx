import { notFound } from "next/navigation";
import { repository } from "@/lib/repository";
import { metadata, jsonLd, breadcrumbJson } from "@/lib/seo";
import { branding } from "@/lib/brand";
import { ArticleDetail } from "@/components/blog";
export const generateStaticParams = () =>
  repository.articles().map((a) => ({ slug: a.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = repository.article(slug);
  return a
    ? metadata(
        a.seo.title || a.title,
        a.seo.description || a.excerpt,
        `/blog/${slug}`,
        a.cover,
      )
    : { title: "مقاله پیدا نشد" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = repository.article(slug);
  if (!a) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: a.title,
              description: a.excerpt,
              image: new URL(a.cover, branding.url).href,
              datePublished: a.date,
              author: { "@type": "Organization", name: "تحریریه نمایشی آبی" },
              mainEntityOfPage: `${branding.url}/blog/${slug}`,
            },
            breadcrumbJson([
              { name: "مجله آبی", path: "/blog" },
              { name: a.title, path: `/blog/${slug}` },
            ]),
          ]),
        }}
      />
      <ArticleDetail article={a} />
    </>
  );
}
