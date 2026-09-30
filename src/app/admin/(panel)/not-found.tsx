import Link from "next/link";
import { PageHead } from "@/components/admin/PageHead";
import styles from "@/components/admin/admin.module.css";

export default function AdminNotFound() {
  return (
    <>
      <PageHead eyebrow="Not found" title="This entry does not exist." intro="It may have been deleted." />
      <Link href="/admin" className={styles.buttonGhost}>
        Back to the dashboard
      </Link>
    </>
  );
}
