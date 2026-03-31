"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Stepper, MiniCalendar, TimeSlotPicker } from "@/components/ui";
import type { TimeSlot } from "@/components/ui/TimeSlotPicker";
import { formatDate, formatTime } from "@/lib/helpers";
import { CheckCircle, Phone, ArrowLeft, ArrowRight, Calendar } from "lucide-react";

// Country codes for WhatsApp
const COUNTRY_CODES = [
  { code: "+90", country: "تركيا 🇹🇷" },
  { code: "+966", country: "السعودية 🇸🇦" },
  { code: "+971", country: "الإمارات 🇦🇪" },
  { code: "+965", country: "الكويت 🇰🇼" },
  { code: "+974", country: "قطر 🇶🇦" },
  { code: "+973", country: "البحرين 🇧🇭" },
  { code: "+968", country: "عمان 🇴🇲" },
  { code: "+962", country: "الأردن 🇯🇴" },
  { code: "+970", country: "فلسطين 🇵🇸" },
  { code: "+961", country: "لبنان 🇱🇧" },
  { code: "+964", country: "العراق 🇮🇶" },
  { code: "+20", country: "مصر 🇪🇬" },
  { code: "+212", country: "المغرب 🇲🇦" },
  { code: "+213", country: "الجزائر 🇩🇿" },
  { code: "+216", country: "تونس 🇹🇳" },
  { code: "+218", country: "ليبيا 🇱🇾" },
  { code: "+249", country: "السودان 🇸🇩" },
  { code: "+967", country: "اليمن 🇾🇪" },
  { code: "+963", country: "سوريا 🇸🇾" },
  { code: "+1", country: "أمريكا/كندا 🇺🇸" },
  { code: "+44", country: "بريطانيا 🇬🇧" },
  { code: "+49", country: "ألمانيا 🇩🇪" },
  { code: "+33", country: "فرنسا 🇫🇷" },
  { code: "+31", country: "هولندا 🇳🇱" },
  { code: "+46", country: "السويد 🇸🇪" },
  { code: "+60", country: "ماليزيا 🇲🇾" },
  { code: "+62", country: "إندونيسيا 🇮🇩" },
  { code: "+92", country: "باكستان 🇵🇰" },
  { code: "+91", country: "الهند 🇮🇳" },
];

const MARITAL_OPTIONS = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "منفصل/ة" },
  { value: "widowed", label: "أرمل/ة" },
];

const NEED_OPTIONS = [
  { value: "initial_assessment", label: "أبحث عن توجيه أولي وتقييم للحالة" },
  { value: "special_followup", label: "أشعر أن حالتي تحتاج متابعة خاصة" },
  { value: "need_specialist_opinion", label: "غير متأكد وأحتاج رأي المختص" },
];

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
}

interface SlotRow {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  healer_id: string;
  max_capacity: number;
  current_bookings: number;
  healers: { display_name: string } | null;
}

const STEPS = ["الخدمة", "المعلومات", "الموعد", "التأكيد"];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Slot state
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [daySlots, setDaySlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedSlotData, setSelectedSlotData] = useState<{
    date: string;
    start_time: string;
    end_time: string;
    healer_name: string;
  } | null>(null);

  const [form, setForm] = useState({
    service_id: "",
    // Patient fields
    patient_name: "",
    patient_email: "",
    patient_gender: "male" as "male" | "female",
    patient_nationality: "",
    patient_age: "",
    patient_residence: "",
    patient_marital_status: "",
    patient_previous_ruqya: "",
    patient_can_travel: "" as "" | "yes" | "no",
    patient_need_type: "",
    patient_phone_code: "+90",
    patient_phone_number: "",
  });

  const supabase = createClient();

  // Load services
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      setServices(data || []);
      setIsLoading(false);
    }
    load();
  }, [supabase]);

  // Load available dates (slots with remaining capacity)
  const loadAvailableDates = useCallback(async () => {
    if (!form.service_id) return;
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("available_slots")
      .select("slot_date, max_capacity, current_bookings")
      .eq("is_booked", false)
      .gte("slot_date", today)
      .order("slot_date");

    // Only include dates that have at least one slot with remaining capacity
    const availableSlots = data?.filter((s) => s.current_bookings < s.max_capacity) || [];
    const uniqueDates = [...new Set(availableSlots.map((s) => s.slot_date))];
    setAvailableDates(uniqueDates);
  }, [form.service_id, supabase]);

  useEffect(() => {
    if (currentStep === 2 && form.service_id) {
      loadAvailableDates();
      setSelectedDate(null);
      setSelectedSlotId(null);
      setSelectedSlotData(null);
      setDaySlots([]);
    }
  }, [currentStep, form.service_id, loadAvailableDates]);

  // Load time slots for selected date (only with remaining capacity)
  const loadDaySlots = useCallback(
    async (date: string) => {
      setSlotsLoading(true);
      const { data } = await supabase
        .from("available_slots")
        .select("id, slot_date, start_time, end_time, healer_id, max_capacity, current_bookings, healers(display_name)")
        .eq("slot_date", date)
        .eq("is_booked", false)
        .order("start_time");

      // Filter to only show slots that have remaining capacity
      const available = (data as unknown as SlotRow[])?.filter(
        (s) => s.current_bookings < s.max_capacity
      ) || [];

      const slots: TimeSlot[] = available.map((s) => ({
        id: s.id,
        start_time: s.start_time,
        end_time: s.end_time,
        healer_name: s.healers?.display_name || "",
      }));

      setDaySlots(slots);
      setSlotsLoading(false);
    },
    [supabase]
  );

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setSelectedSlotData(null);
    loadDaySlots(date);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    const slot = daySlots.find((s) => s.id === slotId);
    if (slot && selectedDate) {
      setSelectedSlotData({
        date: selectedDate,
        start_time: slot.start_time,
        end_time: slot.end_time,
        healer_name: slot.healer_name,
      });
    }
  };

  const fullPhone = `${form.patient_phone_code} ${form.patient_phone_number}`;

  const handleSubmit = async () => {
    if (!selectedSlotId) return;
    setIsSubmitting(true);

    try {
      // Fetch slot details (healer + capacity)
      const { data: slotData } = await supabase
        .from("available_slots")
        .select("healer_id, max_capacity, current_bookings")
        .eq("id", selectedSlotId)
        .single();

      if (!slotData || slotData.current_bookings >= slotData.max_capacity) {
        alert("عذراً، هذا الموعد لم يعد متاحاً. يرجى اختيار موعد آخر.");
        return;
      }

      const { error: bookingError } = await supabase.from("bookings").insert({
        slot_id: selectedSlotId,
        service_id: form.service_id,
        healer_id: slotData.healer_id || null,
        patient_name: form.patient_name,
        patient_email: form.patient_email || null,
        patient_phone: fullPhone,
        patient_gender: form.patient_gender,
        patient_nationality: form.patient_nationality || null,
        patient_age: form.patient_age ? parseInt(form.patient_age) : null,
        patient_country: form.patient_residence || null,
        patient_marital_status: form.patient_marital_status || null,
        patient_previous_ruqya: form.patient_previous_ruqya || null,
        patient_can_travel: form.patient_can_travel === "yes" ? true : form.patient_can_travel === "no" ? false : null,
        patient_need_type: form.patient_need_type || null,
        patient_notes: form.patient_previous_ruqya || null,
        status: "pending",
        payment_status: "pending",
      });

      if (bookingError) {
        console.error(bookingError);
        alert("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.");
        return;
      }

      // Increment current_bookings and mark as booked if capacity is full
      const newCount = slotData.current_bookings + 1;
      await supabase
        .from("available_slots")
        .update({
          current_bookings: newCount,
          is_booked: newCount >= slotData.max_capacity,
        })
        .eq("id", selectedSlotId);

      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERS ---

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-text-secondary mt-4">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-border p-8 lg:p-12">
          <div className="w-20 h-20 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            تم تسجيل حالتك بنجاح!
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            شكراً لك. سيتم التواصل معك قريباً من قبل أحد المتخصصين لتأكيد الموعد.
          </p>

          {selectedSlotData && (
            <div className="bg-primary/5 rounded-xl p-4 mb-6 inline-block text-sm">
              <p className="font-semibold text-primary mb-1">تفاصيل الموعد</p>
              <p className="text-text-secondary">
                📅 {formatDate(selectedSlotData.date)} — 🕐{" "}
                {formatTime(selectedSlotData.start_time)} إلى{" "}
                {formatTime(selectedSlotData.end_time)}
              </p>
              {selectedSlotData.healer_name && (
                <p className="text-text-secondary mt-0.5">
                  👤 {selectedSlotData.healer_name}
                </p>
              )}
            </div>
          )}

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all"
          >
            العودة للرئيسية
          </a>
          <p className="text-xs text-text-muted mt-6">نسأل الله لك الشفاء العاجل 🤲</p>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!form.service_id;
      case 1: return !!form.patient_name && !!form.patient_phone_number && !!form.patient_email;
      case 2: return !!selectedSlotId;
      default: return true;
    }
  };

  const selectedService = services.find((s) => s.id === form.service_id);

  const maritalLabel = MARITAL_OPTIONS.find((o) => o.value === form.patient_marital_status)?.label;
  const needLabel = NEED_OPTIONS.find((o) => o.value === form.patient_need_type)?.label;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">سجّل حالتك</h1>
          <p className="text-gray-200 max-w-xl mx-auto">
            اختر الخدمة والموعد المناسب واملأ بياناتك لنتمكن من مساعدتك
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
            {/* ========== Step 0: Service ========== */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-4">اختر الخدمة</h2>
                <div className="space-y-3">
                  {services.length === 0 ? (
                    <p className="text-sm text-text-secondary text-center py-6">لا توجد خدمات متاحة حالياً</p>
                  ) : (
                    services.map((s) => (
                      <label
                        key={s.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          form.service_id === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <input type="radio" name="service" value={s.id} checked={form.service_id === s.id} onChange={(e) => setForm({ ...form, service_id: e.target.value })} className="mt-1 accent-primary" />
                        <div>
                          <p className="font-semibold text-text-primary">{s.name}</p>
                          <p className="text-sm text-text-secondary mt-1">{s.description}</p>
                          <p className="text-xs text-text-muted mt-1">⏱️ {s.duration_minutes} دقيقة</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========== Step 1: Patient Info ========== */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-5">بياناتك الشخصية</h2>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      البريد الإلكتروني <span className="text-error">*</span>
                    </label>
                    <input type="email" required value={form.patient_email} onChange={(e) => setForm({ ...form, patient_email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="example@email.com" dir="ltr" />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      الاسم الكامل <span className="text-error">*</span>
                    </label>
                    <input required value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="أدخل اسمك الكامل" />
                  </div>

                  {/* Gender + Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">الجنس</label>
                      <select value={form.patient_gender} onChange={(e) => setForm({ ...form, patient_gender: e.target.value as "male" | "female" })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">العمر</label>
                      <input type="number" value={form.patient_age} onChange={(e) => setForm({ ...form, patient_age: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: 30" />
                    </div>
                  </div>

                  {/* Nationality + Residence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">الجنسية</label>
                      <input value={form.patient_nationality} onChange={(e) => setForm({ ...form, patient_nationality: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: سعودي" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">الإقامة الحالية</label>
                      <input value={form.patient_residence} onChange={(e) => setForm({ ...form, patient_residence: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: إسطنبول، تركيا" />
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">الحالة الاجتماعية</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MARITAL_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer text-sm transition-all ${
                            form.patient_marital_status === opt.value ? "border-primary bg-primary/5 text-primary font-medium" : "border-border text-text-secondary hover:border-primary/30"
                          }`}
                        >
                          <input type="radio" name="marital" value={opt.value} checked={form.patient_marital_status === opt.value} onChange={(e) => setForm({ ...form, patient_marital_status: e.target.value })} className="sr-only" />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Previous Ruqya + Problems */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      هل ذهبت من قبل إلى رقاة؟ وما هي المشاكل التي تعاني منها؟
                    </label>
                    <textarea rows={3} value={form.patient_previous_ruqya} onChange={(e) => setForm({ ...form, patient_previous_ruqya: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="اكتب تجربتك السابقة والأعراض التي تعاني منها..." />
                  </div>

                  {/* Can Travel */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">هل لديك إمكانية السفر؟</label>
                    <div className="flex gap-3">
                      {[
                        { value: "yes", label: "نعم" },
                        { value: "no", label: "لا" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer text-sm transition-all ${
                            form.patient_can_travel === opt.value ? "border-primary bg-primary/5 text-primary font-medium" : "border-border text-text-secondary hover:border-primary/30"
                          }`}
                        >
                          <input type="radio" name="travel" value={opt.value} checked={form.patient_can_travel === opt.value} onChange={(e) => setForm({ ...form, patient_can_travel: e.target.value as "yes" | "no" })} className="sr-only" />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Need Type */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">أي وصف أقرب لحاجتك حالياً؟</label>
                    <div className="space-y-2">
                      {NEED_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer text-sm transition-all ${
                            form.patient_need_type === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                          }`}
                        >
                          <input type="radio" name="need" value={opt.value} checked={form.patient_need_type === opt.value} onChange={(e) => setForm({ ...form, patient_need_type: e.target.value })} className="accent-primary flex-shrink-0" />
                          <span className={form.patient_need_type === opt.value ? "text-primary font-medium" : "text-text-secondary"}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Number with Country Code */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      رقم الواتساب <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <select
                        value={form.patient_phone_code}
                        onChange={(e) => setForm({ ...form, patient_phone_code: e.target.value })}
                        className="w-[140px] px-2 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white flex-shrink-0"
                      >
                        {COUNTRY_CODES.map((cc) => (
                          <option key={cc.code} value={cc.code}>
                            {cc.code} {cc.country}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        type="tel"
                        value={form.patient_phone_number}
                        onChange={(e) => setForm({ ...form, patient_phone_number: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="5XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== Step 2: Date & Slot ========== */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  اختر الموعد
                </h2>
                {availableDates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar size={40} className="text-text-muted mx-auto mb-3" />
                    <p className="text-sm text-text-secondary mb-1">لا توجد مواعيد متاحة حالياً</p>
                    <p className="text-xs text-text-muted">يرجى التواصل معنا مباشرة أو المحاولة لاحقاً</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <MiniCalendar availableDates={availableDates} selectedDate={selectedDate} onSelectDate={handleDateSelect} />
                    {selectedDate && (
                      <div>
                        <p className="text-xs text-text-muted mb-2">
                          المواعيد المتاحة يوم <span className="font-medium text-text-secondary">{formatDate(selectedDate)}</span>
                        </p>
                        <TimeSlotPicker slots={daySlots} selectedSlotId={selectedSlotId} onSelectSlot={handleSlotSelect} isLoading={slotsLoading} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========== Step 3: Confirmation ========== */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-4">مراجعة الطلب</h2>
                <div className="space-y-3 bg-bg rounded-xl p-5">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">الخدمة</span>
                    <span className="text-sm font-medium text-text-primary">{selectedService?.name}</span>
                  </div>

                  {selectedSlotData && (
                    <>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-sm text-text-secondary">التاريخ</span>
                        <span className="text-sm font-medium text-text-primary">{formatDate(selectedSlotData.date)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-sm text-text-secondary">الوقت</span>
                        <span className="text-sm font-medium text-text-primary">{formatTime(selectedSlotData.start_time)} — {formatTime(selectedSlotData.end_time)}</span>
                      </div>
                      {selectedSlotData.healer_name && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-sm text-text-secondary">المعالج</span>
                          <span className="text-sm font-medium text-text-primary">{selectedSlotData.healer_name}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">الاسم</span>
                    <span className="text-sm font-medium text-text-primary">{form.patient_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">البريد</span>
                    <span className="text-sm font-medium text-text-primary" dir="ltr">{form.patient_email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">الواتساب</span>
                    <span className="text-sm font-medium text-text-primary" dir="ltr">{fullPhone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">الجنس</span>
                    <span className="text-sm font-medium text-text-primary">{form.patient_gender === "male" ? "ذكر" : "أنثى"}</span>
                  </div>
                  {form.patient_nationality && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-text-secondary">الجنسية</span>
                      <span className="text-sm font-medium text-text-primary">{form.patient_nationality}</span>
                    </div>
                  )}
                  {form.patient_residence && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-text-secondary">الإقامة</span>
                      <span className="text-sm font-medium text-text-primary">{form.patient_residence}</span>
                    </div>
                  )}
                  {maritalLabel && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-text-secondary">الحالة الاجتماعية</span>
                      <span className="text-sm font-medium text-text-primary">{maritalLabel}</span>
                    </div>
                  )}
                  {form.patient_can_travel && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-text-secondary">إمكانية السفر</span>
                      <span className="text-sm font-medium text-text-primary">{form.patient_can_travel === "yes" ? "نعم" : "لا"}</span>
                    </div>
                  )}
                  {needLabel && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-text-secondary">وصف الحاجة</span>
                      <span className="text-sm font-medium text-text-primary text-left max-w-[200px]">{needLabel}</span>
                    </div>
                  )}
                  {form.patient_previous_ruqya && (
                    <div className="pt-2">
                      <span className="text-sm text-text-secondary block mb-1">التجربة السابقة والأعراض</span>
                      <p className="text-sm text-text-primary">{form.patient_previous_ruqya}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700">
                    💳 بوابة الدفع ستُضاف لاحقاً — حالياً يتم تأكيد الحجز مباشرة وسيتم التواصل معك للدفع.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 0 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-gray-50 transition-colors">
                  <ArrowRight size={16} />
                  السابق
                </button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  التالي
                  <ArrowLeft size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-light disabled:opacity-50 transition-all">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Phone size={16} />
                      تأكيد الحجز
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
