"use server";

function formatDateWithArabicDay(dateStr: string): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const date = new Date(dateStr + "T00:00:00");
  const dayName = days[date.getDay()];
  return `${dayName} ${dateStr}`;
}

function formatTimeTo12h(timeStr: string): string {
  return timeStr.split(" - ").map((t) => {
    const parts = t.trim().split(":");
    const h = parseInt(parts[0]);
    const m = parts[1] || "00";
    const period = h >= 12 ? "م" : "ص";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
  }).join(" - ");
}

export async function sendBookingEmailAction(bookingDetails: {
  patient_name: string;
  patient_email?: string | null;
  patient_phone: string;
  service_name: string;
  date: string;
  time: string;
  healer_name: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const formattedDate = formatDateWithArabicDay(bookingDetails.date);
  const formattedTime = formatTimeTo12h(bookingDetails.time);

  try {
    const { sendEmail } = await import("@/lib/email");

    // 1. Send Email to Admin
    if (adminEmail) {
      const adminHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b5c47;">يوجد حجز موعد جديد 📅</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">المريض</td><td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.patient_name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الهاتف</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">${bookingDetails.patient_phone}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الخدمة المطلوبة</td><td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.service_name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">تاريخ الموعد</td><td style="padding: 10px; border: 1px solid #ddd;">${formattedDate}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الوقت</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">${formattedTime}</td></tr>
          </table>
          <p style="margin-top: 20px;">يرجى الدخول للوحة التحكم للاعتماد.</p>
        </div>
      `;
      await sendEmail({
        to: adminEmail,
        subject: `حجز جديد من: ${bookingDetails.patient_name}`,
        html: adminHtml
      });
    }

    // 2. Send Email to Patient
    if (bookingDetails.patient_email) {
      const patientHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b5c47;">السلام عليكم ${bookingDetails.patient_name}،</h2>
          <p>تم استلام طلب حجزك بنجاح في مركز الرقية. نحن بصدد مراجعة الطلب وسنقوم بتأكيده قريباً.</p>
          <br>
          <h3 style="color: #333;">تفاصيل الموعد المبدئي:</h3>
          <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
            <li><strong>الخدمة:</strong> ${bookingDetails.service_name}</li>
            <li><strong>التاريخ:</strong> ${formattedDate}</li>
            <li><strong>الوقت:</strong> ${formattedTime}</li>
            <li><strong>المعالج:</strong> ${bookingDetails.healer_name || "سيتم التعيين من قِبل الإدارة"}</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 13px; color: #777;">هذه رسالة آلية، يرجى عدم الرد عليها. للتواصل المباشر يرجى استخدام أرقام المركز الرسمية.</p>
        </div>
      `;
      await sendEmail({
        to: bookingDetails.patient_email,
        subject: `تأكيد تقديم طلب حجز موعد - مركز الرقية`,
        html: patientHtml
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Booking email sending failed:", error);
    return { success: false, error };
  }
}
