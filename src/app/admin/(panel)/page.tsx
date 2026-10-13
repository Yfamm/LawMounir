import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { adminList, adminSections, adminSettings } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { collectionFields, completeness, footerFields, sectionFields, settingsFields, type CollectionKey } from "@/lib/cms/fields";
import type { SectionKey } from "@/lib/cms/types";
import { sessionClient } from "@/lib/supabase/server";
import { EnquiryStatus, formatDateTime } from "@/components/admin/EnquiryBits";

export const metadata: Metadata = { title: "Dashboard" };

type Filter = ["is" | "eq" | "neq", string, string | boolean | null];

async function count(table: string, filter?: Filter) {
  const db = await sessionClient();
  const q = db.from(table).select("id", { count: "exact", head: true });
  const { count: n } = await (filter ? q.filter(filter[1], filter[0], filter[2]) : q);
  return n ?? 0;
}

const SECTION_LINKS: { key: SectionKey; label: string; href: string }[] = [
  { key: "home.hero", label: "Homepage · Hero", href: "/admin/homepage?section=hero" },
  { key: "home.intro", label: "Homepage · Introduction", href: "/admin/homepage?section=intro" },
  { key: "home.practice", label: "Homepage · Practice areas", href: "/admin/homepage?section=practice" },
  { key: "home.landscape", label: "Homepage · Legal landscape", href: "/admin/homepage?section=landscape" },
  { key: "home.values", label: "Homepage · Values", href: "/admin/homepage?section=values" },
  { key: "home.experience", label: "Homepage · Experience", href: "/admin/homepage?section=experience" },
  { key: "home.people", label: "Homepage · People preview", href: "/admin/homepage?section=people" },
  { key: "home.insights", label: "Homepage · Insights preview", href: "/admin/homepage?section=insights" },
  { key: "home.contact", label: "Contact section", href: "/admin/homepage?section=contact" },
  { key: "about.blocks", label: "About", href: "/admin/about" },
  { key: "practice.index", label: "Practice areas page", href: "/admin/pages?section=practice" },
  { key: "people.index", label: "People page", href: "/admin/pages?section=people" },
  { key: "insights.index", label: "Insights page", href: "/admin/pages?section=insights" },
  { key: "contact.page", label: "Contact page", href: "/admin/pages?section=contact" },
  { key: "seo.pages", label: "Search & sharing", href: "/admin/pages?section=seo" },
  { key: "ui.strings", label: "Interface text", href: "/admin/interface" },
];

const COLLECTION_LINKS: { key: CollectionKey; label: string; href: string }[] = [
  { key: "practice", label: "Practice areas", href: "/admin/practice-areas" },
  { key: "people", label: "People", href: "/admin/people" },
  { key: "insights", label: "Insights", href: "/admin/insights" },
  { key: "values", label: "Values", href: "/admin/values" },
  { key: "navigation", label: "Navigation links", href: "/admin/navigation" },
];

function StatusBadge({ complete, missing, review, label }: { complete: boolean; missing: number; review?: boolean; label: string }) {
  return (
    <span className={`${styles.badge} ${complete ? styles.badgeOutline : missing ? styles.badgeDanger : styles.badgeMuted}`}>
      {label} {complete ? "✓ complete" : missing ? `${missing} missing` : review ? "needs review" : "—"}
    </span>
  );
}

async function translationRows() {
  const sections = await adminSections(SECTION_LINKS.map((s) => s.key));
  const settings = await adminSettings();
  const rows: { label: string; href: string; ar: ReturnType<typeof completeness>["ar"]; en: ReturnType<typeof completeness>["en"] }[] = [];
  const settingsState = completeness([...settingsFields, ...footerFields], settings as unknown as Record<string, unknown>, settings._translation);
  rows.push({ label: "Site settings & footer", href: "/admin/settings", ...settingsState });
  for (const s of SECTION_LINKS) {
    const data = sections[s.key] as unknown as Record<string, unknown>;
    rows.push({ label: s.label, href: s.href, ...completeness(sectionFields[s.key], data, data._translation as Record<string, string>) });
  }
  const collections = await Promise.all(
    COLLECTION_LINKS.map(async (c) => {
      const list = (await adminList(c.key)) as unknown as Record<string, unknown>[];
      const states = list.map((r) => completeness(collectionFields[c.key], r, r.translations as Record<string, string>));
      const sum = (lang: "ar" | "en") => ({
        missing: states.reduce((n, st) => n + st[lang].missing, 0),
        needsReview: states.some((st) => st[lang].needsReview),
        complete: states.every((st) => st[lang].complete),
      });
      return { label: `${c.label} (${list.length})`, href: c.href, ar: sum("ar"), en: sum("en") };
    }),
  );
  return [...rows, ...collections];
}

export default async function Dashboard() {
  const admin = await requireAdmin();
  const db = await sessionClient();
  const [unread, open, practice, people, insights, media, recent] = await Promise.all([
    count("enquiries", ["is", "read_at", null]),
    count("enquiries", ["neq", "status", "resolved"]),
    count("practice_areas", ["eq", "published", true]),
    count("people", ["eq", "published", true]),
    count("insights", ["eq", "status", "published"]),
    count("media"),
    db.from("enquiries").select("id, name, status, read_at, created_at").order("created_at", { ascending: false }).limit(6),
  ]);

  const cards = [
    { href: "/admin/enquiries?status=unread", label: "Unread enquiries", value: unread, accent: unread > 0 },
    { href: "/admin/enquiries?status=open", label: "Open enquiries", value: open },
    { href: "/admin/practice-areas", label: "Published practice areas", value: practice },
    { href: "/admin/people", label: "Published people", value: people },
    { href: "/admin/insights", label: "Published insights", value: insights },
    { href: "/admin/media", label: "Uploaded images", value: media },
  ];

  return (
    <>
      <PageHead
        eyebrow="Dashboard"
        title={
          <>
            Good to see you, <em>{admin.email.split("@")[0]}.</em>
          </>
        }
        intro="Every change you save here is published to the live website straight away."
      />
      <div className={styles.stack}>
        <div className={styles.cards}>
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className={`${styles.card} ${c.accent ? styles.cardAccent : ""}`}>
              <span className={styles.cardValue}>{String(c.value).padStart(2, "0")}</span>
              <span className={styles.cardLabel}>{c.label}</span>
            </Link>
          ))}
        </div>

        <Panel title="Latest enquiries" meta={<Link href="/admin/enquiries">View all</Link>}>
          {(recent.data ?? []).length === 0 ? (
            <p className={styles.help}>No enquiries yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <tbody>
                  {(recent.data ?? []).map((e) => (
                    <tr key={e.id} className={e.read_at ? "" : styles.unread}>
                      <td>
                        <Link href={`/admin/enquiries/${e.id}`} prefetch={false} className={styles.rowTitle}>
                          {!e.read_at && <span className={styles.dot} aria-label="Unread" />}
                          {e.name}
                        </Link>
                      </td>
                      <td>
                        <EnquiryStatus status={String(e.status)} />
                      </td>
                      <td className={styles.mono}>{formatDateTime(String(e.created_at))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Translation status · حالة الترجمة" meta="Arabic & English">
          <p className={styles.help} style={{ marginBottom: "1rem" }}>
            “Missing” counts texts filled in one language only; visitors then see the other language. “Needs review” marks
            translations nobody has checked yet — tick “reviewed” in the editor once they have been.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Arabic</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {(await translationRows()).map((r) => (
                  <tr key={r.label}>
                    <td>
                      <Link href={r.href} className={styles.rowTitle}>
                        {r.label}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge label="AR" complete={r.ar.complete} missing={r.ar.missing} review={r.ar.needsReview} />
                    </td>
                    <td>
                      <StatusBadge label="EN" complete={r.en.complete} missing={r.en.missing} review={r.en.needsReview} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Editing the site">
          <div className={styles.cards}>
            {[
              ["/admin/homepage", "Homepage", "Hero, introduction, landscape, values, experience, previews, contact"],
              ["/admin/about", "About", "Vision, who we are, values, mission"],
              ["/admin/navigation", "Navigation & Footer", "Menu links, button, footer text"],
              ["/admin/settings", "Site Settings", "Name, contact details, SEO"],
            ].map(([href, label, text]) => (
              <Link key={href} href={href} className={styles.card}>
                <span className={styles.panelTitle}>{label}</span>
                <span className={styles.help}>{text}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
