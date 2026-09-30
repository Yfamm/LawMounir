import type { InsightView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import type { HomeInsights } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./InsightsSection.module.css";

type Props = { content: HomeInsights; insights: InsightView[]; categories: string[]; index?: string };

export function InsightsSection({ content, insights, categories, index = "08" }: Props) {
  const [lead, ...rest] = insights;
  return (
    <section className={`section surface-paper ${styles.insights}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          arabic={content.labelAr || undefined}
          title={headlineLines(content.title)}
          size="l"
          intro={content.intro || undefined}
        />

        <Reveal className={styles.masthead}>
          <span className={styles.mastRule} data-reveal-line />
          <ul className={styles.categories} data-reveal-item>
            {categories.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        {lead && (
          <Reveal className={styles.grid} stagger={0.12}>
            <div className={styles.lead}>
              <EditorialCard insight={lead} issue={lead.issue} variant="feature" />
            </div>
            {rest.slice(0, 2).map((insight) => (
              <div key={insight.slug} className={styles.side}>
                <EditorialCard insight={insight} issue={insight.issue} />
              </div>
            ))}
          </Reveal>
        )}

        {content.ctaText && content.ctaUrl && (
          <Reveal className={styles.foot}>
            <Button href={content.ctaUrl} variant="outline" tone="paper">
              {content.ctaText}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
