import type { MetadataRoute } from "next";
import { getDefaultLanguage, getSite, getSlugs } from "@/lib/cms/repository";
import { locales } from "@/lib/i18n";

export const revalidate = 300;

/** Every public page in Arabic and English, each with its hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, slugs, fallback] = await Promise.all([getSite("ar"), getSlugs(), getDefaultLanguage()]);
  const paths = [
    "",
    "/about",
    "/practice-areas",
    "/people",
    "/insights",
    "/contact",
    ...slugs.practice.map((s) => `/practice-areas/${s}`),
    ...slugs.insights.map((s) => `/insights/${s}`),
  ];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      alternates: {
        languages: {
          ar: `${site.url}/ar${path}`,
          en: `${site.url}/en${path}`,
          "x-default": `${site.url}/${fallback}${path}`,
        },
      },
    })),
  );
}
