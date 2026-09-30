import Link from "next/link";
import styles from "./admin.module.css";

export function SectionTabs({ base, tabs, current }: { base: string; tabs: { id: string; label: string }[]; current: string }) {
  return (
    <nav className={styles.tabs} aria-label="Sections">
      {tabs.map((t) => (
        <Link key={t.id} href={`${base}?section=${t.id}`} className={styles.tab} aria-current={t.id === current ? "true" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
