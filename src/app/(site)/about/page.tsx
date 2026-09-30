import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { resolveImage } from "@/lib/cms/images";
import { getAbout, getSite, getValues } from "@/lib/cms/repository";
import { headlineLines, pad2, paragraphs } from "@/lib/cms/text";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Arabic } from "@/components/ui/Arabic";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitReveal } from "@/components/ui/SplitReveal";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({
    title: "About the Firm",
    description: `${site.siteName} — ${site.siteNameAr} — law and legal consultancy in ${site.city}: our vision, who we are, our values and our mission.`,
    path: "/about",
    siteName: site.siteName,
  });
}

/**
 * Structure follows the firm's introduction document
 * (docs/sources/introduction-ar.md): رؤيتنا · من نحن؟ · قيمنا الأساسية · رسالتنا.
 * Content is edited in the admin (About); sections can be switched off.
 */
export default async function AboutPage() {
  const [{ vision, who, values, mission }, valueItems] = await Promise.all([getAbout(), getValues()]);

  // Section numbers follow the sections that are switched on.
  let n = 0;
  const next = () => pad2(++n);

  return (
    <>
      {/* Introduction / رؤيتنا */}
      {vision.enabled && (
        <PageHeader
          index={next()}
          label={vision.label}
          arabic={vision.titleAr || undefined}
          title={headlineLines(vision.title)}
          size="xl"
          intro={paragraphs(vision.bodyEn).join(" ") || undefined}
          aside={
            vision.bodyAr ? (
              <Arabic as="p" className={styles.arabicText}>
                {vision.bodyAr}
              </Arabic>
            ) : undefined
          }
          plate={{ image: resolveImage(vision.image, "hallRows"), zoom: 1.2 }}
        />
      )}

      {/* Who we are / من نحن؟ */}
      {who.enabled && (
        <section className={`section ${styles.story}`}>
          <div className={`container ${styles.grid}`}>
            <SectionHeading
              index={next()}
              label={who.label}
              arabic={who.titleAr || undefined}
              title={headlineLines(who.title)}
              size="l"
              className={styles.heading}
            />
            <PlateFigure
              image={resolveImage(who.image, "colonnade")}
              ratio="3 / 4"
              sizes="(min-width: 1024px) 36vw, 100vw"
              className={styles.figure}
            />
            <div className={styles.copy}>
              {paragraphs(who.bodyEn).map((paragraph, i) => (
                <SplitReveal key={i} className="lede">
                  {paragraph}
                </SplitReveal>
              ))}
              {who.bodyAr && (
                <Arabic as="p" className={styles.arabicText}>
                  {who.bodyAr}
                </Arabic>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values / قيمنا الأساسية */}
      {values.enabled && (
        <ApproachSection
          index={next()}
          label={values.label}
          labelAr={values.titleAr}
          title={values.title}
          intro={paragraphs(values.bodyEn).join(" ")}
          introAr={values.bodyAr}
          image={resolveImage(values.image, "colonnadeDetail")}
          values={valueItems}
        />
      )}

      {/* Mission / رسالتنا */}
      {mission.enabled && (
        <section className={`section ${styles.mission}`}>
          <div className="container">
            <SectionHeading
              index={next()}
              label={mission.label}
              arabic={mission.titleAr || undefined}
              title={headlineLines(mission.title)}
              size="l"
              intro={paragraphs(mission.bodyEn).join(" ") || undefined}
              aside={
                mission.bodyAr ? (
                  <Arabic as="p" className={styles.arabicText}>
                    {mission.bodyAr}
                  </Arabic>
                ) : undefined
              }
            />
            <div className={styles.band}>
              <PlateFigure
                image={resolveImage(mission.image, "hallAisle")}
                ratio="21 / 9"
                sizes="(min-width: 1680px) 1600px, 100vw"
                parallax={10}
              />
            </div>
          </div>
        </section>
      )}

      <ContactSection index={next()} />
    </>
  );
}
