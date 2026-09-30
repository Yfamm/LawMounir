import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { requireAdmin } from "@/lib/cms/auth";
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
