import Image from "next/image";
import { isPlaceholder } from "@/lib/cms/text";
import type { Lang } from "@/lib/i18n";
import styles from "./Portrait.module.css";

type Props = {
  name: string;
  image?: string;
  alt?: string;
  sizes: string;
  lang: Lang;
  labels: { portraitToFollow: string; portraitOf: string };
};

function initials(name: string, lang: Lang) {
  if (isPlaceholder(name)) return "";
  const parts = name.replace(/-/g, " ").split(/\s+/).filter(Boolean);
  // Arabic letters change shape when isolated; show the first letters of the first two words.
  if (lang === "ar") return parts.slice(0, 2).map((p) => p[0]).join(" ");
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`;
}

/**
 * Portrait slot. Renders the photograph when one is provided, otherwise a
 * studio-lit typographic plate with the person's initials.
 */
export function Portrait({ name, image, alt, sizes, lang, labels }: Props) {
  if (image) {
    return (
      <Image src={image} alt={alt || labels.portraitOf.replace("{name}", name)} fill sizes={sizes} className={styles.photo} />
    );
  }
  return (
    <div
      className={styles.plate}
      role="img"
      aria-label={isPlaceholder(name) ? labels.portraitToFollow : `${name} — ${labels.portraitToFollow}`}
    >
      <span className={styles.fluting} aria-hidden="true" />
      <span className={styles.light} aria-hidden="true" />
      <span className={`${styles.initials} serif`} aria-hidden="true">
        {initials(name, lang)}
      </span>
    </div>
  );
}
