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
          title={["The lawyers", <em key="e">behind the file.</em>]}
          size="l"
          // VERIFY: describes how the firm staffs matters — confirm before launch.
          intro="Lawyers who remain on the matter from first advice to final hearing, supported by a team that knows the file as well as they do."
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
