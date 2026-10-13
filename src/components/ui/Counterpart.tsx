import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { Arabic } from "./Arabic";

type Props = { lang: Lang; children: ReactNode; className?: string; as?: "span" | "p" };

/**
 * The bilingual flourish: a short line in the *other* language set beside
 * the main text — Arabic in Amiri on English pages, English in Cormorant
 * italic on Arabic pages. Renders nothing when empty.
 */
export function Counterpart({ lang, children, className, as: Tag = "span" }: Props) {
  if (!children) return null;
  if (lang === "ar") {
    return (
      <Arabic as={Tag} className={className}>
        {children}
      </Arabic>
    );
  }
  return (
    <Tag lang="en" dir="ltr" className={`latin-counterpart ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
