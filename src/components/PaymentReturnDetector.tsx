"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * This component detects when a user returns from Mtjree payment gateway.
 * Since Mtjree always redirects to shop_url (homepage) after payment,
 * we use localStorage to detect the return and redirect to payment-result page.
 * 
 * The booking page saves { booking_id, locale, timestamp } to localStorage
 * before redirecting to Mtjree. When the user comes back to the homepage,
 * this component picks it up and redirects to payment-result.
 */
export default function PaymentReturnDetector() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    try {
      const pending = localStorage.getItem("mtjree_pending_booking");
      if (!pending) return;

      const data = JSON.parse(pending);
      const { booking_id, timestamp } = data;

      // Only process if the booking was created within the last 30 minutes
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - timestamp > thirtyMinutes) {
        localStorage.removeItem("mtjree_pending_booking");
        return;
      }

      // Clear it immediately to prevent redirect loops
      localStorage.removeItem("mtjree_pending_booking");

      // Redirect to payment result page
      router.replace(`/${locale}/payment-result?status=success&booking_id=${booking_id}`);
    } catch (e) {
      // Silently ignore any errors (SSR, JSON parse, etc.)
      console.error("PaymentReturnDetector error:", e);
    }
  }, [router, locale]);

  return null; // This component renders nothing
}
