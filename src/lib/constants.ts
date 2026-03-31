// Site-wide constants
export const SITE_NAME = "مركز الرقية بكلام الرحمن لرد كيد الشيطان";
export const SITE_NAME_SHORT = "مركز الرقية بكلام الرحمن";
export const SITE_DESCRIPTION =
  "مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول";

// Booking statuses
export const BOOKING_STATUSES = {
  pending: { label: "بانتظار التأكيد", color: "warning" },
  confirmed: { label: "مؤكد", color: "info" },
  completed: { label: "مكتمل", color: "success" },
  cancelled: { label: "ملغي", color: "error" },
  no_show: { label: "لم يحضر", color: "error" },
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  pending: { label: "بانتظار الدفع", color: "warning" },
  paid: { label: "مدفوع", color: "success" },
  refunded: { label: "مسترد", color: "error" },
} as const;

// Article categories
export const ARTICLE_CATEGORIES = {
  article: { label: "مقال", color: "primary" },
  healing_story: { label: "قصة شفاء", color: "accent" },
  announcement: { label: "إعلان", color: "info" },
} as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;

// Navigation links (public)
export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "خدماتنا" },
  { href: "/treatment-journey", label: "الرحلة العلاجية" },
  { href: "/blog", label: "المقالات" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "اتصل بنا" },
] as const;

// Admin navigation
export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "الرئيسية", icon: "LayoutDashboard" },
  { href: "/admin/bookings", label: "الحجوزات", icon: "CalendarCheck" },
  { href: "/admin/slots", label: "المواعيد", icon: "Clock" },
  { href: "/admin/healers", label: "المعالجون", icon: "Users" },
  { href: "/admin/services", label: "الخدمات", icon: "Briefcase" },
  { href: "/admin/articles", label: "المقالات", icon: "FileText" },
  { href: "/admin/testimonials", label: "الشهادات", icon: "MessageSquare" },
  { href: "/admin/faqs", label: "الأسئلة الشائعة", icon: "HelpCircle" },
  { href: "/admin/settings", label: "الإعدادات", icon: "Settings" },
] as const;

// Healer navigation
export const HEALER_NAV_LINKS = [
  { href: "/healer", label: "الرئيسية", icon: "LayoutDashboard" },
  { href: "/healer/bookings", label: "حجوزاتي", icon: "CalendarCheck" },
  { href: "/healer/profile", label: "ملفي الشخصي", icon: "User" },
] as const;
