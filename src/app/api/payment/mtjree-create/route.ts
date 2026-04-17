import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Using a service role specifically if we need to verify booking without row level security
// Or use standard route handlers client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id, amount, description, user_name, user_email, user_phone, locale } = body;

    if (!booking_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare API URL and headers
    const MTJREE_PROXY_URL = "https://mtjree.link/wp-json/custom/v1/proxy";
    const API_KEY = process.env.MTJREE_API_KEY || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ruqyacenter.com";
    const shopUrl = process.env.MTJREE_SHOP_URL || baseUrl;
    const isTestMode = process.env.MTJREE_TEST_MODE === "true";

    // Split name to first and last
    const nameParts = user_name?.split(" ") || ["User", ""];
    const firstName = nameParts[0] || "N/A";
    const lastName = nameParts.slice(1).join(" ") || "N/A";

    // Generate accurate 16-char hex timestamp
    const timestamp = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const payload = {
      order_id: booking_id,
      email: user_email || "no-reply@ruqyasystem.com",
      shop_type: "react",
      shop_url: shopUrl,
      currency: "USD",
      total: Number(amount),
      first_name: firstName,
      last_name: lastName,
      country: "N/A",
      city: "N/A",
      billing_address: "N/A",
      postcode: 0,
      hookUrl: `${shopUrl}/api/payment/mtjree-webhook`,
      customer_id: booking_id,
      timestamp: timestamp,
      phone: user_phone || "0000000000",
      fail_url: `${baseUrl}/${locale}/payment-result?status=failed`,
      meta_data: JSON.stringify({ description, source: "ruqya_system" }),
      logo_url: process.env.MTJREE_LOGO_URL || `${baseUrl}/logo.png`,
      vendor_name: process.env.MTJREE_VENDOR_NAME || "Ruqya System",
      test_mode: isTestMode
    };

    console.log("🔔 Creating Mtjree Payment:", JSON.stringify(payload));

    const gatewayRes = await fetch(MTJREE_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Read as text first to avoid crashing if the response is HTML
    const responseText = await gatewayRes.text();
    console.log("🔔 Mtjree Raw Response:", responseText);

    let gatewayData: any;
    try {
      gatewayData = JSON.parse(responseText);
    } catch {
      console.error("Mtjree returned non-JSON response:", responseText.substring(0, 500));
      return NextResponse.json({ 
        error: "Payment gateway returned an invalid response. Please try again later.",
      }, { status: 502 });
    }

    console.log("🔔 Mtjree Parsed Response:", gatewayData);

    // Check all possible redirect URL field names from the gateway
    const redirectUrl = gatewayData?.checkoutUrl || gatewayData?.redirect_url || gatewayData?.url || gatewayData?.payment_url || gatewayData?.data?.url || gatewayData?.data?.redirect_url;

    if (gatewayRes.ok && redirectUrl) {
      return NextResponse.json({ redirect_url: redirectUrl });
    } else {
      console.error("Mtjree Gateway Error:", gatewayData);
      return NextResponse.json({ 
        error: gatewayData?.message || gatewayData?.error || "Failed to create payment session from gateway",
        details: gatewayData
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
