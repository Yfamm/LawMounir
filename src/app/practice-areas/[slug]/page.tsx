import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPracticeArea, practiceAreas, practiceNumber } from "@/content/practiceAreas";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) return {};
  return { title: area.title, description: area.summary };
}

/** Splits "Banking & Finance" into two display lines at the ampersand. */
function titleLines(title: string) {
  const at = title.indexOf(" & ");
  return at === -1 ? [title] : [`${title.slice(0, at)} &`, title.slice(at + 3)];
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) notFound();

  const index = practiceAreas.indexOf(area);
  const next = practiceAreas[(index + 1) % practiceAreas.length];

  return (
    <>
      <PageHeader
        index={practiceNumber(area.slug)}
        label="Practice Area"
        title={titleLines(area.title)}
        size="xl"
        intro={area.summary}
        arabic="مجال الممارسة"
        plate={{ key: area.plate, position: area.focus, zoom: 1.15 }}
      />

      <section className={`section ${styles.overview}`} aria-labelledby="overview-title">
        <div className={`container ${styles.grid}`}>
          <h2 id="overview-title" className={`label ${styles.side}`}>
            Overview
          </h2>
          <SplitReveal className={`serif ${styles.overviewText}`}>{area.overview}</SplitReveal>
        </div>
      </section>

      <section className={`section surface-paper ${styles.scope}`} aria-labelledby="scope-title">
        <div className={`container ${styles.grid}`}>
          <h2 id="scope-title" className={`label ${styles.side}`}>
            What we handle
          </h2>
          <Reveal as="ol" className={styles.scopeList}>
            {area.scope.map((item, i) => (
              <li key={item} className={styles.scopeItem} data-reveal-item>
                <span className={styles.scopeRule} data-reveal-line />
                <span className="label tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="serif">{item}</span>
              </li>
            ))}
          </Reveal>
        </div>

        <div className={`container ${styles.grid} ${styles.forumsBlock}`}>
          <h2 className={`label ${styles.side}`}>Forums &amp; authorities</h2>
          <Reveal as="ul" className={styles.forums}>
            {area.forums.map((forum) => (
              <li key={forum}>{forum}</li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className={styles.next} aria-label="Next practice area">
        <TransitionLink href={`/practice-areas/${next.slug}`} className={`container ${styles.nextLink}`}>
          <span className="label">Next practice area — {practiceNumber(next.slug)}</span>
          <span className={`display ${styles.nextTitle}`}>
            {next.title} <Arrow className={styles.nextArrow} />
          </span>
        </TransitionLink>
      </section>

      <ContactSection />
    </>
  );
}
