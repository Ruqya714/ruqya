"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";

/**
 * Detects Supabase recovery tokens in the URL hash fragment
 * and redirects to /update-password if found.
 * This handles the case where Supabase redirects to the Site URL (homepage)
 * instead of the intended redirectTo URL.
 */
export default function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Check if this is a recovery flow (password reset)
    if (hash.includes("type=recovery") && !pathname.includes("update-password")) {
      // Redirect to update-password page, preserving the hash tokens
      router.replace(`/update-password${hash}`);
    }
  }, [pathname, router]);

  return null;
}
