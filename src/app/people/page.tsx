import type { Metadata } from "next";
import { people } from "@/content/people";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our People",
  description: "The lawyers of the firm and the practice areas they lead.",
};

export default function PeoplePage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Our People"
        arabic="فريقنا"
        title={["Our", <span key="p">People<sup className="count">({String(people.length).padStart(2, "0")})</sup></span>]}
        // VERIFY: describes how the firm staffs matters — confirm before launch.
        intro="The lawyers who prepare the file are the lawyers who stand behind it, from first advice to final hearing."
      />

      <section className={`section ${styles.team}`} aria-label="The team">
        <div className="container">
          <TeamGrid people={people} showBio />
        </div>
      </section>

      <ContactSection index="02" />
    </>
  );
}
