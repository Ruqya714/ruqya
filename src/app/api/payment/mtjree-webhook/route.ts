import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔔 Mtjree Webhook Received:", body);

    // According to standard payment webhooks, we need to extract status and order_id
    // Mtjree might send `status: true/false` or `status: "completed"`, we'll log it and handle
    const order_id = body.order_id || body.booking_id;
    
    // Determine payment success from the webhook body 
    // They indicate "status: Boolean indicating if payment was successful" in their GET API
    // We assume the webhook sends a similar structure.
    const isSuccess = body.status === true || body.status === "true" || body.status === "completed" || body.status === "success";

    if (!order_id) {
      console.error("Webhook missing order_id");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Update the booking status in Supabase
    const paymentStatus = isSuccess ? "paid" : "failed";
    const bookingStatus = isSuccess ? "confirmed" : "pending";

    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: bookingStatus
      })
      .eq("id", order_id);

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true, status: paymentStatus });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
