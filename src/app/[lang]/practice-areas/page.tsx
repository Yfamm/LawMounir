import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getPracticeAreas, getSection, getSite, getUi, image } from "@/lib/cms/repository";
import { plain } from "@/lib/cms/text";
import { isLang, other, tr, trList } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { countedTitle } from "@/components/sections/PracticeAreasSection";
import { PracticeAreaList } from "@/components/ui/PracticeAreaList";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string }> };

// Same as the [lang] layout; repeated here because vinext (Cloudflare build)
// reads the ISR interval from the page, not from parent layouts.
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const [site, seo] = await Promise.all([getSite(lang), getSection("seo.pages")]);
  return pageMetadata({
    lang,
    title: tr(seo.practice.title, lang),
    description: tr(seo.practice.description, lang),
    path: "/practice-areas",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

export default async function PracticeAreasPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const o = other(lang);
  const [areas, page, experience, ui] = await Promise.all([
    getPracticeAreas(lang),
    getSection("practice.index"),
    getSection("home.experience"),
    getUi(lang),
  ]);
  const [band, experienceImage] = await Promise.all([image(page.image, "colonnade", lang), image(experience.image, "hallRows", lang)]);

  return (
    <>
      <PageHeader
        index="01"
        label={tr(page.label, lang)}
        other={plain(page.label[o]) || undefined}
        otherLang={o}
        title={countedTitle(tr(page.title, lang), areas.length)}
        intro={tr(page.intro, lang) || undefined}
        plate={{ image: band }}
      />

      <section className={`section ${styles.index}`} aria-label={ui.allPracticeAreas}>
        <div className="container">
          <PracticeAreaList areas={areas} label={ui.allPracticeAreas} />
        </div>
      </section>

      <ExperienceSection
        index="02"
        image={experienceImage}
        practiceTitles={areas.map((a) => a.title)}
        content={{
          label: tr(experience.label, lang),
          labelOther: plain(experience.label[o]),
          otherLang: o,
          title: tr(experience.title, lang),
          intro: tr(experience.intro, lang),
          hint: tr(experience.hint, lang),
          platePrefix: ui.plate,
          movements: experience.movements.map((m) => ({
            number: m.number,
            label: tr(m.label, lang),
            title: tr(m.title, lang),
            text: tr(m.text, lang),
            items: trList(m.items, lang),
            autoPracticeAreas: m.autoPracticeAreas,
          })),
        }}
      />
      <ContactSection lang={lang} index="03" />
    </>
  );
}

