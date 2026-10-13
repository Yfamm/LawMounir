"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Arabic } from "@/components/ui/Arabic";
import styles from "./Wordmark.module.css";

/**
 * Typographic identity: serif wordmark, brass rule, bilingual descriptor.
 * The Latin wordmark is the logo in both languages; the descriptor leads
 * with the page language. An uploaded logo image (Site Settings) replaces
 * the wordmark.
 */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  const { site, lang } = useSite();
  return (
    <span className={`${styles.wordmark} ${compact ? styles.compact : ""} ${site.wordmark.length > 10 ? styles.long : ""}`}>
      {site.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={site.logo.src} alt={site.logo.alt} className={styles.logo} />
      ) : (
        <span className={styles.name} lang="en" dir="ltr">
          {site.wordmark}
        </span>
      )}
      <span className={styles.rule} aria-hidden="true" />
      {lang === "en" ? (
        <span className={styles.descriptor}>
          {site.firmName}
          <Arabic className={styles.city}>{site.firmNameOther}</Arabic>
        </span>
      ) : (
        <span className={`${styles.descriptor} ${styles.descriptorAr}`}>
          <span className={styles.cityAr}>{site.firmName}</span>
          <span lang="en" dir="ltr" className={styles.latinSub}>
            {site.firmNameOther}
          </span>
        </span>
      )}
    </span>
  );
}
