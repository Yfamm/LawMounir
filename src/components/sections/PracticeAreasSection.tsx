import { practiceAreas } from "@/content/practiceAreas";
import { Button } from "@/components/ui/Button";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PracticeAreasSection.module.css";

export function PracticeAreasSection() {
  return (
    <section className={`section ${styles.practice}`} aria-label="Practice areas">
      <div className="container">
        <SectionHeading
          index="03"
          label="Practice Areas"
          arabic="مجالات الممارسة"
          title={["Practice", <span key="a">Areas<sup className="count">(12)</sup></span>]}
          size="mega"
          intro="Twelve areas of Egyptian law, organized around the decisions clients actually face — and the forums where those decisions are tested."
        />
        <div className={styles.list}>
          <PracticeAreaList areas={practiceAreas} />
        </div>
        <Reveal className={styles.foot}>
          <p className={styles.note}>Each practice links to a detailed overview of scope and forums.</p>
          <Button href="/practice-areas" variant="outline">
            All practice areas
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
