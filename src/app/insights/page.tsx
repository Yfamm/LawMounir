import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { insights } from "@/content/insights";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { InsightsIndex } from "@/components/ui/InsightsIndex";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Commentary on Egyptian legislation, regulation and the practice of the courts.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Insights"
        arabic="رؤى قانونية"
        title={[<span key="i">Insights<sup className="count">({String(insights.length).padStart(2, "0")})</sup></span>]}
        intro="Sample notes on Egyptian law, pending legal review by the firm. They are general information, not legal advice from DIWAN."
      />
      <section className={`section surface-paper ${styles.journal}`} aria-label="All insights">
        <div className="container">
          <InsightsIndex />
        </div>
      </section>
      <ContactSection index="02" />
    </>
  );
}
