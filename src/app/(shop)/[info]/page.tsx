import { notFound } from "next/navigation";
import Link from "next/link";
import { information } from "@/data/information";
import { Breadcrumb } from "@/components/ui";
import { metadata } from "@/lib/seo";
export const generateStaticParams = () =>
  Object.keys(information).map((info) => ({ info }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ info: string }>;
}) {
  const { info } = await params;
  const page = information[info];
  return page
    ? metadata(page.title, page.intro, `/${info}`)
    : { title: "صفحه پیدا نشد" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ info: string }>;
}) {
  const { info } = await params;
  const page = information[info];
  if (!page) notFound();
  return (
    <div className="container">
      <Breadcrumb items={[{ label: page.title }]} />
      <div className="information">
        <span className="eyebrow">همراه تو، با شفافیت</span>
        <h1>{page.title}</h1>
        <p className="info-intro">{page.intro}</p>
        {page.sections.map((s) =>
          info === "faq" ? (
            <details key={s.title}>
              <summary>{s.title}</summary>
              <p>{s.text}</p>
            </details>
          ) : (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ),
        )}
        <div className="row">
          <Link className="btn secondary" href="/contact">
            ارتباط با ما
          </Link>
          <Link className="text-link" href="/credits">
            منابع تصاویر و مجوزها
          </Link>
        </div>
      </div>
    </div>
  );
}
