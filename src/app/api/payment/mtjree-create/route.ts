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

function extractPhoneCode(phone: string): string {
  if (!phone) return "+90";
  const trimmed = phone.trim();
  for (const len of [4, 3, 2]) {
    for (const code of Object.keys(PHONE_TO_COUNTRY)) {
      if (code.length === len + 1 && trimmed.startsWith(code)) {
        return code;
      }
    }
  }
  return "+90";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id, amount, description, user_name, user_email, user_phone, locale } = body;

    if (!booking_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const API_KEY = process.env.MTJREE_API_KEY || "8e60d8e4-5c6e-4349-82a2-de9ab84e1cb7";
    const MTJREE_V2_URL = "https://mtjree.com/api/v1/payments/initiate";
    const PRODUCTION_DOMAIN = (process.env.MTJREE_SHOP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://ruqyacenter.com").replace(/\/+$/, "");

    // Customer Name
    const nameParts = user_name?.split(" ") || ["Customer", ""];
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || firstName;
    const fullName = `${firstName} ${lastName}`.trim();

    // Customer Country & Address
    const phoneCode = extractPhoneCode(user_phone || "");
    const countryInfo = PHONE_TO_COUNTRY[phoneCode] || { code: "TR", city: "Istanbul", postcode: 34000 };

    // Format phone with leading +
    let formattedPhone = (user_phone || "+905550000000").replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) formattedPhone = "+" + formattedPhone;

    // Mtjree v2 Payload
    const payload = {
      amount: Number(amount),
      currency: "USD",
      merchant_order_id: booking_id,
      customer_name: fullName,
      customer_email: user_email || "customer@ruqyacenter.com",
      customer_phone: formattedPhone,
      return_url: `${PRODUCTION_DOMAIN}/${locale || "ar"}/payment-result?status=paid&booking_id=${booking_id}`,
      cancel_url: `${PRODUCTION_DOMAIN}/${locale || "ar"}/payment-result?status=failed&booking_id=${booking_id}`,
      webhook_url: `${PRODUCTION_DOMAIN}/api/payment/mtjree-webhook`,
      billing_country: countryInfo.code,
      billing_city: countryInfo.city,
      billing_address: `${countryInfo.city}, ${countryInfo.code}`,
      billing_zip: String(countryInfo.postcode),
    };

    console.log("🔔 Creating Mtjree v2 Payment:", JSON.stringify(payload));

    const gatewayRes = await fetch(MTJREE_V2_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MTJREE-API-KEY": API_KEY,
        "Accept": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const responseText = await gatewayRes.text();
    console.log("🔔 Mtjree v2 Raw Response:", responseText);

    let gatewayData: any;
    try {
      gatewayData = JSON.parse(responseText);
    } catch {
      console.error("Mtjree returned non-JSON response:", responseText.substring(0, 500));
      return NextResponse.json({ 
        error: `استجابة غير متوقعة من بوابة الدفع: ${responseText.substring(0, 150)}... يُرجى المحاولة لاحقاً.` 
      }, { status: 502 });
    }

    console.log("🔔 Mtjree v2 Parsed Response:", gatewayData);

    const redirectUrl = gatewayData?.redirect_url || gatewayData?.checkout_url || gatewayData?.payment_url || gatewayData?.url || gatewayData?.data?.redirect_url || gatewayData?.data?.checkout_url;

    if (gatewayRes.ok && redirectUrl) {
      return NextResponse.json({ 
        success: true,
        redirect_url: redirectUrl,
        transaction_id: gatewayData?.transaction_id || gatewayData?.session_id
      });
    } else {
      console.error("Mtjree Gateway Error:", gatewayData);
      return NextResponse.json({ 
        error: gatewayData?.message || gatewayData?.error || "فشل في إنشاء جلسة الدفع من البوابة",
        details: gatewayData
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
