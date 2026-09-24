import type { PracticeArea } from "@/content/practiceAreas";
import { Arrow } from "./Arrow";
import { TransitionLink } from "./TransitionLink";
import styles from "./PracticeAreaList.module.css";

type Props = {
  area: PracticeArea;
  number: string;
  onActivate?: () => void;
};

export function PracticeAreaRow({ area, number, onActivate }: Props) {
  return (
    <li className={styles.row} data-row>
      <span className={styles.rule} data-row-rule aria-hidden="true" />
      <TransitionLink
        href={`/practice-areas/${area.slug}`}
        className={styles.link}
        onPointerEnter={onActivate}
        onFocus={onActivate}
      >
        <span className={styles.accent} aria-hidden="true" />
        <span className={`${styles.num} label tabular`}>{number}</span>
        <span className={`${styles.title} serif`}>{area.title}</span>
        <span className={styles.summary}>{area.summary}</span>
        <span className={styles.go} aria-hidden="true">
          <Arrow />
        </span>
      </TransitionLink>
    </li>
  );
}
