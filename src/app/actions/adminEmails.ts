"use server";

import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/helpers";

export async function notifyHealerAssignedAndPatientConfirmed(bookingId: string) {
  try {
    const supabase = await createClient();
    const { sendEmail } = await import("@/lib/email");

    // 1. Get full booking data
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, services(name), healers(display_name, profile_id), available_slots(slot_date, start_time, end_time)")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Booking not found for emails.", error);
      return { success: false };
    }

    const serviceName = booking.services?.name || "غير محدد";
    const slotDate = booking.available_slots?.slot_date ? formatDate(booking.available_slots.slot_date) : "غير محدد";
    const slotTime = booking.available_slots?.start_time
      ? `${booking.available_slots.start_time.slice(0, 5)} - ${booking.available_slots.end_time?.slice(0, 5) || ""}`
      : "";
    const healerName = booking.healers?.display_name || "غير محدد";

    // Get healer email from profiles table (linked via profile_id)
    let healerEmail: string | null = null;
    if (booking.healers?.profile_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", booking.healers.profile_id)
        .single();

      if (profile) {
        // Get the actual email from auth.users via admin API
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const adminSupa = createAdminClient();
        const { data: authUser } = await adminSupa.auth.admin.getUserById(profile.id);
        healerEmail = authUser?.user?.email || null;
      }
    }

    // 2. Notifying Healer (If assigned and has email)
    if (healerEmail) {
      const healerHtml = `
        <div dir="rtl" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
          <div style="background: linear-gradient(135deg, #0b5c47, #0a7d5a); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📅 لديك موعد جديد</h2>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">مركز الرقية بكلام الرحمن</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e8e8e8; border-top: none;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">السلام عليكم ورحمة الله <strong>${healerName}</strong>،</p>
            <p style="color: #555; line-height: 1.7;">تم تعيين موعد جديد إليك من قبل الإدارة. يرجى الاطلاع على التفاصيل والاستعداد للجلسة:</p>
            
            <div style="background: #f8faf9; border: 1px solid #e0e8e4; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; width: 90px; vertical-align: top;">المريض</td>
                  <td style="padding: 10px 5px; color: #333; font-weight: 600; font-size: 15px;">${booking.patient_name}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; vertical-align: top;">الهاتف</td>
                  <td style="padding: 10px 5px; color: #333; font-size: 15px;" dir="ltr">${booking.patient_phone || "—"}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; vertical-align: top;">الخدمة</td>
                  <td style="padding: 10px 5px; color: #333; font-size: 15px;">${serviceName}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; vertical-align: top;">التاريخ</td>
                  <td style="padding: 10px 5px; color: #0b5c47; font-weight: 600; font-size: 15px;">📅 ${slotDate}</td>
                </tr>
                ${slotTime ? `
                <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; vertical-align: top;">الوقت</td>
                  <td style="padding: 10px 5px; color: #0b5c47; font-weight: 600; font-size: 15px;" dir="ltr">🕐 ${slotTime}</td>
                </tr>` : ""}
                ${booking.patient_notes ? `
                <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                <tr>
                  <td style="padding: 10px 5px; color: #888; font-size: 13px; vertical-align: top;">ملاحظات</td>
                  <td style="padding: 10px 5px; color: #555; font-size: 14px;">${booking.patient_notes}</td>
                </tr>` : ""}
              </table>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://ruqyacenter.com/healer" style="display: inline-block; background: #0b5c47; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">الدخول للوحة المعالج</a>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e8e8e8; border-top: none;">
            <p style="color: #999; font-size: 12px; margin: 0;">هذه رسالة آلية من مركز الرقية بكلام الرحمن — يرجى عدم الرد عليها</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: healerEmail,
        subject: `📅 موعد جديد: ${booking.patient_name} — ${slotDate}`,
        html: healerHtml
      });
    }

    // 3. Notifying Patient (Confirming the booking)
    if (booking.patient_email && booking.status === "confirmed") {
      const patientHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b5c47;">أهلاً بك ${booking.patient_name}،</h2>
          <p>يسعدنا إخبارك بأنه <strong>تم تأكيد موعدك</strong> بنجاح في مركز الرقية.</p>
          <br>
          <h3 style="color: #333;">تفاصيل الموعد النهائي:</h3>
          <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
            <li><strong>الخدمة:</strong> ${serviceName}</li>
            <li><strong>التاريخ:</strong> ${slotDate}</li>
            <li><strong>المعالج المسؤول:</strong> ${healerName}</li>
          </ul>
          <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px;">
            نسأل الله لك العافية والشفاء. يرجى التواجد/الاستعداد قبل موعد الجلسة بـ 10 دقائق.
          </div>
        </div>
      `;

      await sendEmail({
        to: booking.patient_email,
        subject: `تأكيد موعد الجلسة - مركز الرقية`,
        html: patientHtml
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error in adminEmails actions:", error);
    return { success: false, error };
  }
}
