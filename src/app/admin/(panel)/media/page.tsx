import type { Metadata } from "next";
import { MediaBrowser, MediaUploader } from "@/components/admin/MediaLibrary";
import { PageHead, Panel } from "@/components/admin/PageHead";
import type { MediaItem } from "@/components/admin/upload";
import styles from "@/components/admin/admin.module.css";
import { mediaUsage } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/auth";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media" };

export default async function MediaAdmin() {
  await requireAdmin();
  const db = await sessionClient();
  const [{ data }, usage] = await Promise.all([
    db.from("media").select("id, url, alt, alt_ar, caption, caption_ar, width, height, created_at").order("created_at", { ascending: false }).limit(500),
    mediaUsage(),
  ]);
  const items = (data ?? []) as MediaItem[];

  return (
    <>
      <PageHead
        eyebrow="Site"
        title={
          <>
            Media <em>library.</em>
          </>
        }
        intro="Uploaded images live in Supabase Storage. Use them anywhere an image can be chosen — section images, practice areas, portraits, article covers, the contact background, logo, favicon and sharing image."
      />
      <div className={styles.stack}>
        <p className={styles.notice}>
          The six architectural plates and the hero photograph are built into the site: they stay in place until you
          choose another image for a section, and “Reset to original” brings them back. Decorative drawing (the
          geometric pattern, grain and portrait placeholder) is part of the design and is not an image file.
        </p>
        <Panel title="Upload">
          <MediaUploader />
        </Panel>
        <Panel title="Images" meta={`${items.length} uploaded`}>
          <MediaBrowser items={items} usage={Object.fromEntries(usage)} />
        </Panel>
      </div>
    </>
  );
}
