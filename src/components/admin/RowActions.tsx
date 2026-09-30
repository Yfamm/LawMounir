"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRecord, moveRecord, setPublished, type ActionResult } from "@/app/admin/actions";
import type { CollectionKey } from "@/lib/cms/fields";
import styles from "./admin.module.css";

type Props = {
  collection: CollectionKey;
  id: string;
  published: boolean;
  first: boolean;
  last: boolean;
  name: string;
  /** Words for the publish toggle, e.g. ["Show", "Hide"]. */
  toggle?: [string, string];
  reorder?: boolean;
};

/** Reorder, publish / unpublish and delete controls for a collection row. */
export function RowActions({ collection, id, published, first, last, name, toggle = ["Publish", "Unpublish"], reorder = true }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const result = await fn();
      if (!result.ok) window.alert(result.error);
      router.refresh();
    });

  return (
    <span className={styles.tools}>
      {reorder && (
        <>
          <button type="button" className={styles.iconButton} disabled={pending || first} onClick={() => run(() => moveRecord(collection, id, "up"))} aria-label={`Move ${name} up`}>
            ↑
          </button>
          <button type="button" className={styles.iconButton} disabled={pending || last} onClick={() => run(() => moveRecord(collection, id, "down"))} aria-label={`Move ${name} down`}>
            ↓
          </button>
        </>
      )}
      <button type="button" className={styles.iconButton} disabled={pending} onClick={() => run(() => setPublished(collection, id, !published))}>
        {published ? toggle[1] : toggle[0]}
      </button>
      <button
        type="button"
        className={styles.iconButton}
        disabled={pending}
        onClick={() => {
          if (window.confirm(`Delete “${name}”? This cannot be undone.`)) run(() => deleteRecord(collection, id));
        }}
      >
        Delete
      </button>
    </span>
  );
}
