import { notFound } from "next/navigation";
import { repository } from "@/lib/repository";
import { metadata, productJson, breadcrumbJson, jsonLd } from "@/lib/seo";
import { ProductDetail } from "@/components/product-detail";
export const generateStaticParams = () =>
  repository.products().map((p) => ({ slug: p.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = repository.product(slug);
  return p
    ? metadata(
        p.seo.title || p.name,
        p.seo.description || p.description,
        `/products/${slug}`,
        p.images[0],
      )
    : { title: "محصول پیدا نشد" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = repository.product(slug);
  if (!p) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            productJson(p),
            breadcrumbJson([
              { name: "فروشگاه", path: "/products" },
              { name: p.name, path: `/products/${slug}` },
            ]),
          ]),
        }}
      />
      <ProductDetail seed={p} />
    </>
  );
}
