import type { PersonView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/ui/TeamGrid";
import type { HeadingContent } from "./content";
import styles from "./PeopleSection.module.css";

type Props = { content: HeadingContent; people: PersonView[]; index?: string };

export function PeopleSection({ content, people, index = "07" }: Props) {
  return (
    <section className={`section ${styles.people}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          other={content.labelOther || undefined}
          otherLang={content.otherLang}
          title={headlineLines(content.title)}
          size="l"
          intro={content.intro || undefined}
          aside={
            content.cta ? (
              <Button href={content.cta.href} variant="outline">
                {content.cta.text}
              </Button>
            ) : undefined
          }
        />
        <div className={styles.grid}>
          <TeamGrid people={people} />
        </div>
      </div>
    </section>
  );
}
