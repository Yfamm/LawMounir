import { PlateFigure } from "@/components/ui/PlateFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ApproachSection.module.css";

// VERIFY: statements of how the firm works — confirm with the partners before launch.
export const principles = [
  {
    numeral: "I",
    title: "Precision",
    text: "We read the statute, its executive regulations, the ministerial decrees and the recent practice of the courts — because in Egypt the answer often sits in the layer beneath the law.",
  },
  {
    numeral: "II",
    title: "Strategy",
    text: "Every file starts with its end: where the matter will be decided, by whom and on what timeline. Advice is shaped around that forum, not around theory.",
  },
  {
    numeral: "III",
    title: "Clarity",
    text: "Clients receive a position, not a memo of possibilities. We say what we would do, what it will take and what could go wrong — plainly.",
  },
  {
    numeral: "IV",
    title: "Representation",
    text: "Before judges, tribunals, ministries and counterparties, we appear prepared and credible, with a record built from the first day of the matter.",
  },
];

export function ApproachSection({ index = "05" }: { index?: string }) {
  return (
    <section className={`section surface-paper ${styles.approach}`} aria-label="Our approach">
      <div className="container">
        <SectionHeading
          index={index}
          label="Our Approach"
          arabic="منهجنا"
          title={["Four principles,", <em key="e">applied to every file.</em>]}
          size="l"
          intro="Not a slogan and not a process chart — the working habits that decide how a matter is prepared, argued and closed."
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
