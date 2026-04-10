import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/helpers";
import { Mail, Phone, User, MessageCircle, Clock } from "lucide-react";

export const metadata = {
  title: "البريد الوارد | مركز الرقية",
};

export default async function InboxPage() {
  const supabase = await createClient();

  // Mark all unread messages as read automatically
  await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("is_read", false);

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في جلب البيانات</h1>
        <p className="text-text-secondary">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">البريد الوارد</h1>
          <p className="text-text-secondary mt-1">
            جميع الرسائل القادمة من نموذج "اتصل بنا" في الموقع
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hidden sm:inline-flex items-center gap-2">
          <Mail size={18} />
          {messages?.length || 0} رسالة
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        {(!messages || messages.length === 0) ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Mail size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">لا توجد رسائل</h3>
            <p className="text-sm text-text-secondary mt-1">صندوق الوارد فارغ حالياً.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg: any) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-text-primary flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      {msg.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors" dir="ltr">
                        <Mail size={14} />
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <a href={`tel:${msg.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-primary transition-colors" dir="ltr">
                          <Phone size={14} />
                          {msg.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-text-muted flex-shrink-0 flex items-center gap-1.5 bg-bg px-3 py-1.5 rounded-lg border border-border">
                    <Clock size={14} />
                    <span dir="ltr">{new Date(msg.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
                
                <div className="bg-bg p-5 rounded-lg border border-border/50 relative">
                  <div className="absolute top-4 start-4 text-primary/10">
                    <MessageCircle size={24} />
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed relative z-10 ms-8">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
