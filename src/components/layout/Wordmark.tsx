import { site } from "@/content/site";
import { Arabic } from "@/components/ui/Arabic";
import styles from "./Wordmark.module.css";

/** Typographic identity: serif name, brass rule, sans descriptor. */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`${styles.wordmark} ${compact ? styles.compact : ""} ${site.name.length > 10 ? styles.long : ""}`}
    >
      <span className={styles.name}>{site.name}</span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.descriptor}>
        {site.descriptor}
        <Arabic className={styles.city}>{site.nameAr}</Arabic>
      </span>
    </span>
  );
}
