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
        arabic="مجالات الممارسة"
        title={["Practice", <span key="a">Areas<sup className="count">({String(practiceAreas.length).padStart(2, "0")})</sup></span>]}
        // VERIFY: count and framing must match the practice areas the firm offers.
        intro="Twelve areas of Egyptian law, each organized around the forum where matters are decided and the authorities that shape them."
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
