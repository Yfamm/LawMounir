import type { Metadata } from "next";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { Introduction } from "@/components/sections/Introduction";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { PracticeAreasSection } from "@/components/sections/PracticeAreasSection";
import { resolveImage } from "@/lib/cms/images";
import {
  getInsightCategories,
  getInsights,
  getPeople,
  getPracticeAreas,
  getSection,
  getSite,
  getValues,
  pick,
} from "@/lib/cms/repository";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [site, hero, intro, practice, landscape, values, experience, peopleSection, insightsSection] = await Promise.all([
    getSite(),
    getSection("home.hero"),
    getSection("home.intro"),
    getSection("home.practice"),
    getSection("home.landscape"),
    getSection("home.values"),
    getSection("home.experience"),
    getSection("home.people"),
    getSection("home.insights"),
  ]);
  const [areas, valueItems, people, insights, categories] = await Promise.all([
    getPracticeAreas(),
    getValues(),
    getPeople(),
    getInsights(),
    getInsightCategories(),
  ]);

  return (
    <>
      <Hero content={hero} image={resolveImage(hero.image, "hero")} location={site.location} />
      <Introduction content={intro} image={resolveImage(intro.image, "hallAislePortrait")} />
      <PracticeAreasSection content={practice} areas={areas} />
      <LandscapeSection content={landscape} image={resolveImage(landscape.image, "hallAisle")} />
      <ApproachSection
        label={values.label}
        labelAr={values.labelAr}
        title={values.title}
        intro={values.intro}
        image={resolveImage(values.image, "colonnadeDetail")}
        values={valueItems}
      />
      <ExperienceSection
        content={experience}
        image={resolveImage(experience.image, "hallRows")}
        practiceTitles={areas.map((a) => a.title)}
      />
      <PeopleSection content={peopleSection} people={pick(people, peopleSection.selected, (p) => p.id)} />
      <InsightsSection
        content={insightsSection}
        insights={pick(insights, insightsSection.selected, (n) => n.slug)}
        categories={categories}
      />
      <ContactSection index="09" />
    </>
  );
}
