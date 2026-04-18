import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    const rawText = await req.text();
    console.log("🔔 Mtjree Webhook Raw Body:", rawText);

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const searchParams = new URLSearchParams(rawText);
      body = Object.fromEntries(searchParams.entries());
    } else {
      try {
        body = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse webhook JSON:", e);
      }
    }
    console.log("🔔 Mtjree Webhook Parsed:", body);

    // According to standard payment webhooks, we need to extract status and order_id
    // Mtjree might send `status: true/false` or `status: "completed"`, we'll log it and handle
    const order_id = body.order_id || body.booking_id || body.id || body.orderId;
    
    const statusValue = String(body.status || body.payment_status || body.response_status || "").toLowerCase();
    const isSuccess = body.status === true || 
                      statusValue === "true" || 
                      statusValue === "completed" || 
                      statusValue === "success" || 
                      statusValue === "captured" || 
                      statusValue === "authorized" ||
                      statusValue === "approved" ||
                      body.response_code === "000";

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
