import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getInsights, getSite, getSlugs, getUi } from "@/lib/cms/repository";
import type { BodyBlock as InsightBlock } from "@/lib/cms/text";
import { dirOf, isLang, type Lang } from "@/lib/i18n";
import { ContactSection } from "@/components/sections/ContactSection";
import { Arrow } from "@/components/ui/Arrow";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Same as the [lang] layout; repeated here because vinext (Cloudflare build)
// reads the ISR interval from the page, not from parent layouts.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getSlugs()).insights.map((slug) => ({ slug }));
}

// Articles published in the admin after the build are rendered on first request.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const [insights, site] = await Promise.all([getInsights(lang), getSite(lang)]);
  const insight = insights.find((i) => i.slug === slug);
  if (!insight) return {};
  return pageMetadata({
    lang,
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
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
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const [insights, site, ui] = await Promise.all([getInsights(lang), getSite(lang), getUi(lang)]);
  const insight = insights.find((i) => i.slug === slug);
  if (!insight) notFound();

  const more = insights.filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <>
      <article className={styles.article}>
        <header className={`container ${styles.header}`}>
          <Reveal className={styles.meta} immediate delay={0.2}>
            <TransitionLink href={`/${lang}/insights`} className={styles.back} data-reveal-item>
              <Arrow direction="right" className={styles.backArrow} /> {ui.allInsights}
            </TransitionLink>
            <span className={`label ${styles.category}`} data-reveal-item>
              {insight.category}
            </span>
            <span className={`${styles.date} tabular`} data-reveal-item>
              <time dateTime={insight.date ?? undefined}>{insight.dateLabel}</time>
              {insight.readingTime && ` · ${insight.readingTime}`}
              {insight.author && ` · ${insight.author}`}
            </span>
          </Reveal>

          <div lang={insight.titleLang} dir={dirOf(insight.titleLang)} className={styles.contents}>
            <RevealText as="h1" immediate delay={0.3} className={`display ${styles.title}`} lines={[insight.title]} />

            <SplitReveal className={styles.standfirst} immediate delay={0.7}>
              {insight.standfirst}
            </SplitReveal>
          </div>
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
            <p className="label">{ui.inThisNote}</p>
            <ul lang={insight.bodyLang}>
              {insight.body
                .filter((b): b is Extract<InsightBlock, { type: "h" }> => b.type === "h")
                .map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
            </ul>
          </aside>

          <div className={styles.body}>
            {insight.bodyFallback && <p className={styles.notice}>{ui.otherLanguageOnly}</p>}
            <div lang={insight.bodyLang} dir={dirOf(insight.bodyLang)} className={styles.contents}>
              {insight.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
            <p className={styles.disclaimer}>
              {ui.disclaimer.replace("{name}", site.brandName)}
              {!insight.reviewed && ` ${ui.draftNotice}`}
            </p>
          </div>
        </div>
      </article>

{more.length > 0 && (
      <section className={`section surface-paper ${styles.more}`} aria-labelledby="more-title">
        <div className="container">
          <h2 id="more-title" className={`label ${styles.moreTitle}`}>
            {ui.furtherReading}
          </h2>
          <Reveal className={styles.moreGrid} stagger={0.1}>
            {more.map((i) => (
              <EditorialCard key={i.slug} insight={i} issue={i.issue} labels={{ issue: ui.issue, read: ui.read }} />
            ))}
          </Reveal>
        </div>
      </section>
      )}

      <ContactSection lang={lang} />
    </>
  );
}
