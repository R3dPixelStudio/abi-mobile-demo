import { Suspense } from "react";
import { ArticlePreview } from "@/components/preview";
export default function Page() {
  return (
    <Suspense>
      <ArticlePreview />
    </Suspense>
  );
}
