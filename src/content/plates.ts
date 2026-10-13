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
  altAr: string;
  /** Editorial caption, set like a plate in a folio. */
  caption: string;
  captionAr: string;
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
    altAr: "ضوء الشمس يتساقط في حزم عبر سقف قاعة أعمدة تعلوها تيجان على هيئة البردي",
    caption: "The hall of columns",
    captionAr: "قاعة الأعمدة",
  },
  hallAislePortrait: {
    image: hallAislePortrait,
    preview: pHallAislePortrait,
    alt: "A shaft of sunlight crossing the central aisle of a hypostyle hall",
    altAr: "حزمة من ضوء الشمس تعبر الممر الأوسط لقاعة أعمدة",
    caption: "The central aisle",
    captionAr: "الممر الأوسط",
  },
  hallRows: {
    image: hallRows,
    preview: pHallRows,
    alt: "Massive carved columns receding into warm haze in a temple hall",
    altAr: "أعمدة ضخمة منقوشة تمتد في ضباب دافئ داخل قاعة معبد",
    caption: "Rows of the hypostyle",
    captionAr: "صفوف قاعة الأعمدة",
  },
  colonnade: {
    image: colonnade,
    preview: pColonnade,
    alt: "A neoclassical colonnade and broad steps catching the last golden light",
    altAr: "رواق بأعمدة كلاسيكية ودرجات عريضة يلتقط آخر ضوء ذهبي",
    caption: "The portico at dusk",
    captionAr: "الرواق عند الغروب",
  },
  colonnadeDetail: {
    image: colonnadeDetail,
    preview: pColonnadeDetail,
    alt: "Fluted columns and capitals lit by a low sun",
    altAr: "أعمدة مضلّعة وتيجانها في ضوء شمس منخفض",
    caption: "Fluted shafts, raking light",
    captionAr: "أعمدة مضلّعة في ضوء مائل",
  },
  mashrabiya: {
    image: mashrabiya,
    preview: pMashrabiya,
    alt: "Afternoon light falling through a turned-wood mashrabiya screen onto a plaster wall",
    altAr: "ضوء العصر ينفذ من مشربية خشبية مخروطة على جدار من الجص",
    caption: "Light through the mashrabiya",
    captionAr: "الضوء عبر المشربية",
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
