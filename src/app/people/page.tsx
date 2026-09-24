import type { Metadata } from "next";
import { people } from "@/content/people";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our People",
  description: "The counsel and lawyers of DIWAN — team profiles to follow.",
};

export default function PeoplePage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Our People"
        arabic="فريقنا"
        title={["Our", <span key="p">People<sup className="count">({String(people.length).padStart(2, "0")})</sup></span>]}
        // Source: introduction document ("مستشارين ومحامين متخصصين"). Team details are placeholders.
        intro="Counsel and lawyers specialized in branches of the law. Profiles of the team will be published once confirmed by the firm."
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
