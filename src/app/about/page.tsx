import type { Metadata } from "next";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { LandscapeSection } from "@/components/sections/LandscapeSection";
import { PageHeader } from "@/components/sections/PageHeader";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { RevealText } from "@/components/ui/RevealText";
import { SplitReveal } from "@/components/ui/SplitReveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About the Firm",
  description:
    "An Egyptian law firm advising businesses, investors and families — technically rigorous, commercially usable and built around how matters are actually decided in Egypt.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="About the Firm"
        arabic="عن المكتب"
        title={["A law firm", <em key="e">for the Egyptian reality.</em>]}
        size="xl"
        // VERIFY: client types and scope — confirm against the firm's actual practice.
        intro="We advise Egyptian businesses, foreign investors, families and individuals on the matters they are most likely to meet in Egypt — and on how those matters are actually decided."
        plate={{ key: "hallRows", position: "88% 62%", zoom: 1.2 }}
      />

      <section className={`section ${styles.story}`}>
        <div className={`container ${styles.grid}`}>
          <RevealText
            as="h2"
            className={`display ${styles.statement}`}
            lines={["An Egyptian firm,", <em key="e">commercially fluent.</em>]}
          />
          <PlateFigure
            plate="colonnade"
            ratio="3 / 4"
            position="72% 40%"
            sizes="(min-width: 1024px) 36vw, 100vw"
            className={styles.figure}
          />
          {/* VERIFY: the three paragraphs below describe the firm's practice and method. */}
          <div className={styles.copy}>
            <SplitReveal className="lede">
              Our lawyers work across corporate and commercial law, disputes, regulation and personal status — the
              full range of matters a client operating in Egypt is likely to encounter.
            </SplitReveal>
            <SplitReveal className="lede">
              We are built on a simple observation: in Egypt, the text of the law is only the beginning. How a statute
              is applied depends on its executive regulations, ministerial decisions, administrative practice and the
              settled approach of the courts. Our advice is written with every one of those layers in view.
            </SplitReveal>
            <SplitReveal className="lede">
              That is what we mean by law within the Egyptian reality: advice that is technically rigorous and
              commercially usable, from lawyers who know how matters are decided here.
            </SplitReveal>
          </div>
        </div>
      </section>

      <LandscapeSection index="02" />
      <ApproachSection index="03" />
      <ContactSection index="04" />
    </>
  );
}
