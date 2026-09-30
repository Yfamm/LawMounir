import type { StaticImageData } from "next/image";
import heroImage from "@/assets/hero-justice.webp";
import { plateNumber, plates, type PlateKey } from "@/content/plates";
import type { ImageRef, StaticImageKey } from "./types";

/** An image ready for the presentation components. */
export type ResolvedImage = {
  src: StaticImageData | string;
  /** Small image used by hover previews. */
  preview: string;
  alt: string;
  caption: string;
  /** Plate numeral ("III") for static plates; empty for uploads. */
  plateNo: string;
  position: string;
};

const hero = {
  image: heroImage,
  preview: heroImage,
  alt: "Bronze statue of Justice holding scales at sunset, with the pyramids and the Nile in the distance",
  caption: "Justice",
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

/** Resolves a CMS image reference, falling back to the given static plate. */
export function resolveImage(ref: ImageRef | undefined, fallback: StaticImageKey): ResolvedImage {
  const r = ref ?? {};
  const position = r.position?.trim() || "50% 50%";
  if (r.url && r.mediaId) {
    return {
      src: r.url,
      preview: r.url,
      alt: r.alt ?? "",
      caption: r.caption ?? "",
      plateNo: "",
      position,
    };
  }
  const key = r.plate && (r.plate === "hero" || r.plate in plates) ? r.plate : fallback;
  const img = staticImage(key);
  return {
    src: img.image,
    preview: img.preview.src,
    alt: r.alt ?? img.alt,
    caption: r.caption?.trim() ? r.caption : img.caption,
    plateNo: key === "hero" ? "" : plateNumber(key as PlateKey),
    position,
  };
}

/** Catalogue of static images for the admin image picker. */
export function staticImageCatalogue() {
  return staticImageKeys.map((key) => {
    const img = staticImage(key);
    return { key, preview: img.preview.src, alt: img.alt, caption: img.caption, plateNo: key === "hero" ? "" : plateNumber(key as PlateKey) };
  });
}
