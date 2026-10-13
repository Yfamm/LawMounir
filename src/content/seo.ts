import type { Metadata } from "next";
import { ogLocale, other, type Lang } from "@/lib/i18n";

/**
 * Search indexing stays off until the firm's details are complete and the
 * site is approved for launch. Set NEXT_PUBLIC_SITE_INDEXABLE=true to allow it.
 */
export const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

type PageMeta = {
  lang: Lang;
  title: string;
  description: string;
  /** Language-neutral path from the site root, e.g. "/about" or "/". */
  path: string;
  siteName: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Social image from Site Settings; defaults to the built-in share image. */
  shareImage?: string | null;
  /** Language served at x-default (the site's default language). */
  defaultLanguage?: Lang;
  /** Set false when the page has no counterpart in the other language. */
  hasAlternate?: boolean;
};

const DEFAULT_SHARE = { url: "/opengraph-image.jpg", width: 1200, height: 630 };
const SHARE_ALT: Record<Lang, string> = {
  en: "Bronze statue of Justice holding scales at sunset — DIWAN, Law & Legal Consultancy",
  ar: "تمثال برونزي للعدالة يحمل الميزان عند الغروب — ديوان للمحاماه والأستشارات القانونية",
};

export const localePath = (lang: Lang, path: string) => (path === "/" ? `/${lang}` : `/${lang}${path}`);

/**
 * Per-page, per-language metadata: canonical URL, hreflang alternates and
 * full Open Graph / Twitter objects. Next.js merges `openGraph` shallowly, so
 * every page sets the complete object.
 */
export function pageMetadata({
  lang,
  title,
  description,
  path,
  siteName,
  type = "website",
  publishedTime,
  shareImage,
  defaultLanguage = "ar",
  hasAlternate = true,
}: PageMeta): Metadata {
  const fullTitle = `${title} — ${siteName}`;
  const image = shareImage ? { url: shareImage, alt: SHARE_ALT[lang] } : { ...DEFAULT_SHARE, alt: SHARE_ALT[lang] };
  const canonical = localePath(lang, path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: hasAlternate
        ? { ar: localePath("ar", path), en: localePath("en", path), "x-default": localePath(defaultLanguage, path) }
        : { [lang]: canonical },
    },
    openGraph: {
      type,
      siteName,
      locale: ogLocale(lang),
      alternateLocale: hasAlternate ? [ogLocale(other(lang))] : [],
      url: canonical,
      title: fullTitle,
      description,
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
