import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { Introduction } from "@/components/sections/Introduction";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { PracticeAreasSection } from "@/components/sections/PracticeAreasSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <PracticeAreasSection />
      <LandscapeSection />
      <ApproachSection />
      <ExperienceSection />
      <PeopleSection />
      <InsightsSection />
      <ContactSection index="09" />
    </>
  );
}
