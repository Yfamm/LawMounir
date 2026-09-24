import { formatDate, type Insight } from "@/content/insights";
import { Arrow } from "./Arrow";
import { TransitionLink } from "./TransitionLink";
import styles from "./EditorialCard.module.css";

type Props = {
  insight: Insight;
  issue: string;
  variant?: "feature" | "standard";
};

/** Insight presented like a page from a legal journal rather than a blog tile. */
export function EditorialCard({ insight, issue, variant = "standard" }: Props) {
  return (
    <article className={`${styles.card} ${styles[variant]}`} data-reveal-item>
      <TransitionLink href={`/insights/${insight.slug}`} className={styles.link}>
        <span className={styles.rule} aria-hidden="true" />
        <div className={styles.head}>
          <span className={`label ${styles.category}`}>{insight.category}</span>
          <span className={`${styles.issue} serif tabular`}>No. {issue}</span>
        </div>

        <h3 className={`serif ${styles.title}`}>
          <span className={styles.titleText}>{insight.title}</span>
        </h3>

        <p className={styles.standfirst}>{insight.standfirst}</p>

        <div className={styles.foot}>
          <span className={`${styles.meta} tabular`}>
            <time dateTime={insight.date}>{formatDate(insight.date)}</time>
            <span aria-hidden="true"> · </span>
            {insight.readingTime}
          </span>
          <span className={styles.read}>
            Read <Arrow />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
