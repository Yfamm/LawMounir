import type { StaticImageData } from "next/image";
import heroImage from "@/assets/hero-justice.webp";
import { plateNumber, plates, type PlateKey } from "@/content/plates";
import { tr, type L, type Lang } from "@/lib/i18n";
import type { ImageRef, StaticImageKey } from "./types";

/** An image ready for the presentation components (one language). */
export type ResolvedImage = {
  src: StaticImageData | string;
  /** Small image used by hover previews. */
  preview: string;
  alt: string;
  caption: string;
  /** Plate numeral ("III") for built-in plates; empty for uploads. */
  plateNo: string;
  position: string;
};

/** A media-library entry as the public site needs it. */
export type MediaInfo = { url: string; alt: L; caption: L };
export type MediaMap = Map<string, MediaInfo>;

const hero = {
  image: heroImage,
  preview: heroImage,
  alt: "Bronze statue of Justice holding scales at sunset, with the pyramids and the Nile in the distance",
  altAr: "تمثال برونزي للعدالة يحمل الميزان عند الغروب، وفي الأفق الأهرامات ونهر النيل",
  caption: "Justice",
  captionAr: "العدالة",
};

export const staticImageKeys: StaticImageKey[] = [
  "hero",
  "hallAisle",
  "colonnade",
  "mashrabiya",
  "hallRows",
  "colonnadeDetail",
  "hallAislePortrait",
];

function staticImage(key: StaticImageKey) {
  return key === "hero" ? hero : plates[key as PlateKey];
}

/** First candidate written in `lang`; failing that, the first written in any language. */
function choose(lang: Lang, ...candidates: (L | undefined)[]) {
  const own = candidates.find((c) => c?.[lang]?.trim());
  if (own) return own[lang];
  const any = candidates.find((c) => c?.en?.trim() || c?.ar?.trim());
  return any ? tr(any, lang) : "";
}

/**
 * Resolves a CMS image reference for one language. Uploaded images are looked
 * up by id in the media library (so replacing a file updates every use);
 * otherwise the built-in plate is used, falling back to `fallback`.
 */
export function resolveImage(ref: ImageRef | undefined, fallback: StaticImageKey, lang: Lang, media?: MediaMap): ResolvedImage {
  const r = ref ?? {};
  const position = r.position?.trim() || "50% 50%";
  if (r.mediaId) {
    const m = media?.get(r.mediaId);
    const url = m?.url ?? r.url;
    if (url) {
      return {
        src: url,
        preview: url,
        alt: choose(lang, r.alt, m?.alt),
        caption: choose(lang, r.caption, m?.caption),
        plateNo: "",
        position,
      };
    }
  }
  const key = r.plate && (r.plate === "hero" || r.plate in plates) ? r.plate : fallback;
  const img = staticImage(key);
  return {
    src: img.image,
    preview: img.preview.src,
    alt: choose(lang, r.alt, { en: img.alt, ar: img.altAr }),
    caption: choose(lang, r.caption, { en: img.caption, ar: img.captionAr }),
    plateNo: key === "hero" ? "" : plateNumber(key as PlateKey),
    position,
  };
}

/** Catalogue of built-in images for the admin picker. */
export function staticImageCatalogue() {
  return staticImageKeys.map((key) => {
    const img = staticImage(key);
    return { key, preview: img.preview.src, alt: img.alt, caption: img.caption, captionAr: img.captionAr, plateNo: key === "hero" ? "" : plateNumber(key as PlateKey) };
  });
}
