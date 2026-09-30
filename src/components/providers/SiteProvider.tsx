"use client";

import { createContext, useContext } from "react";
import type { SiteContextValue } from "@/lib/cms/repository";

const SiteContext = createContext<SiteContextValue | null>(null);

/** Firm-wide details from the CMS (name, contact, navigation) for client components. */
export function SiteProvider({ value, children }: { value: SiteContextValue; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
