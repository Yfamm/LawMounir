/**
 * Language core. Arabic is the default language; every public URL carries a
 * language prefix (/ar/..., /en/...). Pure module — safe on client, server,
 * proxy and scripts.
 */

export const locales = ["ar", "en"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "ar";
/** Cookie that remembers an explicit language choice. */
export const LANG_COOKIE = "diwan_lang";

export const isLang = (v: unknown): v is Lang => v === "ar" || v === "en";
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");
export const other = (lang: Lang): Lang => (lang === "ar" ? "en" : "ar");
export const ogLocale = (lang: Lang) => (lang === "ar" ? "ar_EG" : "en_EG");

/** A localized string. */
export type L = { en: string; ar: string };
/** A localized list of strings. */
export type LL = { en: string[]; ar: string[] };

export const L = (en: string, ar: string): L => ({ en, ar });
export const emptyL = (): L => ({ en: "", ar: "" });

/** True when the value has the localized-object shape. */
export function isL(v: unknown): v is L {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v) && ("en" in (v as object) || "ar" in (v as object));
}

/** Coerces a stored value (legacy plain string or localized object) to L. */
export function toL(v: unknown, legacyAr = ""): L {
  if (isL(v)) return { en: typeof v.en === "string" ? v.en : "", ar: typeof v.ar === "string" ? v.ar : "" };
  if (typeof v === "string") return { en: v, ar: legacyAr };
  return emptyL();
}

export function toLL(v: unknown, legacyAr: string[] = []): LL {
  const arr = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : []);
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as { en?: unknown; ar?: unknown };
    return { en: arr(o.en), ar: arr(o.ar) };
  }
  return { en: arr(v), ar: legacyAr };
}

/**
 * The value in the requested language, falling back to the other language
 * so a page is never blank. `fallback` tells the caller which happened.
 */
export function pickL(v: L | undefined, lang: Lang): { text: string; lang: Lang; fallback: boolean } {
  const own = v?.[lang]?.trim() ?? "";
  if (own) return { text: v![lang], lang, fallback: false };
  const alt = v?.[other(lang)] ?? "";
  return { text: alt, lang: alt ? other(lang) : lang, fallback: Boolean(alt) };
}

/** Shorthand: the string in the requested language (with fallback). */
export const tr = (v: L | undefined, lang: Lang) => pickL(v, lang).text;

export function trList(v: LL | undefined, lang: Lang) {
  if (v?.[lang]?.some((s) => s.trim())) return v[lang].filter((s) => s.trim());
  return (v?.[other(lang)] ?? []).filter((s) => s.trim());
}

/** Splits a pathname into language and the language-neutral rest ("/about"). */
export function splitPath(pathname: string): { lang: Lang | null; rest: string } {
  const m = pathname.match(/^\/(ar|en)(?=\/|$)(.*)$/);
  if (!m) return { lang: null, rest: pathname || "/" };
  return { lang: m[1] as Lang, rest: m[2] || "/" };
}

/** "/about" → "/ar/about"; leaves external, mailto:, tel:, # and already-prefixed links alone. */
export function localizeHref(href: string, lang: Lang) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (/^\/(ar|en)(\/|$|#|\?)/.test(href)) return href;
  if (href.startsWith("/api/") || href.startsWith("/admin")) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

/** Same page in the other language. */
export function switchPath(pathname: string, to: Lang) {
  const { rest } = splitPath(pathname);
  return rest === "/" ? `/${to}` : `/${to}${rest}`;
}

export const langNames: Record<Lang, { native: string; short: string }> = {
  ar: { native: "العربية", short: "ع" },
  en: { native: "English", short: "EN" },
};
