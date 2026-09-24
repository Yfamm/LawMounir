import type { StaticImageData } from "next/image";
import colonnade from "@/assets/plates/colonnade.webp";
import colonnadeDetail from "@/assets/plates/colonnade-detail.webp";
import hallAisle from "@/assets/plates/hall-aisle.webp";
import hallAislePortrait from "@/assets/plates/hall-aisle-portrait.webp";
import hallRows from "@/assets/plates/hall-rows.webp";
import mashrabiya from "@/assets/plates/mashrabiya.webp";
import pColonnade from "@/assets/previews/colonnade.webp";
import pColonnadeDetail from "@/assets/previews/colonnade-detail.webp";
import pHallAisle from "@/assets/previews/hall-aisle.webp";
import pHallAislePortrait from "@/assets/previews/hall-aisle-portrait.webp";
import pHallRows from "@/assets/previews/hall-rows.webp";
import pMashrabiya from "@/assets/previews/mashrabiya.webp";

export type Plate = {
  image: StaticImageData;
  /** Small version used for the cursor-following practice preview. */
  preview: StaticImageData;
  alt: string;
  /** Editorial caption, set like a plate in a folio. */
  caption: string;
};

/**
 * Architectural plates — original renders of Egyptian architectural types,
 * graded to the site's black, ivory and antique-gold palette.
 */
export const plates = {
  hallAisle: {
    image: hallAisle,
    preview: pHallAisle,
    alt: "Sunlight falling in shafts through the roof of a hypostyle hall of carved papyrus columns",
    caption: "The hall of columns",
  },
  hallAislePortrait: {
    image: hallAislePortrait,
    preview: pHallAislePortrait,
    alt: "A shaft of sunlight crossing the central aisle of a hypostyle hall",
    caption: "The central aisle",
  },
  hallRows: {
    image: hallRows,
    preview: pHallRows,
    alt: "Massive carved columns receding into warm haze in a temple hall",
    caption: "Rows of the hypostyle",
  },
  colonnade: {
    image: colonnade,
    preview: pColonnade,
    alt: "A neoclassical colonnade and broad steps catching the last golden light",
    caption: "The portico at dusk",
  },
  colonnadeDetail: {
    image: colonnadeDetail,
    preview: pColonnadeDetail,
    alt: "Fluted columns and capitals lit by a low sun",
    caption: "Fluted shafts, raking light",
  },
  mashrabiya: {
    image: mashrabiya,
    preview: pMashrabiya,
    alt: "Afternoon light falling through a turned-wood mashrabiya screen onto a plaster wall",
    caption: "Light through the mashrabiya",
  },
} satisfies Record<string, Plate>;

export type PlateKey = keyof typeof plates;

export const plateOrder: PlateKey[] = [
  "hallAisle",
  "colonnade",
  "mashrabiya",
  "hallRows",
  "colonnadeDetail",
  "hallAislePortrait",
];

/** Roman numeral used for plate captions ("Pl. III"). */
export function plateNumber(key: PlateKey) {
  const n = plateOrder.indexOf(key) + 1;
  return ["I", "II", "III", "IV", "V", "VI"][n - 1] ?? String(n);
}
