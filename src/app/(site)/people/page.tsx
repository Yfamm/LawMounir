import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { getPeople, getSection, getSite } from "@/lib/cms/repository";
import { pad2 } from "@/lib/cms/text";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({
    title: "Our People",
    description: `The counsel and lawyers of ${site.siteName} — team profiles to follow.`,
    path: "/people",
    siteName: site.siteName,
  });
}

export default async function PeoplePage() {
  const [people, section] = await Promise.all([getPeople(), getSection("home.people")]);
  return (
    <>
      <PageHeader
        index="01"
        label={section.label}
        arabic={section.labelAr || undefined}
        title={["Our", <span key="p">People<sup className="count">({pad2(people.length)})</sup></span>]}
        intro={section.intro || undefined}
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
