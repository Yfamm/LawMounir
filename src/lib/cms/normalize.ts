/**
 * Reads stored CMS JSON in any shape this project has used and returns the
 * current bilingual shape, filled from the source content where a value is
 * missing. Pre-bilingual data ({ label: "…", labelAr: "…" }, ctaText /
 * ctaUrl, …) is converted on read, so existing content is never lost; the
 * next save writes the new shape.
 *
 * Arabic for a legacy English-only value is taken from the source content
 * only when the English is unchanged from the source — an edited English
 * text is never paired with a stale translation.
 */
import { isL, type L, type LL } from "@/lib/i18n";
import { defaultSections, defaultSettings } from "./defaults";
import { sectionFields, settingsFields, footerFields, type Field } from "./fields";
import type { AboutBlock, HomeLayout, HomeSectionId, ImageRef, SectionKey, SectionMap, SiteSettings } from "./types";

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

function toLocalized(v: unknown, legacyAr: unknown, def: L | undefined): L {
  if (isL(v)) return { en: str(v.en) ?? "", ar: str(v.ar) ?? "" };
  if (typeof v === "string") {
    // Unchanged English keeps the designed Arabic; edited English keeps any legacy Arabic.
    const ar = def && v === def.en ? def.ar : (str(legacyAr) ?? "");
    return { en: v, ar };
  }
  return def ? { ...def } : { en: "", ar: "" };
}

function toLocalizedLines(v: unknown, def: LL | undefined): LL {
  const arr = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : []);
  if (Array.isArray(v)) {
    const en = arr(v);
    const same = def && def.en.length === en.length && def.en.every((s, i) => s === en[i]);
    return { en, ar: same ? [...def.ar] : [] };
  }
  if (v && typeof v === "object") return { en: arr((v as Obj).en), ar: arr((v as Obj).ar) };
  return def ? { en: [...def.en], ar: [...def.ar] } : { en: [], ar: [] };
}

export function normalizeImage(v: unknown, def?: ImageRef): ImageRef {
  if (!v || typeof v !== "object") return def ? { ...def } : {};
  const o = v as Obj;
  const out: ImageRef = {};
  if (typeof o.plate === "string") out.plate = o.plate as ImageRef["plate"];
  if (typeof o.mediaId === "string") out.mediaId = o.mediaId;
  if (typeof o.url === "string") out.url = o.url;
  if (typeof o.position === "string" && o.position) out.position = o.position;
  if (o.alt !== undefined) out.alt = toLocalized(o.alt, undefined, undefined);
  if (o.caption !== undefined) out.caption = toLocalized(o.caption, undefined, undefined);
  return out;
}

/** Legacy names of link fields: field "primary" was stored as ctaText / ctaUrl. */
const LINK_ALIASES: Record<string, string> = { primary: "cta", secondary: "secondaryCta", cta: "cta", navCta: "navCta" };
/** Legacy names of renamed fields. */
const FIELD_ALIASES: Record<string, string> = { supporting: "text" };

export function normalizeByFields(fields: Field[], storedIn: unknown, defIn: unknown): Obj {
  const stored = obj(storedIn);
  const def = obj(defIn);
  const out: Obj = {};
  for (const f of fields) {
    const key = f.name in stored ? f.name : (FIELD_ALIASES[f.name] ?? f.name);
    const v = stored[key];
    const d = def[f.name];
    switch (f.type) {
      case "text":
      case "textarea":
      case "headline":
        out[f.name] = f.localized ? toLocalized(v, stored[`${key}Ar`], d as L | undefined) : (str(v) ?? d ?? "");
        break;
      case "lines":
        out[f.name] = f.localized ? toLocalizedLines(v, d as LL | undefined) : Array.isArray(v) ? v : (d ?? []);
        break;
      case "link": {
        const dl = obj(d) as { text?: L; url?: string };
        if (v && typeof v === "object" && "text" in (v as Obj)) {
          const o = v as Obj;
          out[f.name] = { text: toLocalized(o.text, undefined, dl.text), url: str(o.url) ?? dl.url ?? "" };
        } else {
          const alias = LINK_ALIASES[f.name] ?? f.name;
          const legacyText = stored[`${alias}Text`];
          const legacyUrl = stored[`${alias}Url`];
          out[f.name] =
            legacyText !== undefined || legacyUrl !== undefined
              ? { text: toLocalized(legacyText ?? "", undefined, dl.text), url: str(legacyUrl) ?? dl.url ?? "" }
              : { text: dl.text ? { ...dl.text } : { en: "", ar: "" }, url: dl.url ?? "" };
        }
        break;
      }
      case "image":
        out[f.name] = v === undefined ? normalizeImage(d) : normalizeImage(v);
        break;
      case "group":
        out[f.name] = normalizeByFields(f.fields, v, d);
        break;
      case "list": {
        const defs = Array.isArray(d) ? d : [];
        out[f.name] = Array.isArray(v) ? v.map((item, i) => normalizeByFields(f.fields, item, defs[i])) : defs.map((item) => normalizeByFields(f.fields, item, item));
        break;
      }
      default:
        out[f.name] = v === undefined ? d : v;
    }
  }
  const flags = stored._translation ?? def._translation;
  if (flags) out._translation = flags;
  return out;
}

const HOME_IDS: HomeSectionId[] = ["intro", "practice", "landscape", "values", "experience", "people", "insights"];

function normalizeLayout(v: unknown): HomeLayout {
  const o = obj(v);
  const order = Array.isArray(o.order) ? (o.order.filter((x) => HOME_IDS.includes(x as HomeSectionId)) as HomeSectionId[]) : [];
  for (const id of HOME_IDS) if (!order.includes(id)) order.push(id);
  const hidden = Array.isArray(o.hidden) ? (o.hidden.filter((x) => HOME_IDS.includes(x as HomeSectionId)) as HomeSectionId[]) : [];
  return { order: [...new Set(order)], hidden: [...new Set(hidden)] };
}

/** Builds about.blocks from the four pre-bilingual about.* sections. */
function legacyAbout(sections: Record<string, unknown>): Obj | undefined {
  const keys = ["vision", "who", "values", "mission"] as const;
  if (!keys.some((k) => sections[`about.${k}`])) return undefined;
  const defs = defaultSections["about.blocks"].blocks;
  const blocks = keys.map((k) => {
    const d = defs.find((b) => b.id === k)!;
    const o = obj(sections[`about.${k}`]);
    if (!Object.keys(o).length) return d;
    const block: AboutBlock = {
      id: k,
      layout: d.layout,
      enabled: o.enabled !== false,
      label: toLocalized(o.label, o.titleAr, d.label),
      title: toLocalized(o.title, undefined, d.title),
      body: { en: str(o.bodyEn) || d.body.en, ar: str(o.bodyAr) || (str(o.bodyEn) && str(o.bodyEn) !== d.body.en ? "" : d.body.ar) },
      image: o.image === undefined ? d.image : normalizeImage(o.image),
    };
    return block;
  });
  return { blocks };
}

/** A page section in the current shape, from whatever is stored (or nothing). */
export function normalizeSection<K extends SectionKey>(key: K, sections: Record<string, unknown>): SectionMap[K] {
  const stored = sections[key];
  if (key === "home.layout") return normalizeLayout(stored) as SectionMap[K];
  const source = stored ?? (key === "about.blocks" ? legacyAbout(sections) : undefined);
  const result = normalizeByFields(sectionFields[key], source, defaultSections[key]);
  if (key === "about.blocks") {
    const blocks = (result.blocks as Obj[]).map((b, i) => ({
      ...b,
      id: typeof b.id === "string" && b.id ? b.id : `block-${i + 1}`,
      enabled: b.enabled !== false,
      layout: ["header", "story", "values", "statement"].includes(String(b.layout)) ? b.layout : "story",
    }));
    result.blocks = blocks;
  }
  return result as SectionMap[K];
}

/** Site settings in the current shape (legacy flat settings are converted). */
export function normalizeSettings(storedIn: unknown): SiteSettings {
  const s = { ...obj(storedIn) };
  // Pre-bilingual names.
  if (s.wordmark === undefined && typeof s.siteName === "string") s.wordmark = s.siteName;
  if (s.brandName === undefined && typeof s.siteName === "string") s.brandName = { en: s.siteName, ar: defaultSettings.brandName.ar };
  if (s.firmName === undefined && (typeof s.descriptor === "string" || typeof s.siteNameAr === "string")) {
    s.firmName = { en: str(s.descriptor) ?? defaultSettings.firmName.en, ar: str(s.siteNameAr) ?? defaultSettings.firmName.ar };
  }
  const fields = [...settingsFields, ...footerFields];
  const out = normalizeByFields(fields, s, defaultSettings) as unknown as SiteSettings;
  if (out.defaultLanguage !== "en") out.defaultLanguage = "ar";
  out.canonicalUrl = str(s.canonicalUrl) ?? "";
  return out;
}
