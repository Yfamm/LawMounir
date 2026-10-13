import { notFound } from "next/navigation";

/** Unknown paths under /ar or /en render the localized 404 inside the site frame. */
export default function CatchAll() {
  notFound();
}
