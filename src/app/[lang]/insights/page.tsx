import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getInsightCategories, getInsights, getSection, getSite } from "@/lib/cms/repository";
import { headlineLines, pad2, plain } from "@/lib/cms/text";
import { isLang, other, tr } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { InsightsIndex } from "@/components/ui/InsightsIndex";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const [site, seo] = await Promise.all([getSite(lang), getSection("seo.pages")]);
  return pageMetadata({
    lang,
    title: tr(seo.insights.title, lang),
    description: tr(seo.insights.description, lang),
    path: "/insights",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

export default async function InsightsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const [insights, categories, section] = await Promise.all([getInsights(lang), getInsightCategories(lang), getSection("insights.index")]);
  const lines = headlineLines(tr(section.title, lang));
  const last = lines.pop();
  return (
    <>
      <PageHeader
        index="01"
        label={tr(section.label, lang)}
        other={plain(section.label[other(lang)]) || undefined}
        otherLang={other(lang)}
        title={[
          ...lines,
          <span key="i">
            {last}
            <sup className="count">({pad2(insights.length)})</sup>
          </span>,
        ]}
        intro={tr(section.intro, lang) || undefined}
      />
      <section className={`section surface-paper ${styles.journal}`} aria-label={tr(section.label, lang)}>
        <div className="container">
          <InsightsIndex insights={insights} categories={categories} />
        </div>
      </section>
      <ContactSection lang={lang} index="02" />
    </>
  );
}
