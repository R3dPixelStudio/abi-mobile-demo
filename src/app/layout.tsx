import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import "./shop.css";
import { Providers } from "@/components/providers";
import { branding } from "@/lib/brand";
export const metadata: Metadata = {
  metadataBase: new URL(branding.url),
  title: {
    default: "آبی‌موبایل | یک انتخاب روشن",
    template: "%s | آبی‌موبایل",
  },
  description:
    "فروشگاه نمایشی گوشی و لوازم جانبی؛ جستجو، مقایسه و انتخاب همراه بعدی شما.",
  robots: { index: false, follow: false },
  openGraph: { locale: "fa_IR", type: "website", siteName: branding.name },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <a className="skip-link" href="#main">
          رفتن به محتوای اصلی
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
