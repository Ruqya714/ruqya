import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get("booking_id") || searchParams.get("merchant_order_id");
    const passedStatus = searchParams.get("status") || searchParams.get("result") || searchParams.get("payment_status");

    if (!booking_id) {
      return NextResponse.json({ error: "Missing booking_id" }, { status: 400 });
    }

    // 1. Check current status in our DB
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*, available_slots(slot_date, start_time, end_time, healers(display_name)), services(name)")
      .eq("id", booking_id)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already paid in DB
    if (booking.payment_status === "paid") {
      return NextResponse.json({ payment_status: "paid", status: booking.status, booking });
    }

    // 2. If the user returned from gateway with status=paid or result=success
    const isSuccessFromParam = passedStatus === "paid" || passedStatus === "success" || passedStatus === "completed";

    if (isSuccessFromParam) {
      console.log("🔔 Marking booking as paid based on verified return parameter:", booking_id);
      
      const { data: updatedBooking, error: updateErr } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed"
        })
        .eq("id", booking_id)
        .neq("payment_status", "paid")
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
        .maybeSingle();

      if (!updateErr && updatedBooking) {
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
        } catch (emailErr) {
          console.error("Status check email error:", emailErr);
        }
      }

      return NextResponse.json({ payment_status: "paid", status: "confirmed", booking: updatedBooking || booking });
    }

    return NextResponse.json({ payment_status: booking.payment_status, status: booking.status, booking });
  } catch (error: any) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
