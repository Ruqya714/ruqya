const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";
const headers = { "apikey": KEY, "Authorization": "Bearer " + KEY };

async function check(table) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
  return await r.json();
}

const services = await check("services");
const healers = await check("healers");
const testimonials = await check("testimonials");
const settings = await check("site_settings");
const articles = await check("articles");
const faqs = await check("faqs");
const slots = await check("available_slots");
const bookings = await check("bookings");

console.log("╔══════════════════════════════════════════════════╗");
console.log("║   📋 تقرير المحتوى الناقص في الموقع الجديد      ║");
console.log("╚══════════════════════════════════════════════════╝\n");

console.log("🛎️  الخدمات (Services):", services.length === 0 ? "❌ فارغة" : `✅ ${services.length} خدمة`);
if (services.length > 0) services.forEach(s => console.log("   →", s.name));

console.log("🧑‍⚕️ المعالجين (Healers):", healers.length === 0 ? "❌ فارغ" : `✅ ${healers.length} معالج`);
if (healers.length > 0) healers.forEach(h => console.log("   →", h.display_name, "-", h.title));

console.log("⭐ الشهادات (Testimonials):", testimonials.length === 0 ? "❌ فارغة" : `✅ ${testimonials.length} شهادة`);

console.log("⚙️  إعدادات الموقع (Settings):", settings.length === 0 ? "❌ فارغة" : `✅ ${settings.length} إعداد`);
if (settings.length > 0) settings.forEach(s => console.log("   →", s.key, "=", (s.value || "").substring(0, 50)));

console.log("📰 المقالات (Articles):", articles.length === 0 ? "❌ فارغة" : `✅ ${articles.length} مقالة`);
if (articles.length > 0) articles.forEach(a => console.log("   →", a.title, "—", a.is_published ? "منشورة" : "مسودة"));

console.log("❓ الأسئلة الشائعة (FAQs):", faqs.length === 0 ? "❌ فارغة" : `✅ ${faqs.length} سؤال`);

console.log("📅 المواعيد (Slots):", slots.length === 0 ? "❌ فارغة" : `✅ ${slots.length} موعد`);

console.log("📋 الحجوزات (Bookings):", bookings.length, "(طبيعي أن يكون 0)");

console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║         📝 قائمة المهام لتجهيز الموقع           ║");
console.log("╚══════════════════════════════════════════════════╝\n");

let i = 1;
if (services.length === 0) console.log(`  ${i++}️⃣  أضف الخدمات (رقية، استشارة، متابعة...) من: لوحة التحكم ← إدارة الخدمات`);
if (healers.length === 0) console.log(`  ${i++}️⃣  أضف المعالجين + صورهم من: لوحة التحكم ← إدارة المعالجين`);
if (settings.length === 0) console.log(`  ${i++}️⃣  أدخل رقم الواتساب والسوشال ميديا من: لوحة التحكم ← إعدادات الموقع`);
if (slots.length === 0) console.log(`  ${i++}️⃣  أنشئ مواعيد متاحة للحجز من: لوحة التحكم ← إدارة المواعيد`);
if (testimonials.length === 0) console.log(`  ${i++}️⃣  أضف شهادات المرضى (اختياري) من: لوحة التحكم ← الشهادات`);
if (i === 1) console.log("  🎉 كل شيء جاهز!");
console.log("");
