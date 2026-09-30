import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { getInsightCategories, getInsights, getSection, getSite } from "@/lib/cms/repository";
import { pad2 } from "@/lib/cms/text";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { InsightsIndex } from "@/components/ui/InsightsIndex";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({
    title: "Insights",
    description: "Commentary on Egyptian legislation, regulation and the practice of the courts.",
    path: "/insights",
    siteName: site.siteName,
  });
}

export default async function InsightsPage() {
  const [insights, categories, section] = await Promise.all([
    getInsights(),
    getInsightCategories(),
    getSection("home.insights"),
  ]);
  return (
    <>
      <PageHeader
        index="01"
        label={section.label}
        arabic={section.labelAr || undefined}
        title={[<span key="i">Insights<sup className="count">({pad2(insights.length)})</sup></span>]}
        intro={section.intro || undefined}
      />
      <section className={`section surface-paper ${styles.journal}`} aria-label="All insights">
        <div className="container">
          <InsightsIndex insights={insights} categories={categories} />
        </div>
      </section>
      <ContactSection index="02" />
    </>
  );
}
