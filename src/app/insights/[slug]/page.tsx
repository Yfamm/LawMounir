import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, getInsight, insights, type InsightBlock } from "@/content/insights";
import { ContactSection } from "@/components/sections/ContactSection";
import { Arrow } from "@/components/ui/Arrow";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  return {
    title: insight.title,
    description: insight.standfirst,
    openGraph: { type: "article", publishedTime: insight.date, title: insight.title, description: insight.standfirst },
  };
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
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsight(slug);
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
              <time dateTime={insight.date}>{formatDate(insight.date)}</time> · {insight.readingTime}
            </span>
          </Reveal>

          <RevealText as="h1" immediate delay={0.3} className={`display ${styles.title}`} lines={[insight.title]} />

          <SplitReveal className={styles.standfirst} immediate delay={0.7}>
            {insight.standfirst}
          </SplitReveal>
        </header>

        <div className={`container ${styles.layout}`}>
          <aside className={styles.aside}>
            <p className="label">In this note</p>
            <ul>
              {insight.body
                .filter((b): b is Extract<InsightBlock, { type: "h" }> => b.type === "h")
                .map((b) => (
                  <li key={b.text}>{b.text}</li>
                ))}
            </ul>
          </aside>

          <div className={styles.body}>
            {insight.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p className={styles.disclaimer}>
              This note is general information about Egyptian law as it stood at the date of publication. It is not
              legal advice and should not be relied on for any specific matter.
            </p>
          </div>
        </div>
      </article>

      <section className={`section surface-paper ${styles.more}`} aria-labelledby="more-title">
        <div className="container">
          <h2 id="more-title" className={`label ${styles.moreTitle}`}>
            Further reading
          </h2>
          <Reveal className={styles.moreGrid} stagger={0.1}>
            {more.map((i) => (
              <EditorialCard key={i.slug} insight={i} issue={String(insights.indexOf(i) + 1).padStart(2, "0")} />
            ))}
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
