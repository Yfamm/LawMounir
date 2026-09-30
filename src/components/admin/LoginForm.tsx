"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import styles from "./admin.module.css";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="next" value={next} />
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="username"
          required
          maxLength={200}
          defaultValue={state?.email}
          key={state?.email}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Password</span>
        <input className={styles.input} type="password" name="password" autoComplete="current-password" required maxLength={200} />
      </label>
      {state?.error && (
        <p className={styles.statusError} role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className={styles.help}>Access is limited to the firm’s administrators. Accounts are created by the site administrator.</p>
    </form>
  );
}
