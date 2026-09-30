import Image from "next/image";
import { plates } from "@/content/plates";
import { getSection, getSite } from "@/lib/cms/repository";
import { headlineLines } from "@/lib/cms/text";
import { Arabic } from "@/components/ui/Arabic";
import { GeometricPattern } from "@/components/ui/GeometricPattern";
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
export async function ContactSection({ index, as = "h2", immediate = false }: Props) {
  const [site, content] = await Promise.all([getSite(), getSection("home.contact")]);

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
            {content.label}
          </span>
          {content.labelAr && (
            <span className={styles.arabic} data-reveal-item>
              <Arabic>{content.labelAr}</Arabic>
            </span>
          )}
        </Reveal>

        <RevealText
          as={as}
          id="contact-title"
          className={`display ${styles.title}`}
          lines={headlineLines(content.title)}
          immediate={immediate}
          delay={immediate ? 0.3 : 0}
        />

        {content.description && (
          <Reveal immediate={immediate} delay={immediate ? 0.5 : 0}>
            <p className={`lede ${styles.description}`} data-reveal-item>
              {content.description}
            </p>
          </Reveal>
        )}

        <div className={styles.grid}>
          <Reveal as="dl" className={styles.details} immediate={immediate} delay={immediate ? 0.6 : 0}>
            <div data-reveal-item>
              <dt className="label">Phone</dt>
              <dd>
                <ContactLink href={site.phoneHref}>{site.phone}</ContactLink>
              </dd>
            </div>
            {site.whatsappHref && (
              <div data-reveal-item>
                <dt className="label">WhatsApp</dt>
                <dd>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
                    {site.whatsapp}
                  </a>
                </dd>
              </div>
            )}
            <div data-reveal-item>
              <dt className="label">Email</dt>
              <dd>
                <ContactLink href={site.emailHref}>{site.email}</ContactLink>
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Office</dt>
              <dd>
                {site.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
            <div data-reveal-item>
              <dt className="label">Hours</dt>
              <dd>{site.hours}</dd>
            </div>
          </Reveal>

          <Reveal className={styles.form} immediate={immediate} delay={immediate ? 0.8 : 0.1}>
            <ContactForm
              submitText={content.submitText}
              notice={content.notice}
              successTitle={content.successTitle}
              successText={content.successText}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
