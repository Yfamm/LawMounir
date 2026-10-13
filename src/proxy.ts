import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLang, isLang, LANG_COOKIE, splitPath, type Lang } from "@/lib/i18n";

/**
 * 1. Public language routing. Every public page lives under /ar or /en. A URL
 *    without a language (an old link such as /about, or /) is redirected to
 *    the visitor's remembered language (cookie set by the language switcher)
 *    or, for new visitors, the default language from Site Settings (Arabic).
 *    URLs that already carry a language are served as asked — an explicit
 *    /en link is never forced back to Arabic, and nothing redirects twice.
 *
 * 2. Admin gate. Refreshes the Supabase session cookie and sends visitors who
 *    are not signed in to /admin/login. This is only the first line: every
 *    admin page, server action and admin API route re-checks the user and
 *    their admin membership on the server (requireAdmin), and row-level
 *    security enforces it again in the database.
 */

let cachedDefault: { lang: Lang; at: number } | null = null;

/** Default language from Site Settings, cached for a minute; Arabic on any failure. */
async function siteDefaultLang(): Promise<Lang> {
  if (cachedDefault && Date.now() - cachedDefault.at < 60_000) return cachedDefault.lang;
  let lang: Lang = defaultLang;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/site_settings?select=data&id=eq.1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(1500),
      });
      const rows = (await res.json()) as { data?: { defaultLanguage?: string } }[];
      const value = rows?.[0]?.data?.defaultLanguage;
      if (isLang(value)) lang = value;
    } catch {
      // keep Arabic
    }
  }
  cachedDefault = { lang, at: Date.now() };
  return lang;
}

async function publicRouting(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (splitPath(pathname).lang) return NextResponse.next();
  const remembered = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(remembered) ? remembered : await siteDefaultLang();
  const target = request.nextUrl.clone();
  target.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  target.search = search;
  // Temporary: the target depends on the visitor's language choice.
  return NextResponse.redirect(target, 307);
}

async function adminGate(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  let response = NextResponse.next({ request });
  let user = null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
        },
      },
    });
    try {
      ({
        data: { user },
      } = await supabase.auth.getUser());
    } catch {
      user = null;
    }
  }

  if (!user && pathname.startsWith("/api/")) {
    response = NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  } else if (!user && !isLogin) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    response = NextResponse.redirect(login);
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/")) {
    return adminGate(request);
  }
  return publicRouting(request);
}

export const config = {
  matcher: [
    // Public pages: everything except Next internals, API routes and files with an extension.
    "/((?!_next/|api/|.*\\..*).*)",
    "/api/admin/:path*",
  ],
};
