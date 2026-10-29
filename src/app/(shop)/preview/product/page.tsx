import { Suspense } from "react";
import { ProductPreview } from "@/components/preview";
export default function Page() {
  return (
    <Suspense>
      <ProductPreview />
    </Suspense>
  );
}
