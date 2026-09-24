import { people } from "@/content/people";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./PeopleSection.module.css";

export function PeopleSection() {
  return (
    <section className={`section ${styles.people}`} aria-label="Our people">
      <div className="container">
        <SectionHeading
          index="07"
          label="Our People"
          arabic="فريقنا"
          title={["Our counsel", <em key="e">and lawyers.</em>]}
          size="l"
          // Source: introduction document ("مستشارين ومحامين متخصصين"). Team details are placeholders.
          intro="Counsel and lawyers specialized in branches of the law. Profiles of the team will be published once confirmed by the firm."
          aside={
            <Button href="/people" variant="outline">
              Meet the team
            </Button>
          }
        />
        <div className={styles.grid}>
          <TeamGrid people={people.slice(0, 3)} />
        </div>
      </div>
    </section>
  );
}
