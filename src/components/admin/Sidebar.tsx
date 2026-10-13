"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import styles from "./admin.module.css";

const groups = [
  { heading: "Overview", links: [{ href: "/admin", label: "Dashboard" }, { href: "/admin/enquiries", label: "Enquiries", badge: true }] },
  {
    heading: "Pages",
    links: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/pages", label: "Index pages & SEO" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { href: "/admin/practice-areas", label: "Practice Areas" },
      { href: "/admin/people", label: "People" },
      { href: "/admin/insights", label: "Insights" },
      { href: "/admin/values", label: "Values" },
    ],
  },
  {
    heading: "Site",
    links: [
      { href: "/admin/navigation", label: "Navigation & Footer" },
      { href: "/admin/interface", label: "Interface text" },
      { href: "/admin/settings", label: "Site Settings" },
      { href: "/admin/media", label: "Media" },
    ],
  },
];

export function Sidebar({ email, unread, siteName }: { email: string; unread: number; siteName: string }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand}>
        <span className={styles.brandName}>{siteName}</span>
        <span className={styles.brandRule} />
        <span className={styles.brandSub}>Content &amp; enquiries</span>
      </Link>

      <nav className={styles.nav} aria-label="Admin">
        {groups.map((group) => (
          <div key={group.heading} className={styles.navGroup}>
            <span className={styles.navHeading}>{group.heading}</span>
            {group.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink} aria-current={active(link.href) ? "page" : undefined}>
                {link.label}
                {"badge" in link && unread > 0 && (
                  <span className={styles.count} aria-label={`${unread} unread`}>
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sideFoot}>
        <span className={styles.who} title={email}>
          {email}
        </span>
        <span>
          <a href="/ar" target="_blank" rel="noopener">
            View site AR ↗
          </a>{" "}
          ·{" "}
          <a href="/en" target="_blank" rel="noopener">
            EN ↗
          </a>
        </span>
        <form action={signOut}>
          <button type="submit" className={styles.iconButton}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
