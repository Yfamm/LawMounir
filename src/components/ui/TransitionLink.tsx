"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/animation/TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** A next/link that plays the curtain transition before client navigation. */
export function TransitionLink({ href, onNavigate, ...rest }: Props) {
  const { navigate } = usePageTransition();

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        onNavigate?.(event);
        event.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
