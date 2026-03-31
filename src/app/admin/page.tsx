import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CalendarCheck, Clock, Users, Briefcase, TrendingUp, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { BOOKING_STATUSES } from "@/lib/constants";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [bookingsToday, pendingBookings, totalBookings, healersCount, recentBookings] =
    await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", today + "T00:00:00"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("healers").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id, patient_name, patient_phone, status, payment_status, created_at, services(name), healers(profiles(full_name))")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const stats = [
    { label: "حجوزات اليوم", value: bookingsToday.count || 0, icon: <CalendarCheck size={22} />, color: "primary" },
    { label: "بانتظار التأكيد", value: pendingBookings.count || 0, icon: <Clock size={22} />, color: "warning" },
    { label: "إجمالي الحجوزات", value: totalBookings.count || 0, icon: <TrendingUp size={22} />, color: "accent" },
    { label: "المعالجون", value: healersCount.count || 0, icon: <Users size={22} />, color: "success" },
  ];

  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-50 text-amber-600",
    accent: "bg-accent/10 text-accent-dark",
    success: "bg-green-50 text-green-600",
  };

  const statusBadge: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    completed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
    no_show: "bg-gray-100 text-gray-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">لوحة التحكم</h1>
          <p className="text-text-secondary mt-1">مرحباً بك — هذه نظرة عامة على النظام</p>
        </div>
        <p className="text-sm text-text-muted hidden sm:block">{formatDate(new Date())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">آخر الحجوزات</h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
            عرض الكل <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">المريض</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">الخدمة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(!recentBookings.data || recentBookings.data.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                    لا توجد حجوزات حتى الآن
                  </td>
                </tr>
              ) : (
                recentBookings.data.map((b: Record<string, unknown>) => (
                  <tr key={b.id as string} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{b.patient_name as string}</p>
                      <p className="text-xs text-text-muted" dir="ltr">{b.patient_phone as string}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {(b.services as Record<string, unknown>)?.name as string || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[b.status as string] || "bg-gray-100"}`}>
                        {BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES]?.label || b.status as string}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {formatDate(b.created_at as string)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {[
          { href: "/admin/bookings", label: "إدارة الحجوزات", icon: <CalendarCheck size={18} /> },
          { href: "/admin/healers", label: "إدارة المعالجين", icon: <Users size={18} /> },
          { href: "/admin/services", label: "إدارة الخدمات", icon: <Briefcase size={18} /> },
          { href: "/admin/articles", label: "إدارة المقالات", icon: <Briefcase size={18} /> },
        ].map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="flex items-center gap-2 p-3 rounded-lg bg-white border border-border text-sm text-text-secondary hover:text-primary hover:border-primary/20 transition-all"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
