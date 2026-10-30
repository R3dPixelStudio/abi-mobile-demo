import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Account } from "@/components/account";
export const metadata = { title: "حساب کاربری نمایشی" };
export default async function Page({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  if (
    section.length > 1 ||
    !["", "orders", "addresses", "wishlist", "settings", "club"].includes(
      section[0] || "",
    )
  )
    notFound();
  return (
    <Suspense>
      <Account section={section[0] || ""} />
    </Suspense>
  );
}
