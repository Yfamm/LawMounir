import Image from "next/image";
import type { InsightView } from "@/lib/cms/repository";
import { Arrow } from "./Arrow";
import { TransitionLink } from "./TransitionLink";
import styles from "./EditorialCard.module.css";

export type CardLabels = { issue: string; read: string };

type Props = {
  insight: Pick<InsightView, "href" | "category" | "title" | "titleLang" | "standfirst" | "date" | "dateLabel" | "readingTime" | "cover">;
  issue: string;
  labels: CardLabels;
  variant?: "feature" | "standard";
};

/** Insight presented like a page from a legal journal rather than a blog tile. */
export function EditorialCard({ insight, issue, labels, variant = "standard" }: Props) {
  return (
    <article className={`${styles.card} ${styles[variant]}`} data-reveal-item>
      <TransitionLink href={insight.href} className={styles.link}>
        <span className={styles.rule} aria-hidden="true" />
        {variant === "feature" && (
          <div className={styles.media}>
            <Image
              src={insight.cover.src}
              alt=""
              fill
              sizes="(min-width: 900px) 55vw, 100vw"
              placeholder={typeof insight.cover.src === "string" ? "empty" : "blur"}
              className={styles.image}
              style={insight.cover.position !== "50% 50%" ? { objectPosition: insight.cover.position } : undefined}
            />
            <span className={styles.keyline} aria-hidden="true" />
          </div>
        )}
        <div className={styles.head}>
          <span className={`label ${styles.category}`}>{insight.category}</span>
          <span className={`${styles.issue} serif tabular`}>
            {labels.issue} {issue}
          </span>
        </div>

        <h3 className={`serif ${styles.title}`} lang={insight.titleLang}>
          <span className={styles.titleText}>{insight.title}</span>
        </h3>

        <p className={styles.standfirst} lang={insight.titleLang}>
          {insight.standfirst}
        </p>

        <div className={styles.foot}>
          <span className={`${styles.meta} tabular`}>
            <time dateTime={insight.date ?? undefined}>{insight.dateLabel}</time>
            {insight.readingTime && (
              <>
                <span aria-hidden="true"> · </span>
                {insight.readingTime}
              </>
            )}
          </span>
          <span className={styles.read}>
            {labels.read} <Arrow />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
