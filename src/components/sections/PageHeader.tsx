import type { ReactNode } from "react";
import type { ResolvedImage } from "@/lib/cms/images";
import type { Lang } from "@/lib/i18n";
import { PlateFigure } from "@/components/ui/PlateFigure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PageHeader.module.css";

type Props = {
  index?: string;
  label: string;
  other?: string;
  otherLang?: Lang;
  title: ReactNode[];
  intro?: string;
  size?: "mega" | "xl" | "l";
  aside?: ReactNode;
  /** Architectural plate set as a wide band beneath the heading. */
  plate?: { image: ResolvedImage; zoom?: number };
};

/** Opening block for inner pages: oversized title, then a captioned plate. */
export function PageHeader({ index, label, other, otherLang, title, intro, size = "mega", aside, plate }: Props) {
  return (
    <section className={styles.header}>
      <div className="container">
        <SectionHeading
          as="h1"
          immediate
          index={index}
          label={label}
          other={other}
          otherLang={otherLang}
          title={title}
          intro={intro}
          size={size}
          aside={aside}
        />
      </div>
      {plate && (
        <div className={`container ${styles.band}`}>
          <PlateFigure
            image={plate.image}
            sizes="(min-width: 1680px) 1600px, 100vw"
            zoom={plate.zoom}
            ratio="21 / 9"
            parallax={10}
          />
        </div>
      )}
    </section>
  );
}
