import { insightCategories, insights } from "@/content/insights";
import { Button } from "@/components/ui/Button";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./InsightsSection.module.css";

export function InsightsSection() {
  const [lead, ...rest] = insights;
  return (
    <section className={`section surface-paper ${styles.insights}`} aria-label="Insights">
      <div className="container">
        <SectionHeading
          index="08"
          label="Insights"
          title={["Notes on", <em key="e">Egyptian law.</em>]}
          size="l"
          intro="Commentary on legislation, regulation and the practice of the courts — written for the people who have to act on it."
        />

        <Reveal className={styles.masthead}>
          <span className={styles.mastRule} data-reveal-line />
          <ul className={styles.categories} data-reveal-item>
            {insightCategories.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.grid} stagger={0.12}>
          <div className={styles.lead}>
            <EditorialCard insight={lead} issue="01" variant="feature" />
          </div>
          {rest.slice(0, 2).map((insight, i) => (
            <div key={insight.slug} className={styles.side}>
              <EditorialCard insight={insight} issue={String(i + 2).padStart(2, "0")} />
            </div>
          ))}
        </Reveal>

        <Reveal className={styles.foot}>
          <Button href="/insights" variant="outline" tone="paper">
            All insights
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
