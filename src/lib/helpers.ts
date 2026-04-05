/**
 * Format a date to Arabic locale string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time string (HH:MM:SS) to Arabic readable time
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const period = h >= 12 ? "مساءً" : "صباحاً";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Generate a URL-friendly slug from Arabic text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Get status badge variant based on status type
 */
export function getStatusColor(
  status: string
): "success" | "warning" | "error" | "info" | "default" {
  const statusMap: Record<string, "success" | "warning" | "error" | "info"> = {
    completed: "success",
    paid: "success",
    confirmed: "info",
    pending: "warning",
    cancelled: "error",
    no_show: "error",
    refunded: "error",
  };
  return statusMap[status] || "default";
}

/**
 * Format a phone number
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\+?\d{1,3})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
}

/**
 * Calculate age from birth date
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(date);
}
