import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/content/seo";
import { getSection, getSite, getValues, image } from "@/lib/cms/repository";
import { headlineLines, pad2, paragraphs, plain } from "@/lib/cms/text";
import type { AboutBlock } from "@/lib/cms/types";
import { isLang, other, tr, type Lang } from "@/lib/i18n";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Arabic } from "@/components/ui/Arabic";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitReveal } from "@/components/ui/SplitReveal";
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
    title: tr(seo.about.title, lang),
    description: tr(seo.about.description, lang),
    path: "/about",
    siteName: site.brandName,
    shareImage: site.shareImage,
    defaultLanguage: site.defaultLanguage,
  });
}

const FALLBACK = { header: "hallRows", story: "colonnade", values: "colonnadeDetail", statement: "hallAisle" } as const;

/**
 * Sections are edited in Admin → About (add, remove, hide, reorder). The
 * default structure follows the firm's introduction document: رؤيتنا ·
 * من نحن؟ · قيمنا الأساسية · رسالتنا. On English pages the firm's Arabic
 * original is set beside the translation.
 */
export default async function AboutPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const o = other(lang);
  const [{ blocks }, valueItems] = await Promise.all([getSection("about.blocks"), getValues(lang)]);
  const visible = blocks.filter((b) => b.enabled);
  const images = await Promise.all(visible.map((b) => image(b.image, FALLBACK[b.layout], lang)));

  /** The Arabic original beside the English text (English pages only). */
  const aside = (b: AboutBlock) =>
    lang === "en" && b.body.ar ? (
      <Arabic as="p" className={styles.arabicText}>
        {b.body.ar}
      </Arabic>
    ) : undefined;

  const render = (b: AboutBlock, i: number) => {
    const index = pad2(i + 1);
    const label = tr(b.label, lang);
    const labelOther = plain(b.label[o]) || undefined;
    const title = headlineLines(tr(b.title, lang));
    const body = paragraphs(tr(b.body, lang));
    const img = images[i];
    const first = i === 0;

    if (b.layout === "values") {
      return (
        <ApproachSection
          key={b.id}
          index={index}
          label={label}
          labelOther={labelOther}
          otherLang={o}
          title={tr(b.title, lang)}
          intro={body.join(" ")}
          image={img}
          values={valueItems}
          as={first ? "h1" : "h2"}
          immediate={first}
        />
      );
    }

    if (first) {
      return (
        <PageHeader
          key={b.id}
          index={index}
          label={label}
          other={labelOther}
          otherLang={o}
          title={title}
          size="xl"
          intro={body.join(" ") || undefined}
          aside={aside(b)}
          plate={{ image: img, zoom: 1.2 }}
        />
      );
    }

    if (b.layout === "story") {
      return (
        <section key={b.id} className={`section ${styles.story}`}>
          <div className={`container ${styles.grid}`}>
            <SectionHeading
              index={index}
              label={label}
              other={labelOther}
              otherLang={o}
              title={title}
              size="l"
              className={styles.heading}
            />
            <PlateFigure image={img} ratio="3 / 4" sizes="(min-width: 1024px) 36vw, 100vw" className={styles.figure} />
            <div className={styles.copy}>
              {body.map((paragraph, j) => (
                <SplitReveal key={j} className="lede">
                  {paragraph}
                </SplitReveal>
              ))}
              {aside(b)}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section key={b.id} className={`section ${styles.mission}`}>
        <div className="container">
          <SectionHeading
            index={index}
            label={label}
            other={labelOther}
            otherLang={o}
            title={title}
            size="l"
            intro={body.join(" ") || undefined}
            aside={aside(b)}
          />
          <div className={styles.band}>
            <PlateFigure image={img} ratio="21 / 9" sizes="(min-width: 1680px) 1600px, 100vw" parallax={10} />
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {visible.map(render)}
      <ContactSection lang={lang} index={pad2(visible.length + 1)} />
    </>
  );
}
