import type { MetadataRoute } from "next";
import { indexable } from "@/content/seo";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Pre-launch safety: disallow crawling until NEXT_PUBLIC_SITE_INDEXABLE=true.
  return {
    rules: indexable ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
