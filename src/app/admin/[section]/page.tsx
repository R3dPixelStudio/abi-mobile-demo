import { notFound } from "next/navigation";
import { Admin, type AdminSection } from "@/components/admin/admin";
const sections = [
  "products",
  "articles",
  "orders",
  "offers",
  "homepage",
  "taxonomies",
  "settings",
];
export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}
export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  return <Admin section={section as AdminSection} />;
}
