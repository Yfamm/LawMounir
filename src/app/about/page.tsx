import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { mission, vision, whoWeAre } from "@/content/firm";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Arabic } from "@/components/ui/Arabic";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitReveal } from "@/components/ui/SplitReveal";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About the Firm",
  description:
    "DIWAN — ديوان للمحاماه والأستشارات القانونية — law and legal consultancy in Kafr el Sheikh: our vision, who we are, our values and our mission.",
  path: "/about",
});

/**
 * Structure and wording follow the firm's introduction document
 * (docs/sources/introduction-ar.md): رؤيتنا · من نحن؟ · قيمنا الأساسية · رسالتنا.
 * Adaptations are recorded in src/content/firm.ts.
 */
export default function AboutPage() {
  return (
    <>
      {/* 01 — Introduction / رؤيتنا */}
      <PageHeader
        index="01"
        label={vision.labelEn}
        arabic={vision.labelAr}
        title={["More than", <em key="e">rigid text.</em>]}
        size="xl"
        intro={vision.en}
        aside={
          <Arabic as="p" className={styles.arabicText}>
            {vision.ar}
          </Arabic>
        }
        plate={{ key: "hallRows", position: "88% 62%", zoom: 1.2 }}
      />

      {/* 02 — Who we are / من نحن؟ */}
      <section className={`section ${styles.story}`}>
        <div className={`container ${styles.grid}`}>
          <SectionHeading
            index="02"
            label={whoWeAre.labelEn}
            arabic={whoWeAre.labelAr}
            title={["An Egyptian firm", <em key="e">of counsel and lawyers.</em>]}
            size="l"
            className={styles.heading}
          />
          <PlateFigure
            plate="colonnade"
            ratio="3 / 4"
            position="72% 40%"
            sizes="(min-width: 1024px) 36vw, 100vw"
            className={styles.figure}
          />
          <div className={styles.copy}>
            {whoWeAre.en.map((paragraph, i) => (
              <SplitReveal key={i} className="lede">
                {paragraph}
              </SplitReveal>
            ))}
            <Arabic as="p" className={styles.arabicText}>
              {whoWeAre.ar}
            </Arabic>
          </div>
        </div>
      </section>

      {/* 03 — Values / قيمنا الأساسية */}
      <ApproachSection index="03" />

      {/* 04 — Mission / رسالتنا */}
      <section className={`section ${styles.mission}`}>
        <div className="container">
          <SectionHeading
            index="04"
            label={mission.labelEn}
            arabic={mission.labelAr}
            title={["A trusted", <em key="e">legal partner.</em>]}
            size="l"
            intro={mission.en}
            aside={
              <Arabic as="p" className={styles.arabicText}>
                {mission.ar}
              </Arabic>
            }
          />
          <div className={styles.band}>
            <PlateFigure plate="hallAisle" ratio="21 / 9" sizes="(min-width: 1680px) 1600px, 100vw" parallax={10} />
          </div>
        </div>
      </section>

      <ContactSection index="05" />
    </>
  );
}
