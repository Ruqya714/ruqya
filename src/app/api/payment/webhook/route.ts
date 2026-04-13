import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingEmailAction } from '@/app/actions/bookingEmail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔔 ClickPay Webhook Received:", body);

    const cartId = body.cart_id;
    const paymentResult = body.payment_result;

    if (!cartId || !paymentResult) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 'A' means Authorised/Paid in ClickPay
    if (paymentResult.response_status === 'A') {
      const supabase = createAdminClient();
      
      // Check if already paid to avoid duplicate emails
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('payment_status')
        .eq('id', cartId)
        .single();
        
      if (existingBooking?.payment_status === 'paid') {
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // Update booking to paid
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', cartId)
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

      if (updateError || !booking) {
        console.error("Failed to update booking status:", updateError);
        return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
      }

      // Prepare email data
      const healerName = booking.available_slots?.healers?.display_name || "مُعالج";
      const slotDate = booking.available_slots?.slot_date || String(new Date().toISOString()).split('T')[0];
      const startTime = booking.available_slots?.start_time || "00:00";
      const endTime = booking.available_slots?.end_time || "00:00";
      const serviceName = booking.services?.name || "خدمة مدفوعة";

      await sendBookingEmailAction({
        patient_name: booking.patient_name,
        patient_email: booking.patient_email,
        patient_phone: booking.patient_phone,
        service_name: serviceName,
        date: slotDate,
        time: `${startTime} - ${endTime}`,
        healer_name: healerName
      }).catch(e => console.error("Webhook email error:", e));

    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook top-level error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
