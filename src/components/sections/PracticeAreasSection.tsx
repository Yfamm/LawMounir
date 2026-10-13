import type { PracticeAreaView } from "@/lib/cms/repository";
import { headlineLines, pad2 } from "@/lib/cms/text";
import { Button } from "@/components/ui/Button";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HeadingContent } from "./content";
import styles from "./PracticeAreasSection.module.css";

type Props = { content: HeadingContent & { note: string }; areas: PracticeAreaView[]; index?: string; listLabel: string };

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

export function PracticeAreasSection({ content, areas, index = "03", listLabel }: Props) {
  return (
    <section className={`section ${styles.practice}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          other={content.labelOther || undefined}
          otherLang={content.otherLang}
          title={countedTitle(content.title, areas.length)}
          size="mega"
          intro={content.intro || undefined}
        />
        <div className={styles.list}>
          <PracticeAreaList areas={areas} label={listLabel} />
        </div>
        <Reveal className={styles.foot}>
          {content.note && <p className={styles.note}>{content.note}</p>}
          {content.cta && (
            <Button href={content.cta.href} variant="outline">
              {content.cta.text}
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
