import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryStatus, formatDateTime } from "@/components/admin/EnquiryBits";
import { EnquiryControls, MarkRead } from "@/components/admin/EnquiryControls";
import { PageHead, Panel } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";
import { requireAdmin } from "@/lib/cms/auth";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryAdmin({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await sessionClient();
  const { data: e } = await db.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (!e) notFound();

  let handler = "";
  if (e.handled_by) {
    const { data } = await db.from("admin_users").select("email").eq("user_id", e.handled_by).maybeSingle();
    handler = data?.email ?? "";
  }

  return (
    <>
      <MarkRead id={e.id} unread={!e.read_at} />
      <Link href="/admin/enquiries" className={styles.back}>
        ← All enquiries
      </Link>
      <PageHead eyebrow={`Enquiry · ${formatDateTime(e.created_at)}`} title={e.name} actions={<EnquiryStatus status={e.status} />} />
      <div className={styles.detail}>
        <Panel title="Message">
          <div className={styles.stack}>
            <dl className={styles.dl}>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${String(e.phone).replace(/[^\d+]/g, "")}`}>{e.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : "Not given"}</dd>
              </div>
              <div>
                <dt>Issue / question</dt>
                <dd className={styles.message}>{e.message}</dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd className={styles.mono}>
                  {formatDateTime(e.created_at)}
                  {e.source_path ? ` · from ${e.source_path}` : ""}
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd className={styles.mono}>
                  {formatDateTime(e.updated_at)}
                  {handler ? ` · ${handler}` : ""}
                </dd>
              </div>
            </dl>
          </div>
        </Panel>
        <Panel title="Handling">
          <EnquiryControls id={e.id} status={e.status} note={e.internal_note ?? ""} />
        </Panel>
      </div>
    </>
  );
}
