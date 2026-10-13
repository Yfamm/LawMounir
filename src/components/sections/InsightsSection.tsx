import type { InsightView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { Button } from "@/components/ui/Button";
import { EditorialCard, type CardLabels } from "@/components/ui/EditorialCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HeadingContent } from "./content";
import styles from "./InsightsSection.module.css";

type Props = { content: HeadingContent; insights: InsightView[]; categories: string[]; labels: CardLabels; index?: string };

export function InsightsSection({ content, insights, categories, labels, index = "08" }: Props) {
  const [lead, ...rest] = insights;
  return (
    <section className={`section surface-paper ${styles.insights}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          other={content.labelOther || undefined}
          otherLang={content.otherLang}
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
              <EditorialCard insight={lead} issue={lead.issue} labels={labels} variant="feature" />
            </div>
            {rest.slice(0, 2).map((insight) => (
              <div key={insight.slug} className={styles.side}>
                <EditorialCard insight={insight} issue={insight.issue} labels={labels} />
              </div>
            ))}
          </Reveal>
        )}

        {content.cta && (
          <Reveal className={styles.foot}>
            <Button href={content.cta.href} variant="outline" tone="paper">
              {content.cta.text}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
