import type { SectionKey } from "./types";

/** Admin names and editor links for page sections (dashboard, media usage). */
export const sectionAdmin: Record<SectionKey, { label: string; href: string }> = {
  "home.layout": { label: "Homepage · Order & visibility", href: "/admin/homepage?section=layout" },
  "home.hero": { label: "Homepage · Hero", href: "/admin/homepage?section=hero" },
  "home.intro": { label: "Homepage · Introduction", href: "/admin/homepage?section=intro" },
  "home.practice": { label: "Homepage · Practice areas", href: "/admin/homepage?section=practice" },
  "home.landscape": { label: "Homepage · Legal landscape", href: "/admin/homepage?section=landscape" },
  "home.values": { label: "Homepage · Values", href: "/admin/homepage?section=values" },
  "home.experience": { label: "Homepage · Experience", href: "/admin/homepage?section=experience" },
  "home.people": { label: "Homepage · People preview", href: "/admin/homepage?section=people" },
  "home.insights": { label: "Homepage · Insights preview", href: "/admin/homepage?section=insights" },
  "home.contact": { label: "Contact section", href: "/admin/homepage?section=contact" },
  "about.blocks": { label: "About", href: "/admin/about" },
  "practice.index": { label: "Practice areas page", href: "/admin/pages?section=practice" },
  "people.index": { label: "People page", href: "/admin/pages?section=people" },
  "insights.index": { label: "Insights page", href: "/admin/pages?section=insights" },
  "contact.page": { label: "Contact page", href: "/admin/pages?section=contact" },
  "seo.pages": { label: "Search & sharing", href: "/admin/pages?section=seo" },
  "ui.strings": { label: "Interface text", href: "/admin/interface" },
};
