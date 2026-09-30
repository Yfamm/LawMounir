import type { ReactNode } from "react";
import styles from "./admin.module.css";

export function PageHead({ eyebrow, title, intro, actions }: { eyebrow: string; title: ReactNode; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

export function Panel({ title, meta, children, id }: { title: string; meta?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className={styles.panel} id={id} aria-label={title}>
      <div className={styles.panelHead}>
        <h2 className={styles.panelTitle}>{title}</h2>
        {meta && <span className={styles.panelMeta}>{meta}</span>}
      </div>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}
