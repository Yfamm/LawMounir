import type { LinkView } from "@/lib/cms/repository";
import type { Lang } from "@/lib/i18n";

/** Heading data shared by the editorial sections (one language, plus the counterpart label). */
export type HeadingContent = {
  label: string;
  /** The label in the other language (decorative counterpart). */
  labelOther: string;
  otherLang: Lang;
  title: string;
  intro: string;
  cta?: LinkView;
};
