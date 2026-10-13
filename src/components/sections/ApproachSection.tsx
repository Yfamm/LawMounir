import type { ResolvedImage } from "@/lib/cms/images";
import type { ValueView } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import type { Lang } from "@/lib/i18n";
import { Counterpart } from "@/components/ui/Counterpart";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ApproachSection.module.css";

type Props = {
  index?: string;
  label: string;
  labelOther?: string;
  otherLang: Lang;
  title: string;
  intro?: string;
  /** Optional paragraph in the other language beside the intro (English pages only). */
  introOther?: string;
  image: ResolvedImage;
  values: ValueView[];
  as?: "h1" | "h2";
  immediate?: boolean;
};

/** The firm's core values, from the CMS (firm_values). */
export function ApproachSection({ index = "05", label, labelOther, otherLang, title, intro, introOther, image, values, as, immediate }: Props) {
  return (
    <section className={`section surface-paper ${styles.approach}`} aria-label={label}>
      <div className="container">
        <SectionHeading
          index={index}
          label={label}
          other={labelOther || undefined}
          otherLang={otherLang}
          title={headlineLines(title)}
          size="l"
          as={as}
          immediate={immediate}
          intro={intro || undefined}
          aside={
            introOther ? (
              <Counterpart as="p" lang={otherLang} className={styles.introAr}>
                {introOther}
              </Counterpart>
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
              <span className={`${styles.numeral} serif`} lang="en">{p.numeral}</span>
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
