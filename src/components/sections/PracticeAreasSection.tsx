import type { PracticeAreaView } from "@/lib/cms/repository";
import { headlineLines, pad2 } from "@/lib/cms/text";
import type { HomePractice } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PracticeAreasSection.module.css";

type Props = { content: HomePractice; areas: PracticeAreaView[]; index?: string };

/** Title lines with the count of published areas set after the last line. */
export function countedTitle(title: string, count: number) {
  const lines = headlineLines(title);
  const last = lines.pop();
  return [
    ...lines,
    <span key="count">
      {last}
      <sup className="count">({pad2(count)})</sup>
    </span>,
  ];
}

export function PracticeAreasSection({ content, areas, index = "03" }: Props) {
  return (
    <section className={`section ${styles.practice}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          arabic={content.labelAr || undefined}
          title={countedTitle(content.title, areas.length)}
          size="mega"
          intro={content.intro || undefined}
        />
        <div className={styles.list}>
          <PracticeAreaList areas={areas} />
        </div>
        <Reveal className={styles.foot}>
          {content.note && <p className={styles.note}>{content.note}</p>}
          {content.ctaText && content.ctaUrl && (
            <Button href={content.ctaUrl} variant="outline">
              {content.ctaText}
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
