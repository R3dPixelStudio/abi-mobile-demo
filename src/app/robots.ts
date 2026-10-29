import type { MetadataRoute } from "next";
import { branding } from "@/lib/brand";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${branding.url}/sitemap.xml`,
  };
}
