/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, Badge, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/helpers";
import { BOOKING_STATUSES } from "@/lib/constants";
import { Eye, CalendarCheck, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

interface Booking {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  patient_age: number;
  patient_gender: string;
  status: string;
  payment_status: string;
  patient_notes: string;
  created_at: string;
  services: { name: string } | null;
}

export default function HealerBookingsPage() {
  const t = useTranslations("Healer");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: healer } = await supabase.from("healers").select("id").eq("profile_id", user.id).single();
    if (!healer) { setIsLoading(false); return; }

    let query = supabase.from("bookings").select("*, services(name)").eq("healer_id", healer.id).order("created_at", { ascending: false });
    if (statusFilter !== "all") query = query.eq("status", statusFilter);

    const { data } = await query;
    setBookings((data as unknown as Booking[]) || []);
    setIsLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const statusBadge: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
    pending: "warning", confirmed: "info", completed: "success", cancelled: "error", no_show: "error",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t("myBookings")}</h1>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">{t("allStatuses")}</option>
            {Object.entries(BOOKING_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">{t("patient")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary hidden sm:table-cell">{t("service")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">{t("status")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary hidden md:table-cell">{t("date")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 text-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={5}><EmptyState icon={<CalendarCheck size={28} className="text-text-secondary" />} title={t("noBookings")} /></td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3"><p className="font-medium">{b.patient_name}</p><p className="text-xs text-text-muted" dir="ltr">{b.patient_phone}</p></td>
                  <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{b.services?.name || "—"}</td>
                  <td className="px-4 py-3"><Badge variant={statusBadge[b.status] || "default"}>{BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES]?.label || b.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">{formatDate(b.created_at)}</td>
                  <td className="px-4 py-3"><button onClick={() => setSelected(b)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-primary"><Eye size={16} /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t("bookingDetails")} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-text-muted mb-1">{t("name")}</p><p className="font-medium">{selected.patient_name}</p></div>
              <div><p className="text-xs text-text-muted mb-1">{t("phone")}</p><p className="font-medium" dir="ltr">{selected.patient_phone}</p></div>
              <div><p className="text-xs text-text-muted mb-1">{t("gender")}</p><p className="font-medium">{selected.patient_gender === "male" ? t("male") : t("female")}</p></div>
              <div><p className="text-xs text-text-muted mb-1">{t("age")}</p><p className="font-medium">{selected.patient_age || "—"}</p></div>
            </div>
            {selected.patient_notes && <div className="bg-bg rounded-lg p-4"><p className="text-xs text-text-muted mb-1">{t("previousNotes")}</p><p className="text-sm whitespace-pre-wrap">{selected.patient_notes}</p></div>}
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">{t("updateStatus")}</label>
              <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {Object.entries(BOOKING_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
