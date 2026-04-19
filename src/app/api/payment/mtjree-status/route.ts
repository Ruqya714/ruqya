import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// This endpoint checks payment status with Mtjree's Order Status API
// and updates the booking if payment was successful.
// Used as a fallback when webhook doesn't fire.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get("booking_id");

    if (!booking_id) {
      return NextResponse.json({ error: "Missing booking_id" }, { status: 400 });
    }

    // First check current status in our DB
    const { data: booking } = await supabase
      .from("bookings")
      .select("payment_status, status")
      .eq("id", booking_id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already paid, return immediately
    if (booking.payment_status === "paid") {
      return NextResponse.json({ payment_status: "paid", status: booking.status });
    }

    // Call Mtjree Order Status API as fallback
    const API_KEY = process.env.MTJREE_API_KEY || "";
    const domain = new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ruqyacenter.com").hostname;

    const statusUrl = `https://mtjree.link/wp-json/operations-manager/v1/get-order-status?order_id=${encodeURIComponent(booking_id)}&domain=${encodeURIComponent(domain)}`;

    console.log("🔔 Checking Mtjree order status:", statusUrl);

    const mtjreeRes = await fetch(statusUrl, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json"
      }
    });

    const mtjreeText = await mtjreeRes.text();
    console.log("🔔 Mtjree Order Status Response:", mtjreeText);

    let mtjreeData: any;
    try {
      mtjreeData = JSON.parse(mtjreeText);
    } catch {
      console.error("Failed to parse Mtjree status response");
      // Return current DB status
      return NextResponse.json({ payment_status: booking.payment_status, status: booking.status });
    }

    // Per docs: API returns { status: boolean, notes: string, last_checked: string }
    const isSuccess = mtjreeData.status === true || mtjreeData.status === "true";

    if (isSuccess && booking.payment_status !== "paid") {
      // Update booking in DB
      const { data: updatedBooking, error } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed"
        })
        .eq("id", booking_id)
        .select(`
          *,
          available_slots (
            slot_date,
            start_time,
            end_time,
            healers ( display_name )
          ),
          services ( name )
        `)
        .single();

      if (error || !updatedBooking) {
        console.error("Error updating booking from status check:", error);
      } else {
        console.log("🔔 Booking updated via Order Status API:", booking_id);
        
        // Send email
        try {
          const { sendBookingEmailAction } = await import("@/app/actions/bookingEmail");
          const healerName = updatedBooking.available_slots?.healers?.display_name || "مُعالج";
          const slotDate = updatedBooking.available_slots?.slot_date || String(new Date().toISOString()).split('T')[0];
          const startTime = updatedBooking.available_slots?.start_time || "00:00";
          const endTime = updatedBooking.available_slots?.end_time || "00:00";
          const serviceName = updatedBooking.services?.name || "خدمة مدفوعة";

          await sendBookingEmailAction({
            patient_name: updatedBooking.patient_name,
            patient_email: updatedBooking.patient_email,
            patient_phone: updatedBooking.patient_phone,
            service_name: serviceName,
            date: slotDate,
            time: `${startTime} - ${endTime}`,
            healer_name: healerName
          });
          console.log("🔔 Booking email sent successfully from status check for:", booking_id);
        } catch (emailError) {
          console.error("Status check email error:", emailError);
        }
      }

      return NextResponse.json({ payment_status: "paid", status: "confirmed", source: "mtjree_api" });
    }

    return NextResponse.json({ 
      payment_status: booking.payment_status, 
      status: booking.status,
      mtjree_status: mtjreeData.status 
    });

  } catch (error: any) {
    console.error("Order status check error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
