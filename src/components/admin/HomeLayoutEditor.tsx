"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveSection } from "@/app/admin/actions";
import type { HomeLayout, HomeSectionId } from "@/lib/cms/types";
import styles from "./admin.module.css";

const NAMES: Record<HomeSectionId, string> = {
  intro: "Introduction · المكتب",
  practice: "Practice areas · مجالات الممارسة",
  landscape: "Legal landscape · المشهد القانوني",
  values: "Values · القيم",
  experience: "Experience · الخبرة",
  people: "People preview · الفريق",
  insights: "Insights preview · المقالات",
};

/** Order and visibility of the movable homepage sections. Hero opens and Contact closes the page. */
export function HomeLayoutEditor({ initial }: { initial: HomeLayout }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial.order);
  const [hidden, setHidden] = useState(initial.hidden);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify({ order, hidden }) !== JSON.stringify(initial);

  const move = (i: number, d: -1 | 1) => {
    const next = [...order];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setOrder(next);
    setStatus(null);
  };

  const save = () =>
    start(async () => {
      const r = await saveSection("home.layout", { order, hidden });
      setStatus(r.ok ? { kind: "ok", text: "Saved. The live site is updated." } : { kind: "error", text: r.error });
      if (r.ok) router.refresh();
    });

  return (
    <div className={styles.form}>
      <p className={styles.help}>The hero always opens the page and the contact section always closes it. Section numbers follow the visible order.</p>
      <ol className={styles.list}>
        <li className={`${styles.itemHead} ${styles.refRow}`}>
          <span className={styles.itemLabel}>01 — Hero · الواجهة (fixed)</span>
        </li>
        {order.map((id, i) => {
          const isHidden = hidden.includes(id);
          return (
            <li key={id} className={`${styles.itemHead} ${styles.refRow} ${isHidden ? styles.itemHidden : ""}`}>
              <span>
                <span className={styles.itemLabel}>{isHidden ? "—" : String(order.filter((x) => !hidden.includes(x)).indexOf(id) + 2).padStart(2, "0")}</span>{" "}
                {NAMES[id]}
              </span>
              <span className={styles.tools}>
                <button type="button" className={styles.iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${NAMES[id]} up`}>
                  ↑ Up
                </button>
                <button type="button" className={styles.iconButton} disabled={i === order.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${NAMES[id]} down`}>
                  ↓ Down
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setHidden(isHidden ? hidden.filter((x) => x !== id) : [...hidden, id])}
                  aria-pressed={!isHidden}
                >
                  {isHidden ? "Show" : "Hide"}
                </button>
              </span>
            </li>
          );
        })}
        <li className={`${styles.itemHead} ${styles.refRow}`}>
          <span className={styles.itemLabel}>Last — Contact · تواصل معنا (fixed)</span>
        </li>
      </ol>
      <div className={styles.saveBar}>
        <button type="button" className={styles.button} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving…" : "Save & publish"}
        </button>
        <button
          type="button"
          className={styles.buttonGhost}
          disabled={pending || !dirty}
          onClick={() => {
            setOrder(initial.order);
            setHidden(initial.hidden);
          }}
        >
          Cancel changes
        </button>
        <span className={`${styles.status} ${status?.kind === "ok" ? styles.statusOk : status?.kind === "error" ? styles.statusError : ""}`} role="status">
          {status?.text ?? (dirty ? "Unsaved changes" : "")}
        </span>
      </div>
    </div>
  );
}
