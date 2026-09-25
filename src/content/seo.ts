import type { Metadata } from "next";
import { site } from "./site";

/**
 * Search indexing stays off until the firm's details are complete and the
 * site is approved for launch. Set NEXT_PUBLIC_SITE_INDEXABLE=true to allow it.
 */
export const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

type PageMeta = {
  title: string;
  description: string;
  /** Path from the site root, e.g. "/about". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * Per-page metadata with its own canonical URL and Open Graph / Twitter
 * fields. Next.js merges `openGraph` shallowly, so every page sets the full
 * object rather than inheriting the home page's title and description.
 * A page-level `openGraph` replaces the root file-based share image, so the
 * image served from app/opengraph-image.jpg is referenced explicitly here.
 */
const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Bronze statue of Justice holding scales at sunset — DIWAN, Law & Legal Consultancy",
};

export function pageMetadata({ title, description, path, type = "website", publishedTime }: PageMeta): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_EG",
      url: path,
      title: fullTitle,
      description,
      images: [shareImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
  };
}
