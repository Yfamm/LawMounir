import type { MetadataRoute } from "next";
import { getInsights, getPracticeAreas, getSite } from "@/lib/cms/repository";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, areas, insights] = await Promise.all([getSite(), getPracticeAreas(), getInsights()]);
  const pages = ["", "/about", "/practice-areas", "/people", "/insights", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
  }));
  const practice = areas.map((area) => ({ url: `${site.url}/practice-areas/${area.slug}` }));
  const notes = insights.map((insight) => ({
    url: `${site.url}/insights/${insight.slug}`,
    ...(insight.date ? { lastModified: insight.date } : {}),
  }));
  return [...pages, ...practice, ...notes];
}
