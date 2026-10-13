import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { Introduction } from "@/components/sections/Introduction";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PeopleSection } from "@/components/sections/PeopleSection";
import { PracticeAreasSection } from "@/components/sections/PracticeAreasSection";
import { pageMetadata } from "@/content/seo";
import {
  getInsightCategories,
  getInsights,
  getPeople,
  getPracticeAreas,
  getSection,
  getSite,
  getUi,
  getValues,
  headingView,
  image,
  linkView,
  pick,
} from "@/lib/cms/repository";
import { pad2, plain } from "@/lib/cms/text";
import type { HomeSectionId } from "@/lib/cms/types";
import { isLang, other, tr, trList, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const [site, seo] = await Promise.all([getSite(lang), getSection("seo.pages")]);
  const meta = pageMetadata({
    lang,
    title: tr(seo.home.title, lang) || site.browserTitle,
    description: tr(seo.home.description, lang) || site.defaultSeoDescription,
    path: "/",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
  // The home page uses the full browser title, not "Title — Brand".
  return { ...meta, title: { absolute: tr(seo.home.title, lang) || site.browserTitle } };
}

export default async function HomePage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const o = other(lang);

  const [site, ui, layout, hero, intro, practice, landscape, values, experience, peopleSection, insightsSection] = await Promise.all([
    getSite(lang),
    getUi(lang),
    getSection("home.layout"),
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
    getPracticeAreas(lang),
    getValues(lang),
    getPeople(lang),
    getInsights(lang),
    getInsightCategories(lang),
  ]);
  const [heroImage, introImage, landscapeImage, valuesImage, experienceImage] = await Promise.all([
    image(hero.image, "hero", lang),
    image(intro.image, "hallAislePortrait", lang),
    image(landscape.image, "hallAisle", lang),
    image(values.image, "colonnadeDetail", lang),
    image(experience.image, "hallRows", lang),
  ]);

  // Section numbers follow the visible order: hero is 01, contact comes last.
  const visible = layout.order.filter((id) => !layout.hidden.includes(id));
  const index = (id: HomeSectionId) => pad2(visible.indexOf(id) + 2);

  const sections: Record<HomeSectionId, React.ReactNode> = {
    intro: (
      <Introduction
        key="intro"
        index={index("intro")}
        image={introImage}
        content={{
          label: tr(intro.label, lang),
          labelOther: plain(intro.label[o]),
          otherLang: o,
          statement: tr(intro.statement, lang),
          statementOther: plain(intro.statement[o]),
          body: tr(intro.body, lang),
          cta: linkView(intro.cta, lang),
        }}
      />
    ),
    practice: (
      <PracticeAreasSection
        key="practice"
        index={index("practice")}
        areas={areas}
        listLabel={ui.allPracticeAreas}
        content={{ ...headingView(practice, lang), note: tr(practice.note, lang) }}
      />
    ),
    landscape: (
      <LandscapeSection
        key="landscape"
        index={index("landscape")}
        image={landscapeImage}
        content={{
          label: tr(landscape.label, lang),
          labelOther: plain(landscape.label[o]),
          otherLang: o,
          frames: landscape.frames.map((f) => tr(f.text, lang)),
          pillars: landscape.pillars.map((p) => ({ title: tr(p.title, lang), text: tr(p.text, lang) })),
          platePrefix: ui.plate,
        }}
      />
    ),
    values: (
      <ApproachSection
        key="values"
        index={index("values")}
        label={tr(values.label, lang)}
        labelOther={plain(values.label[o])}
        otherLang={o}
        title={tr(values.title, lang)}
        intro={tr(values.intro, lang)}
        image={valuesImage}
        values={valueItems}
      />
    ),
    experience: (
      <ExperienceSection
        key="experience"
        index={index("experience")}
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
    ),
    people: (
      <PeopleSection
        key="people"
        index={index("people")}
        content={headingView(peopleSection, lang)}
        people={pick(people, peopleSection.selected, (p) => p.id)}
      />
    ),
    insights: (
      <InsightsSection
        key="insights"
        index={index("insights")}
        content={headingView(insightsSection, lang)}
        insights={pick(insights, insightsSection.selected, (n) => n.slug)}
        categories={categories}
        labels={{ issue: ui.issue, read: ui.read }}
      />
    ),
  };

  return (
    <>
      <Hero
        image={heroImage}
        location={site.location}
        content={{
          eyebrow: tr(hero.eyebrow, lang),
          headline: tr(hero.headline, lang),
          headlineOther: plain(hero.headline[o]),
          otherLang: o,
          supporting: tr(hero.supporting, lang),
          primary: linkView(hero.primary, lang),
          secondary: linkView(hero.secondary, lang),
          scrollCue: ui.scrollCue,
        }}
      />
      {visible.map((id) => sections[id])}
      <ContactSection lang={lang} index={pad2(visible.length + 2)} />
    </>
  );
}
