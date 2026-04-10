import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/helpers";
import { BOOKING_STATUSES } from "@/lib/constants";
import { CalendarCheck, Clock, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function HealerDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Healer" });
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: healer } = await supabase.from("healers").select("id").eq("profile_id", user.id).single();
  
  // Provide defensive return if accessing without a proper healer record
  if (!healer) {
    return (
      <div className="py-12 text-center text-text-secondary">
        {t("noAccess") || "ليس لديك صلاحية الدخول كمعالج في النظام."}
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const [todayRes, upcomingRes, totalRes, recentRes] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("healer_id", healer.id).gte("created_at", today + "T00:00:00"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("healer_id", healer.id).in("status", ["pending", "confirmed"]),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("healer_id", healer.id),
    supabase.from("bookings").select("id, patient_name, patient_phone, status, notes, created_at, services(name)").eq("healer_id", healer.id).order("created_at", { ascending: false }).limit(10),
  ]);

  const stats = { 
    today: todayRes.count || 0, 
    upcoming: upcomingRes.count || 0, 
    total: totalRes.count || 0 
  };
  
  const recentBookings = recentRes.data || [];

  const statusBadge: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
    pending: "warning", confirmed: "info", completed: "success", cancelled: "error", no_show: "error",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">{t("dashTitle")}</h1>
      <p className="text-text-secondary mb-8">{t("dashWelcome")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: t("todayBookings"), value: stats.today, icon: <CalendarCheck size={22} />, color: "bg-primary/10 text-primary" },
          { label: t("upcomingBookings"), value: stats.upcoming, icon: <Clock size={22} />, color: "bg-amber-50 text-amber-600" },
          { label: t("totalBookings"), value: stats.total, icon: <TrendingUp size={22} />, color: "bg-accent/10 text-accent-dark" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">{t("recentBookings")}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary">{t("patient")}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary hidden sm:table-cell">{t("service")}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary">{t("status")}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary hidden md:table-cell">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentBookings.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-text-secondary">{t("noBookings")}</td></tr>
              ) : (
                recentBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{b.patient_name}</p>
                      <p className="text-xs text-text-muted" dir="ltr">{b.patient_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{b.services?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge[b.status] || "default"}>
                        {BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES]?.label || b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">{formatDate(b.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
