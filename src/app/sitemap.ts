import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { practiceAreas } from "@/content/practiceAreas";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/practice-areas", "/people", "/insights", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
  }));
  const practice = practiceAreas.map((area) => ({ url: `${site.url}/practice-areas/${area.slug}` }));
  const notes = insights.map((insight) => ({
    url: `${site.url}/insights/${insight.slug}`,
    lastModified: insight.date,
  }));
  return [...pages, ...practice, ...notes];
}
