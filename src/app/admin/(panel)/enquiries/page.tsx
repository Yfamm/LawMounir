import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryStatus, formatDateTime } from "@/components/admin/EnquiryBits";
import { PageHead } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { requireAdmin } from "@/lib/cms/auth";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Enquiries" };

const filters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "open", label: "Open" },
  { id: "new", label: "New" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

type Props = { searchParams: Promise<{ status?: string }> };

export default async function EnquiriesAdmin({ searchParams }: Props) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = filters.find((f) => f.id === status)?.id ?? "all";
  const db = await sessionClient();
  let q = db.from("enquiries").select("id, name, phone, email, message, status, read_at, created_at").order("created_at", { ascending: false }).limit(500);
  if (filter === "unread") q = q.is("read_at", null);
  else if (filter === "open") q = q.neq("status", "resolved");
  else if (filter !== "all") q = q.eq("status", filter);
  const { data, error } = await q;
  const rows = data ?? [];

  return (
    <>
      <PageHead
        eyebrow="Overview"
        title={
          <>
            Confidential <em>enquiries.</em>
          </>
        }
        intro="Messages sent through the website’s contact form. Only signed-in administrators can see them."
      />
      <nav className={styles.filters} aria-label="Filter enquiries">
        {filters.map((f) => (
          <Link key={f.id} href={f.id === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f.id}`} className={styles.filter} aria-current={f.id === filter ? "true" : undefined}>
            {f.label}
          </Link>
        ))}
      </nav>
      {error ? (
        <p className={styles.statusError}>The enquiries could not be loaded. Please refresh.</p>
      ) : rows.length === 0 ? (
        <p className={styles.empty}>No enquiries here.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className={e.read_at ? "" : styles.unread}>
                  <td>
                    <Link href={`/admin/enquiries/${e.id}`} prefetch={false} className={styles.rowTitle}>
                      {!e.read_at && <span className={styles.dot} aria-label="Unread" />}
                      {e.name}
                    </Link>
                  </td>
                  <td className={styles.mono}>{e.phone}</td>
                  <td className={styles.mono}>{e.email ?? "—"}</td>
                  <td>
                    <span className={styles.truncate}>{e.message}</span>
                  </td>
                  <td>
                    <EnquiryStatus status={String(e.status)} />
                  </td>
                  <td className={styles.mono}>{formatDateTime(String(e.created_at))}</td>
                  <td>
                    <Link href={`/admin/enquiries/${e.id}`} prefetch={false} className={styles.iconButton}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
