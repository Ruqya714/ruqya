import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Paths that should skip next-intl completely (even after auth)
const NON_INTL_PATHS = ["/admin", "/api"];

function isNonIntlPath(pathname: string): boolean {
  return NON_INTL_PATHS.some((p) => pathname.startsWith(p));
}

function getCleanPathname(pathname: string): string {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.replace(`/${locale}`, "") || "/";
    }
  }
  return pathname;
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cleanPath = getCleanPathname(pathname);

  // 1. Initialize Supabase and get user
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Auth Protections based on Clean Path
  if (cleanPath.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", cleanPath);
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();
    if (!profile || profile.role !== "admin" || !profile.is_active) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (cleanPath.startsWith("/healer")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", cleanPath);
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();
    if (
      !profile ||
      !["healer", "admin"].includes(profile.role) ||
      !profile.is_active
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (cleanPath === "/login" && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (profile?.role === "healer") {
      return NextResponse.redirect(new URL("/healer", request.url));
    }
  }

  // 3. i18n Routing
  // If the path shouldn't use i18n, just return the supabase response
  if (isNonIntlPath(cleanPath)) {
    return supabaseResponse;
  }

  // Otherwise, use next-intl. We need to attach any cookies set by Supabase to the new response.
  const intlResponse = intlMiddleware(request);
  
  // Merge cookies from supabaseResponse to intlResponse
  if (supabaseResponse.cookies) {
    const cookiesToSet = supabaseResponse.cookies.getAll();
    cookiesToSet.forEach(({ name, value, ...options }) => {
      // @ts-ignore
      intlResponse.cookies.set(name, value, options);
    });
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
