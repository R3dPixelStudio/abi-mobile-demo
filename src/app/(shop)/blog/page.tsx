import { Blog } from "@/components/blog";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "مجله آبی؛ راهنمای خرید گوشی",
    "راهنمای فارسی انتخاب گوشی، دوربین، حافظه، باتری و لوازم جانبی.",
    "/blog",
  );
export default function Page() {
  return <Blog />;
}
