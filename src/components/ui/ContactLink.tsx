import type { ReactNode } from "react";

type Props = { href: string | null; className?: string; children: ReactNode };

/** A contact detail that only becomes a link once a real value is configured. */
export function ContactLink({ href, className, children }: Props) {
  return href ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}
