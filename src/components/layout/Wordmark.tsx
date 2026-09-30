"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Arabic } from "@/components/ui/Arabic";
import styles from "./Wordmark.module.css";

/** Typographic identity: serif name, brass rule, sans descriptor. */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  const { site } = useSite();
  return (
    <span
      className={`${styles.wordmark} ${compact ? styles.compact : ""} ${site.siteName.length > 10 ? styles.long : ""}`}
    >
      <span className={styles.name}>{site.siteName}</span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.descriptor}>
        {site.descriptor}
        <Arabic className={styles.city}>{site.siteNameAr}</Arabic>
      </span>
    </span>
  );
}
