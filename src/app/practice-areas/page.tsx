import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { practiceAreas } from "@/content/practiceAreas";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Practice Areas",
  description:
    "Companies and investment, civil and real-estate transactions, personal status, and representation before judicial and administrative bodies — DIWAN, Kafr el Sheikh.",
  path: "/practice-areas",
});

export default function PracticeAreasPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Practice Areas"
        arabic="مجالات الممارسة"
        title={["Practice", <span key="a">Areas<sup className="count">({String(practiceAreas.length).padStart(2, "0")})</sup></span>]}
        // Source: introduction document (areas) and mission (representation).
        intro="Companies and investment, civil and real-estate transactions, and personal status — the areas named in the firm's own introduction, with representation before judicial and administrative bodies."
        plate={{ key: "colonnade", position: "50% 40%" }}
      />

      <section className={`section ${styles.index}`} aria-label="All practice areas">
        <div className="container">
          <PracticeAreaList areas={practiceAreas} />
        </div>
      </section>

      <ExperienceSection index="02" />
      <ContactSection index="03" />
    </>
  );
}
