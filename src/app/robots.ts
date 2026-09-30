import type { MetadataRoute } from "next";
import { indexable } from "@/content/seo";
import { getSite } from "@/lib/cms/repository";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  // Pre-launch safety: disallow crawling until NEXT_PUBLIC_SITE_INDEXABLE=true.
  // The admin is never crawlable.
  return {
    rules: indexable ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
