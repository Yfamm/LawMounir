import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; as?: "span" | "p" };

/** Arabic text, set right-to-left in Amiri. */
export function Arabic({ children, className, as: Tag = "span" }: Props) {
  return (
    <Tag lang="ar" dir="rtl" className={`arabic ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
