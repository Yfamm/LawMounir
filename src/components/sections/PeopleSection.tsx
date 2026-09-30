import type { PersonView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import type { HomePeople } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./PeopleSection.module.css";

type Props = { content: HomePeople; people: PersonView[]; index?: string };

export function PeopleSection({ content, people, index = "07" }: Props) {
  return (
    <section className={`section ${styles.people}`} aria-label={content.label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={content.label}
          arabic={content.labelAr || undefined}
          title={headlineLines(content.title)}
          size="l"
          intro={content.intro || undefined}
          aside={
            content.ctaText && content.ctaUrl ? (
              <Button href={content.ctaUrl} variant="outline">
                {content.ctaText}
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
