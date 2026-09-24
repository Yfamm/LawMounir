import { site } from "@/content/site";
import styles from "./Wordmark.module.css";

/** Typographic identity: serif name, brass rule, sans descriptor. */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`${styles.wordmark} ${compact ? styles.compact : ""}`}>
      <span className={styles.name}>{site.name}</span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.descriptor}>
        {site.descriptor}
        <span className={styles.city}>{site.city}</span>
      </span>
    </span>
  );
}
