import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getPeople, getSection, getSite, getUi } from "@/lib/cms/repository";
import { pad2, plain } from "@/lib/cms/text";
import { headlineLines } from "@/lib/cms/text";
import { isLang, other, tr } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamGrid } from "@/components/ui/TeamGrid";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const [site, seo] = await Promise.all([getSite(lang), getSection("seo.pages")]);
  return pageMetadata({
    lang,
    title: tr(seo.people.title, lang),
    description: tr(seo.people.description, lang),
    path: "/people",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

/** Title lines with the count set after the last line. */
function counted(title: string, count: number) {
  const lines = headlineLines(title);
  const last = lines.pop();
  return [
    ...lines,
    <span key="count">
      {last}
      <sup className="count">({pad2(count)})</sup>
    </span>,
  ];
}

export default async function PeoplePage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const [people, section, ui] = await Promise.all([getPeople(lang), getSection("people.index"), getUi(lang)]);
  return (
    <>
      <PageHeader
        index="01"
        label={tr(section.label, lang)}
        other={plain(section.label[other(lang)]) || undefined}
        otherLang={other(lang)}
        title={counted(tr(section.title, lang), people.length)}
        intro={tr(section.intro, lang) || undefined}
      />

      <section className={`section ${styles.team}`} aria-label={ui.team}>
        <div className="container">
          {people.length ? <TeamGrid people={people} showBio /> : <p className="lede">{ui.noPeople}</p>}
        </div>
      </section>

      <ContactSection lang={lang} index="02" />
    </>
  );
}
