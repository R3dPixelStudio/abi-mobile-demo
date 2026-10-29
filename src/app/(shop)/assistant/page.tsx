import type { Metadata } from "next";
import { Assistant } from "@/components/assistant";
export const metadata: Metadata = {
  title: "دستیار خرید گوشی | آبی‌موبایل",
  description:
    "پیشنهاد گوشی بر اساس بودجه، برند و نیاز شما؛ از کاتالوگ نمایشی آبی‌موبایل.",
};
export default function AssistantPage() {
  return <Assistant />;
}
