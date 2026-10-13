import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getPracticeAreas, getSite, getSlugs, getUi } from "@/lib/cms/repository";
import { isLang, other, type Lang } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  return (await getSlugs()).practice.map((slug) => ({ slug }));
}

// Areas created in the admin after the build are rendered on first request.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const [areas, site] = await Promise.all([getPracticeAreas(lang), getSite(lang)]);
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};
  return pageMetadata({
    lang,
    title: area.seoTitle,
    description: area.seoDescription,
    path: `/practice-areas/${area.slug}`,
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

/** Splits "Banking & Finance" into two display lines at the ampersand. */
function titleLines(title: string) {
  const at = title.indexOf(" & ");
  return at === -1 ? [title] : [`${title.slice(0, at)} &`, title.slice(at + 3)];
}

export default async function PracticeAreaPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const [areas, ui, uiOther] = await Promise.all([getPracticeAreas(lang), getUi(lang), getUi(other(lang))]);
  const index = areas.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();
  const area = areas[index];
  const next = areas[(index + 1) % areas.length];

  return (
    <>
      <PageHeader
        index={area.number}
        label={ui.practiceArea}
        title={titleLines(area.title)}
        size="xl"
        intro={area.summary}
        other={uiOther.practiceArea}
        otherLang={other(lang)}
        plate={{ image: area.image, zoom: 1.15 }}
      />

      {area.overview && (
        <section className={`section ${styles.overview}`} aria-labelledby="overview-title">
          <div className={`container ${styles.grid}`}>
            <h2 id="overview-title" className={`label ${styles.side}`}>
              {ui.overview}
            </h2>
            <SplitReveal className={`serif ${styles.overviewText}`}>{area.overview}</SplitReveal>
          </div>
        </section>
      )}

      {(area.scope.length > 0 || area.forums.length > 0) && (
        <section className={`section surface-paper ${styles.scope}`} aria-labelledby="scope-title">
          {area.scope.length > 0 && (
            <div className={`container ${styles.grid}`}>
              <h2 id="scope-title" className={`label ${styles.side}`}>
                {ui.whatWeHandle}
              </h2>
              <Reveal as="ol" className={styles.scopeList}>
                {area.scope.map((item, i) => (
                  <li key={i} className={styles.scopeItem} data-reveal-item>
                    <span className={styles.scopeRule} data-reveal-line />
                    <span className="label tabular">{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif">{item}</span>
                  </li>
                ))}
              </Reveal>
            </div>
          )}

          {area.forums.length > 0 && (
            <div className={`container ${styles.grid} ${styles.forumsBlock}`}>
              <h2 className={`label ${styles.side}`}>{ui.forums}</h2>
              <Reveal as="ul" className={styles.forums}>
                {area.forums.map((forum, i) => (
                  <li key={i}>{forum}</li>
                ))}
              </Reveal>
            </div>
          )}
        </section>
      )}

      {areas.length > 1 && (
        <section className={styles.next} aria-label={ui.nextPractice}>
          <TransitionLink href={next.href} className={`container ${styles.nextLink}`}>
            <span className="label">
              {ui.nextPractice} — {next.number}
            </span>
            <span className={`display ${styles.nextTitle}`}>
              {next.title} <Arrow className={styles.nextArrow} />
            </span>
          </TransitionLink>
        </section>
      )}

      <ContactSection lang={lang} />
    </>
  );
}
