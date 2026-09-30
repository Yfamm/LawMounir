import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { resolveImage } from "@/lib/cms/images";
import { getPracticeAreas, getSection, getSite } from "@/lib/cms/repository";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { countedTitle } from "@/components/sections/PracticeAreasSection";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({
    title: "Practice Areas",
    description: `Companies and investment, civil and real-estate transactions, personal status, and representation before judicial and administrative bodies — ${site.siteName}, ${site.city}.`,
    path: "/practice-areas",
    siteName: site.siteName,
  });
}

export default async function PracticeAreasPage() {
  const [areas, practice, experience] = await Promise.all([
    getPracticeAreas(),
    getSection("home.practice"),
    getSection("home.experience"),
  ]);

  return (
    <>
      <PageHeader
        index="01"
        label={practice.label}
        arabic={practice.labelAr || undefined}
        title={countedTitle(practice.title, areas.length)}
        intro={practice.intro || undefined}
        plate={{ image: resolveImage({ plate: "colonnade", position: "50% 40%" }, "colonnade") }}
      />

      <section className={`section ${styles.index}`} aria-label="All practice areas">
        <div className="container">
          <PracticeAreaList areas={areas} />
        </div>
      </section>

      <ExperienceSection
        index="02"
        content={experience}
        image={resolveImage(experience.image, "hallRows")}
        practiceTitles={areas.map((a) => a.title)}
      />
      <ContactSection index="03" />
    </>
  );
}
