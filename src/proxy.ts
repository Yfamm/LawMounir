import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin gate. Refreshes the Supabase session cookie and sends visitors who
 * are not signed in to /admin/login. This is only the first line: every
 * admin page and server action re-checks the user and their admin
 * membership on the server (requireAdmin), and row-level security enforces
 * it again in the database.
 */
export async function proxy(request: NextRequest) {
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

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
