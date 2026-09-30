import type { Metadata } from "next";
import { MediaCard, MediaUploader } from "@/components/admin/MediaLibrary";
import { PageHead, Panel } from "@/components/admin/PageHead";
import type { MediaItem } from "@/components/admin/upload";
import styles from "@/components/admin/admin.module.css";
import { requireAdmin } from "@/lib/cms/auth";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media" };

export default async function MediaAdmin() {
  await requireAdmin();
  const db = await sessionClient();
  const { data } = await db
    .from("media")
    .select("id, url, alt, caption, width, height, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const items = (data ?? []) as MediaItem[];
  const uses = await Promise.all(items.map(async (m) => Number((await db.rpc("media_usage", { p_media: m.id })).data ?? 0)));

  return (
    <>
      <PageHead
        eyebrow="Site"
        title={
          <>
            Media <em>library.</em>
          </>
        }
        intro="Uploaded images are stored in Supabase Storage. The six architectural plates and the hero photograph are built into the site and stay in place unless you choose a different image for a section."
      />
      <div className={styles.stack}>
        <Panel title="Upload">
          <MediaUploader />
        </Panel>
        <Panel title="Images" meta={`${items.length} uploaded`}>
          {items.length === 0 ? (
            <p className={styles.help}>No images uploaded yet.</p>
          ) : (
            <div className={styles.mediaGrid}>
              {items.map((item, i) => (
                <MediaCard key={item.id} item={item} uses={uses[i]} />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
