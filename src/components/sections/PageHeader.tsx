import type { ReactNode } from "react";
import heroImage from "@/assets/hero-justice-cairo.webp";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PageHeader.module.css";

type Props = {
  index?: string;
  label: string;
  title: ReactNode[];
  intro?: string;
  size?: "mega" | "xl" | "l";
  aside?: ReactNode;
  /** Frames a detail of the Cairo image beneath the heading. */
  image?: { position: string; zoom?: number; alt: string; caption?: string };
};

/** Opening block for inner pages: oversized title, then an image band. */
export function PageHeader({ index, label, title, intro, size = "mega", aside, image }: Props) {
  return (
    <section className={styles.header}>
      <div className="container">
        <SectionHeading
          as="h1"
          immediate
          index={index}
          label={label}
          title={title}
          intro={intro}
          size={size}
          aside={aside}
        />
      </div>
      {image && (
        <div className={`container ${styles.band}`}>
          <ImageReveal
            src={heroImage}
            alt={image.alt}
            sizes="(min-width: 1680px) 1600px, 100vw"
            position={image.position}
            zoom={image.zoom}
            ratio="21 / 9"
            tone="soft"
            parallax={10}
            caption={image.caption}
          />
        </div>
      )}
    </section>
  );
}
