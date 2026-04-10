"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, error: "Missing required fields" };
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase.from("contact_messages").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    if (insertError) {
      console.error("Error inserting contact message:", insertError);
      return { success: false, error: "Database error" };
    }

    // Insert successful! Send email notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      // Lazy load to avoid import issues if resend not fully configured
      const { sendEmail } = await import("@/lib/email");
      
      const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0b5c47;">لديك رسالة جديدة من الموقع 📬</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">الاسم</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${formData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">البريد</td>
            <td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">${formData.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الهاتف</td>
            <td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">${formData.phone || "غير متوفر"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الرسالة</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${formData.message}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">يمكنك عرض الرسالة والتواصل معه من خلال لوحة التحكم الخاصة بالمركز.</p>
      </div>`;

      await sendEmail({
        to: adminEmail,
        subject: `رسالة جديدة من: ${formData.name}`,
        html: emailHtml
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Server Action Exception:", error);
    return { success: false, error: "Internal server error" };
  }
}
