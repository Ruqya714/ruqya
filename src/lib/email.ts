import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!resend) {
    console.warn("شريط التنبيهات: مفتاح RESEND_API_KEY غير موجود في ملف البيئة. تم تجاهل إرسال الإيميل.");
    return { success: true }; 
  }

  try {
    const data = await resend.emails.send({
      from: "مركز الرقية بكلام الرحمن <noreply@ruqyacenter.com>", 
      to: [to],
      subject: subject,
      html: html,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("خطأ أثناء إرسال الإيميل عبر Resend:", error);
    return { success: false, error };
  }
};
