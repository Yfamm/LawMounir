import Image from "next/image";
import { plates } from "@/content/plates";
import { Arabic } from "@/components/ui/Arabic";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
import { site } from "@/content/site";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactLink } from "@/components/ui/ContactLink";
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
        <Image src={plates.mashrabiya.image} alt="" fill sizes="60vw" placeholder="blur" className={styles.image} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <GeometricPattern className={styles.pattern} opacity={0.08} size={96} />

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
          <span className={styles.arabic} data-reveal-item>
            <Arabic>تواصل معنا</Arabic>
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
                <ContactLink href={site.contact.phoneHref}>{site.contact.phone}</ContactLink>
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Email</dt>
              <dd>
                <ContactLink href={site.contact.emailHref}>{site.contact.email}</ContactLink>
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
