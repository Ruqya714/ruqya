import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id, amount, description, user_name, user_email, user_phone, locale } = body;

    const profileId = process.env.CLICKPAY_PROFILE_ID;
    const serverKey = process.env.CLICKPAY_SERVER_KEY;
    const endpoint = process.env.CLICKPAY_ENDPOINT || "https://secure.clickpay.com.sa/payment/request";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!profileId || !serverKey) {
      return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 500 });
    }

    const payload = {
      profile_id: profileId,
      tran_type: "sale",
      tran_class: "ecom",
      cart_id: booking_id,
      cart_amount: amount,
      cart_currency: "USD",
      cart_description: description || "Booking Payment",
      paypage_lang: locale === 'en' ? 'en' : 'ar',
      hide_shipping: true,
      return: `${baseUrl}/${locale || 'ar'}/payment-result`,
      callback: `${baseUrl}/api/payment/webhook`
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": serverKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.redirect_url) {
      return NextResponse.json({ redirect_url: data.redirect_url });
    } else {
      console.error("ClickPay Error:", data);
      return NextResponse.json({ error: data.message || "Failed to initiate payment" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
