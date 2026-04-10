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
      .select("*, services(name), healers(display_name, email), available_slots(slot_date, start_time, end_time)")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Booking not found for emails.", error);
      return { success: false };
    }

    const serviceName = booking.services?.name || "غير محدد";
    const slotDate = booking.available_slots?.slot_date ? formatDate(booking.available_slots.slot_date) : "غير محدد";
    const healerEmail = booking.healers?.email;
    const healerName = booking.healers?.display_name || "غير محدد";

    // 2. Notifying Healer (If assigned and has email)
    if (healerEmail) {
      const healerHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b5c47;">السلام عليكم ${healerName}، لديك موعد جديد 📅</h2>
          <p>تم تعيين موعد جديد إليك من قبل الإدارة، وهذه هي التفاصيل:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">المريض</td><td style="padding: 10px; border: 1px solid #ddd;">${booking.patient_name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الخدمة</td><td style="padding: 10px; border: 1px solid #ddd;">${serviceName}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">التاريخ</td><td style="padding: 10px; border: 1px solid #ddd;">${slotDate}</td></tr>
          </table>
          <p style="margin-top: 30px;">يرجى الدخول للوحة المعالج للاطلاع على التفاصيل ومتابعة الحجز.</p>
        </div>
      `;

      await sendEmail({
        to: healerEmail,
        subject: `إشعار موعد جديد: ${booking.patient_name}`,
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
            نسأل الله لك وتماً العافية والشفاء. يرجى التواجد/الاستعداد قبل موعد الجلسة بـ 10 دقائق.
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
