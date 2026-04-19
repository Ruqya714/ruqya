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
    // Mtjree might send data in a wrapper, so we extract from body or body.data
    const dataObj = body.data || body;
    
    // Sometimes order metadata comes as a string in webhook
    let metaDataObj: any = {};
    try {
      if (typeof dataObj.meta_data === 'string') {
        metaDataObj = JSON.parse(dataObj.meta_data);
      } else if (typeof dataObj.metadata === 'string') {
        metaDataObj = JSON.parse(dataObj.metadata);
      } else if (typeof body.meta_data === 'string') {
        metaDataObj = JSON.parse(body.meta_data);
      }
    } catch(e) {}

    const order_id = dataObj.main_order_id || body.main_order_id || 
                     dataObj.order_id || body.order_id || 
                     dataObj.booking_id || body.booking_id || 
                     dataObj.customer_id || body.customer_id ||
                     dataObj.id || body.id || 
                     dataObj.orderId || body.orderId ||
                     metaDataObj.booking_id || 
                     dataObj.cart_id;
    
    const statusValue = String(
      dataObj.status || 
      body.status || 
      dataObj.payment_status || 
      body.payment_status || 
      dataObj.response_status || 
      body.response_status || 
      dataObj.result ||
      ""
    ).toLowerCase();
    
    const eventValue = String(dataObj.event || body.event || "").toLowerCase();
    
    const isSuccess = dataObj.status === true || 
                      body.status === true ||
                      statusValue === "true" || 
                      statusValue === "1" || // Status 1 is success in Mtjree raw body
                      statusValue === "completed" || 
                      statusValue === "success" || 
                      statusValue === "captured" || 
                      statusValue === "authorized" ||
                      statusValue === "approved" ||
                      eventValue === "operation.success" ||
                      dataObj.response_code === "000" ||
                      body.response_code === "000";

    if (!order_id) {
      console.error("Webhook missing order_id, Payload:", body);
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
