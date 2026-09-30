import type { ResolvedImage } from "@/lib/cms/images";
import type { ValueView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { Arabic } from "@/components/ui/Arabic";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ApproachSection.module.css";

type Props = {
  index?: string;
  label: string;
  labelAr?: string;
  title: string;
  intro?: string;
  introAr?: string;
  image: ResolvedImage;
  values: ValueView[];
};

/** The firm's core values, from the CMS (firm_values). */
export function ApproachSection({ index = "05", label, labelAr, title, intro, introAr, image, values }: Props) {
  return (
    <section className={`section surface-paper ${styles.approach}`} aria-label={label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={label}
          arabic={labelAr || undefined}
          title={headlineLines(title)}
          size="l"
          intro={intro || undefined}
          aside={
            introAr ? (
              <Arabic as="p" className={styles.introAr}>
                {introAr}
              </Arabic>
            ) : undefined
          }
        />

        <div className={styles.layout}>
          <PlateFigure
            image={image}
            ratio="4 / 5"
            sizes="(min-width: 1024px) 38vw, 100vw"
            parallax={8}
            className={styles.figure}
          />
          <Reveal as="ol" className={styles.grid} stagger={0.12}>
          {values.map((p, i) => (
            <li key={i} className={styles.item} data-reveal-item>
              <span className={styles.line} data-reveal-line />
              <span className={`${styles.numeral} serif`}>{p.numeral}</span>
              <h3 className={`serif ${styles.title}`}>{p.title}</h3>
              <p className={styles.text}>{p.text}</p>
            </li>
          ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
