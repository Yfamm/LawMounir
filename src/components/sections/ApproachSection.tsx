import { values } from "@/content/firm";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ApproachSection.module.css";

// Source: the four core values in the firm's introduction document (see firm.ts).
export const principles = values.items.map((v) => ({ numeral: v.numeral, title: v.titleEn, text: v.textEn }));

export function ApproachSection({ index = "05" }: { index?: string }) {
  return (
    <section className={`section surface-paper ${styles.approach}`} aria-label="Our values">
      <div className="container">
        <SectionHeading
          index={index}
          label={values.labelEn}
          arabic={values.labelAr}
          title={["Why clients", <em key="e">choose us.</em>]}
          size="l"
          intro="Four core values the firm sets out as the basis of its work."
        />

        <div className={styles.layout}>
          <PlateFigure
            plate="colonnadeDetail"
            ratio="4 / 5"
            sizes="(min-width: 1024px) 38vw, 100vw"
            parallax={8}
            className={styles.figure}
          />
          <Reveal as="ol" className={styles.grid} stagger={0.12}>
          {principles.map((p) => (
            <li key={p.title} className={styles.item} data-reveal-item>
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
