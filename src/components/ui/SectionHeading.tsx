import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { SplitReveal } from "./SplitReveal";
import styles from "./SectionHeading.module.css";

type Props = {
  index?: string;
  label: string;
  title: ReactNode[];
  intro?: string;
  size?: "mega" | "xl" | "l" | "m";
  as?: "h1" | "h2";
  immediate?: boolean;
  aside?: ReactNode;
  className?: string;
};

/**
 * Editorial heading: a numbered label rule, oversized serif title and an
 * optional introduction set in the right-hand column.
 */
export function SectionHeading({
  index,
  label,
  title,
  intro,
  size = "xl",
  as = "h2",
  immediate = false,
  aside,
  className,
}: Props) {
  return (
    <header className={`${styles.heading} ${className ?? ""}`}>
      <Reveal className={styles.meta} immediate={immediate} delay={immediate ? 0.2 : 0}>
        {index && (
          <span className={`${styles.index} label tabular`} data-reveal-item>
            {index}
          </span>
        )}
        <span className={styles.rule} data-reveal-line />
        <span className="label" data-reveal-item>
          {label}
        </span>
      </Reveal>

      <div className={`${styles.body} ${size === "mega" ? styles.stacked : ""}`}>
        <RevealText
          as={as}
          lines={title}
          className={`display ${styles.title} ${styles[size]}`}
          immediate={immediate}
          delay={immediate ? 0.3 : 0}
        />
        {(intro || aside) && (
          <div className={styles.aside}>
            {intro && (
              <SplitReveal className="lede" immediate={immediate} delay={immediate ? 0.7 : 0.15}>
                {intro}
              </SplitReveal>
            )}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
