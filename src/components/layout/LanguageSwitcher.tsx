"use client";

import { usePathname } from "next/navigation";
import { useSite } from "@/components/providers/SiteProvider";
import { LANG_COOKIE, langNames, locales, switchPath, type Lang } from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

/** Remembers an explicit choice for a year; unprefixed URLs then open in it. */
function remember(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * Arabic / English switch. Each option is a real link to the same page in
 * the other language (slugs are shared, so detail pages are preserved); the
 * hash and query are kept. A full page load lets the document's lang and
 * dir, fonts and animations start cleanly in the new direction.
 */
export function LanguageSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const { lang, ui } = useSite();

  return (
    <nav className={`${styles.switcher} ${className ?? ""}`} aria-label={ui.languageSwitch}>
      {locales.map((l) => {
        const active = l === lang;
        const href = switchPath(pathname, l);
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            className={styles.option}
            aria-current={active ? "true" : undefined}
            aria-label={langNames[l].native}
            onClick={(e) => {
              remember(l);
              if (active) {
                e.preventDefault();
                return;
              }
              // Keep the visitor's place in query/hash when present.
              e.currentTarget.href = `${href}${window.location.search}${window.location.hash}`;
              onNavigate?.();
            }}
          >
            {l === "ar" ? "ع" : "EN"}
          </a>
        );
      })}
      <span className={styles.thumb} aria-hidden="true" data-active={lang} />
    </nav>
  );
}
