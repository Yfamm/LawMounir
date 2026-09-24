import type { Metadata } from "next";
import { practiceAreas } from "@/content/practiceAreas";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Corporate, disputes, criminal, real estate, finance, tax, employment, IP, family, regulatory, investment and technology law in Egypt.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Practice Areas"
        title={["Practice", "Areas"]}
        intro="Twelve areas of Egyptian law, each organized around the forum where matters are decided and the authorities that shape them."
        image={{
          position: "57% 62%",
          zoom: 1.35,
          alt: "The Giza pyramids at sunset beyond the Cairo skyline",
          caption: "Twelve disciplines — one standard of work",
        }}
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
