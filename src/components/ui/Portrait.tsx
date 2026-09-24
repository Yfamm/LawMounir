import Image from "next/image";
import styles from "./Portrait.module.css";

type Props = { name: string; image?: string; sizes: string };

function initials(name: string) {
  const parts = name.replace(/-/g, " ").split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`;
}

/**
 * Portrait slot. Renders the photograph when one is provided, otherwise a
 * studio-lit typographic plate with the person's initials.
 */
export function Portrait({ name, image, sizes }: Props) {
  if (image) {
    return <Image src={image} alt={`Portrait of ${name}`} fill sizes={sizes} className={styles.photo} />;
  }
  return (
    <div className={styles.plate} role="img" aria-label={`${name} — portrait to follow`}>
      <span className={styles.fluting} aria-hidden="true" />
      <span className={styles.light} aria-hidden="true" />
      <span className={`${styles.initials} serif`} aria-hidden="true">
        {initials(name)}
      </span>
    </div>
  );
}
