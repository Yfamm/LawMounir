import "server-only";

/**
 * Optional e-mail notification for a new enquiry, sent through Resend's HTTP
 * API when RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL and CONTACT_FROM_EMAIL
 * are set. The enquiry is already stored before this runs; a failure here is
 * logged and never affects the visitor or the stored record.
 *
 * The e-mail carries only the sender's name and a link to the admin — the
 * enquiry itself stays in the database.
 */
export async function notifyNewEnquiry({ id, name, siteUrl }: { id: string; name: string; siteUrl: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: "New website enquiry",
        text: [
          `A new enquiry was received from ${name}.`,
          "",
          `Open it in the admin: ${siteUrl}/admin/enquiries/${id}`,
          "",
          "The enquiry details are stored in the admin only.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[contact] notification failed with status", res.status);
  } catch (error) {
    console.error("[contact] notification failed:", error instanceof Error ? error.message : error);
  }
}
