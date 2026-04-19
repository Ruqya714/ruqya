import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use Edge runtime to avoid Cloudflare blocking Vercel serverless IPs
export const runtime = "edge";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Map phone country codes to country info (2-letter code, city, postcode)
const PHONE_TO_COUNTRY: Record<string, { code: string; city: string; postcode: number }> = {
  "+90":  { code: "TR", city: "Istanbul",   postcode: 34000 },
  "+966": { code: "SA", city: "Riyadh",     postcode: 11564 },
  "+971": { code: "AE", city: "Dubai",      postcode: 0 },
  "+965": { code: "KW", city: "Kuwait City",postcode: 13001 },
  "+974": { code: "QA", city: "Doha",       postcode: 0 },
  "+973": { code: "BH", city: "Manama",     postcode: 0 },
  "+968": { code: "OM", city: "Muscat",     postcode: 100 },
  "+962": { code: "JO", city: "Amman",      postcode: 11110 },
  "+970": { code: "PS", city: "Gaza",       postcode: 0 },
  "+961": { code: "LB", city: "Beirut",     postcode: 1100 },
  "+964": { code: "IQ", city: "Baghdad",    postcode: 10001 },
  "+20":  { code: "EG", city: "Cairo",      postcode: 11511 },
  "+212": { code: "MA", city: "Casablanca", postcode: 20000 },
  "+213": { code: "DZ", city: "Algiers",    postcode: 16000 },
  "+216": { code: "TN", city: "Tunis",      postcode: 1000 },
  "+218": { code: "LY", city: "Tripoli",    postcode: 0 },
  "+249": { code: "SD", city: "Khartoum",   postcode: 11111 },
  "+967": { code: "YE", city: "Sanaa",      postcode: 0 },
  "+963": { code: "SY", city: "Damascus",   postcode: 0 },
  "+1":   { code: "US", city: "New York",   postcode: 10001 },
  "+44":  { code: "GB", city: "London",     postcode: 10000 },
  "+49":  { code: "DE", city: "Berlin",     postcode: 10115 },
  "+33":  { code: "FR", city: "Paris",      postcode: 75001 },
  "+31":  { code: "NL", city: "Amsterdam",  postcode: 1011 },
  "+46":  { code: "SE", city: "Stockholm",  postcode: 11120 },
  "+60":  { code: "MY", city: "Kuala Lumpur",postcode: 50000 },
  "+62":  { code: "ID", city: "Jakarta",    postcode: 10110 },
  "+92":  { code: "PK", city: "Islamabad",  postcode: 44000 },
  "+91":  { code: "IN", city: "New Delhi",  postcode: 110001 },
};

// Extract country code from full phone string like "+90 5551234567"
function extractPhoneCode(phone: string): string {
  if (!phone) return "+90";
  const trimmed = phone.trim();
  // Try matching longest codes first (4 digits, then 3, then 2, then 1)
  for (const len of [4, 3, 2]) {
    for (const code of Object.keys(PHONE_TO_COUNTRY)) {
      if (code.length === len + 1 && trimmed.startsWith(code)) {
        return code;
      }
    }
  }
  return "+90"; // default fallback
}

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
    const nameParts = user_name?.split(" ") || ["Customer", ""];
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // Derive country, city, postcode from phone code
    const phoneCode = extractPhoneCode(user_phone || "");
    const countryInfo = PHONE_TO_COUNTRY[phoneCode] || { code: "TR", city: "Istanbul", postcode: 34000 };

    // Clean phone number (digits only, no spaces)
    const cleanPhone = (user_phone || "").replace(/\s+/g, "").replace(/^\+/, "");

    // Generate accurate 16-char hex timestamp
    const timestamp = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Mtjree validates shop_url against registered domains - must be exact base domain.
    // Redirect after success goes to shop_url (homepage). Client-side localStorage
    // handles detecting return from payment and redirecting to payment-result page.

    const payload = {
      order_id: booking_id,
      email: user_email || "customer@ruqyacenter.com",
      shop_type: "react",
      shop_url: baseUrl,
      currency: "USD",
      total: Number(amount),
      first_name: firstName,
      last_name: lastName,
      country: countryInfo.code,
      city: countryInfo.city,
      billing_address: `${countryInfo.city}, ${countryInfo.code}`,
      postcode: countryInfo.postcode,
      hookUrl: `${baseUrl}/api/payment/mtjree-webhook`,
      customer_id: booking_id,
      timestamp: timestamp,
      phone: cleanPhone,
      fail_url: `${baseUrl}/${locale || "ar"}/payment-result?status=failed`,
      meta_data: JSON.stringify({ description, source: "ruqya_system", booking_id }),
      logo_url: process.env.MTJREE_LOGO_URL || `${baseUrl}/logo.png`,
      vendor_name: process.env.MTJREE_VENDOR_NAME || "Ruqya Center"
    };

    console.log("🔔 Creating Mtjree Payment:", JSON.stringify(payload));

    const gatewayRes = await fetch(MTJREE_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
        "Origin": shopUrl,
        "Referer": `${shopUrl}/`
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
        error: `Unexpected response from Mtjree: ${responseText.substring(0, 200)}... Please try again later.`,
        raw_response: responseText.substring(0, 500)
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
