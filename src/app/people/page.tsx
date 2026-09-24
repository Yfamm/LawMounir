import type { Metadata } from "next";
import { people } from "@/content/people";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our People",
  description: "The lawyers of Mounir Law Firm — partners and associates across corporate, disputes, regulatory and personal matters.",
};

export default function PeoplePage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Our People"
        arabic="فريقنا"
        title={["Our", <span key="p">People<sup className="count">(06)</sup></span>]}
        intro="Partners stay on the matter from first advice to final hearing. The people who prepare the file are the people who stand behind it."
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
