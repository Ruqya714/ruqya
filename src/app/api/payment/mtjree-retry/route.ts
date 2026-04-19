import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Retry payment for an existing booking that failed or is still pending
export async function POST(req: Request) {
  try {
    const { booking_id, locale } = await req.json();

    if (!booking_id) {
      return NextResponse.json({ error: "Missing booking_id" }, { status: 400 });
    }

    // Fetch the existing booking from DB
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, services(name, price)")
      .eq("id", booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow retry for pending/failed payments
    if (booking.payment_status === "paid") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
    }

    // Call the mtjree-create endpoint internally with booking data
    const PRODUCTION_DOMAIN = "https://ruqyacenter.com";
    const paymentRes = await fetch(`${PRODUCTION_DOMAIN}/api/payment/mtjree-create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: booking.id,
        amount: booking.services?.price || 50,
        description: booking.services?.name || "Consultation",
        user_name: booking.patient_name,
        user_email: booking.patient_email,
        user_phone: booking.patient_phone,
        locale: locale || "ar"
      })
    });

    const paymentData = await paymentRes.json();

    if (paymentRes.ok && paymentData.redirect_url) {
      return NextResponse.json({ redirect_url: paymentData.redirect_url });
    } else {
      return NextResponse.json({ 
        error: paymentData.error || "Failed to create payment session" 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Payment retry error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
