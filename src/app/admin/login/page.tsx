import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import styles from "@/components/admin/admin.module.css";
import { getAdmin } from "@/lib/cms/auth";
import { getSite } from "@/lib/cms/repository";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (await getAdmin()) redirect("/admin");
  const [{ next }, site] = await Promise.all([searchParams, getSite()]);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div>
          <p className={styles.eyebrow}>{site.siteName} · Admin</p>
          <h1 className={styles.loginTitle}>
            Sign in to <em>the register.</em>
          </h1>
          <p className={styles.loginArabic} lang="ar">
            {site.siteNameAr}
          </p>
        </div>
        <LoginForm next={typeof next === "string" ? next : ""} />
      </div>
    </div>
  );
}
