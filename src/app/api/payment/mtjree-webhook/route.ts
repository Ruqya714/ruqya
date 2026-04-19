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
    console.log("🔔 Mtjree Webhook Parsed:", JSON.stringify(body));

    // ── Per Mtjree Postman collection "Update status in hook" ──
    // The webhook sends:
    //   { "new_status": true, "user_id": 12345, "order_id": 67890, "meta_data": { ... } }
    // 
    // - "new_status" (boolean) = whether payment succeeded
    // - "order_id" might be Mtjree internal ID or our original order_id
    // - "meta_data" contains what we sent (includes our booking_id UUID)
    //
    // Also handle the raw dashboard format:
    //   { "main_order_id": "uuid", "status": 1, "event": "operation.success" }

    // Parse meta_data (could be string or object)
    let metaDataObj: any = {};
    try {
      if (typeof body.meta_data === "string") {
        metaDataObj = JSON.parse(body.meta_data);
      } else if (typeof body.meta_data === "object" && body.meta_data) {
        metaDataObj = body.meta_data;
      }
    } catch (e) {
      console.error("Failed to parse meta_data:", e);
    }

    // Extract our booking UUID - priority order:
    // 1. meta_data.booking_id (most reliable - we put it there)
    // 2. main_order_id (dashboard/notification format)
    // 3. order_id (could be ours if Mtjree passes it through)
    // 4. customer_id (we set it to booking_id too)
    const booking_id = metaDataObj.booking_id ||
                       body.main_order_id ||
                       body.order_id ||
                       body.customer_id;

    // Determine success status
    // Per Postman docs: "new_status": true means success
    // Per dashboard raw: "status": 1 or "event": "operation.success"
    const isSuccess = body.new_status === true ||
                      body.new_status === "true" ||
                      body.status === true ||
                      body.status === 1 ||
                      String(body.status).toLowerCase() === "true" ||
                      String(body.status).toLowerCase() === "completed" ||
                      String(body.status).toLowerCase() === "success" ||
                      String(body.event || "").toLowerCase() === "operation.success";

    console.log("🔔 Webhook extracted - booking_id:", booking_id, "isSuccess:", isSuccess, "new_status:", body.new_status, "meta_data:", metaDataObj);

    if (!booking_id) {
      console.error("Webhook missing booking_id. Full payload:", JSON.stringify(body));
      return NextResponse.json({ error: "Missing booking_id" }, { status: 400 });
    }

    // Validate UUID format (our booking IDs are UUIDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(String(booking_id));

    if (!isUUID) {
      // If order_id is not a UUID (Mtjree internal ID), try to find it from meta_data
      console.warn("booking_id is not a UUID:", booking_id, "- checking meta_data");
      if (metaDataObj.booking_id && uuidRegex.test(metaDataObj.booking_id)) {
        // Already handled above, but log for debugging
        console.log("Found UUID in meta_data:", metaDataObj.booking_id);
      } else {
        console.error("Cannot find valid booking UUID in webhook payload");
        return NextResponse.json({ error: "Invalid booking_id format" }, { status: 400 });
      }
    }

    // Use the valid UUID
    const finalBookingId = isUUID ? booking_id : metaDataObj.booking_id;

    // Update the booking status in Supabase
    const paymentStatus = isSuccess ? "paid" : "failed";
    const bookingStatus = isSuccess ? "confirmed" : "pending";

    console.log("🔔 Updating booking:", finalBookingId, "payment_status:", paymentStatus, "status:", bookingStatus);

    const { error, count } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: bookingStatus
      })
      .eq("id", finalBookingId);

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json({ error: "Database update failed", details: error.message }, { status: 500 });
    }

    console.log("🔔 Booking updated successfully. Rows affected:", count);

    return NextResponse.json({ received: true, status: paymentStatus, booking_id: finalBookingId });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
