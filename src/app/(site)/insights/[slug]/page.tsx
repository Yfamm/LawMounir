import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getInsight, getInsights, getSite } from "@/lib/cms/repository";
import { formatDate, type BodyBlock as InsightBlock } from "@/lib/cms/text";
import { ContactSection } from "@/components/sections/ContactSection";
import { Arabic } from "@/components/ui/Arabic";
import { Arrow } from "@/components/ui/Arrow";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getInsights()).map((insight) => ({ slug: insight.slug }));
}

// Articles published in the admin after the build are rendered on first request.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [insight, site] = await Promise.all([getInsight(slug), getSite()]);
  if (!insight) return {};
  return pageMetadata({
    siteName: site.siteName,
    title: insight.seoTitle,
    description: insight.seoDescription,
    path: `/insights/${insight.slug}`,
    type: "article",
    publishedTime: insight.date ?? undefined,
  });
}

function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "h":
      return <h2 className={`serif ${styles.h}`}>{block.text}</h2>;
    case "quote":
      return (
        <blockquote className={`serif ${styles.quote}`}>
          <p>{block.text}</p>
        </blockquote>
      );
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const [insights, site] = await Promise.all([getInsights(), getSite()]);
  const insight = insights.find((i) => i.slug === slug);
  if (!insight) notFound();

  const more = insights.filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <>
      <article className={styles.article}>
        <header className={`container ${styles.header}`}>
          <Reveal className={styles.meta} immediate delay={0.2}>
            <TransitionLink href="/insights" className={styles.back} data-reveal-item>
              <Arrow direction="right" className={styles.backArrow} /> All insights
            </TransitionLink>
            <span className={`label ${styles.category}`} data-reveal-item>
              {insight.category}
            </span>
            <span className={`${styles.date} tabular`} data-reveal-item>
              <time dateTime={insight.date ?? undefined}>{formatDate(insight.date)}</time>
              {insight.readingTime && ` · ${insight.readingTime}`}
              {insight.author && ` · ${insight.author}`}
            </span>
          </Reveal>

          <RevealText as="h1" immediate delay={0.3} className={`display ${styles.title}`} lines={[insight.title]} />

          <SplitReveal className={styles.standfirst} immediate delay={0.7}>
            {insight.standfirst}
          </SplitReveal>
          {(insight.titleAr || insight.standfirstAr) && (
            <div className={styles.arabic}>
              {insight.titleAr && <Arabic as="p">{insight.titleAr}</Arabic>}
              {insight.standfirstAr && <Arabic as="p">{insight.standfirstAr}</Arabic>}
            </div>
          )}
          <PlateFigure
            image={insight.cover}
            ratio="21 / 9"
            sizes="(min-width: 1680px) 1600px, 100vw"
            parallax={8}
            className={styles.plate}
          />
        </header>

        <div className={`container ${styles.layout}`}>
          <aside className={styles.aside}>
            <p className="label">In this note</p>
            <ul>
              {insight.body
                .filter((b): b is Extract<InsightBlock, { type: "h" }> => b.type === "h")
                .map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
            </ul>
          </aside>

          <div className={styles.body}>
            {insight.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p className={styles.disclaimer}>
              This note is general information about Egyptian law as it stood at the date of publication. It is not
              legal advice from {site.siteName} and should not be relied on for any specific matter.
              {!insight.reviewed && " [DRAFT — PENDING LEGAL REVIEW BY THE FIRM]"}
            </p>
          </div>
        </div>
      </article>

{more.length > 0 && (
      <section className={`section surface-paper ${styles.more}`} aria-labelledby="more-title">
        <div className="container">
          <h2 id="more-title" className={`label ${styles.moreTitle}`}>
            Further reading
          </h2>
          <Reveal className={styles.moreGrid} stagger={0.1}>
            {more.map((i) => (
              <EditorialCard key={i.slug} insight={i} issue={i.issue} />
            ))}
          </Reveal>
        </div>
      </section>
      )}

      <ContactSection />
    </>
  );
}
