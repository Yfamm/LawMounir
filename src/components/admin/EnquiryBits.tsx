import styles from "./admin.module.css";

export const statusLabels: Record<string, string> = { new: "New", in_progress: "In progress", resolved: "Resolved" };

export function EnquiryStatus({ status }: { status: string }) {
  const cls = status === "new" ? styles.badgeGold : status === "in_progress" ? styles.badgeOutline : styles.badgeMuted;
  return <span className={`${styles.badge} ${cls}`}>{statusLabels[status] ?? status}</span>;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Cairo",
  });
}
