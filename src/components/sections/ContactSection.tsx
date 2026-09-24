import Image from "next/image";
import heroImage from "@/assets/hero-justice-cairo.webp";
import { site } from "@/content/site";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import styles from "./ContactSection.module.css";

type Props = {
  index?: string;
  as?: "h1" | "h2";
  immediate?: boolean;
};

/** The closing statement and enquiry form — the darkest room in the house. */
export function ContactSection({ index, as = "h2", immediate = false }: Props) {
  return (
    <section className={styles.contact} aria-labelledby="contact-title" id="contact">
      <div className={styles.media} aria-hidden="true">
        <Image src={heroImage} alt="" fill sizes="50vw" placeholder="blur" className={styles.image} />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.meta} immediate={immediate}>
          {index && (
            <span className="label tabular" data-reveal-item>
              {index}
            </span>
          )}
          <span className={styles.rule} data-reveal-line />
          <span className="label" data-reveal-item>
            Contact
          </span>
        </Reveal>

        <RevealText
          as={as}
          id="contact-title"
          className={`display ${styles.title}`}
          lines={["Let’s talk about", <em key="e">what comes next.</em>]}
          immediate={immediate}
          delay={immediate ? 0.3 : 0}
        />

        <div className={styles.grid}>
          <Reveal as="dl" className={styles.details} immediate={immediate} delay={immediate ? 0.6 : 0}>
            <div data-reveal-item>
              <dt className="label">Phone</dt>
              <dd>
                <a href={site.contact.phoneHref}>{site.contact.phone}</a>
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Email</dt>
              <dd>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Office</dt>
              <dd>
                {site.contact.office.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Hours</dt>
              <dd>{site.contact.hours}</dd>
            </div>
          </Reveal>

          <Reveal className={styles.form} immediate={immediate} delay={immediate ? 0.8 : 0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
