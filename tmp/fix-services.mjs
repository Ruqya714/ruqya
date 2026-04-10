const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";
const headers = {
  "apikey": KEY,
  "Authorization": `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

// 1. Delete old wrong services
console.log("🗑️  حذف الخدمات القديمة الخاطئة...");
const delRes = await fetch(`${SUPABASE_URL}/rest/v1/services?id=neq.00000000-0000-0000-0000-000000000000`, {
  method: "DELETE",
  headers,
});
console.log("   Status:", delRes.status === 204 ? "✅ تم الحذف" : delRes.status);

// 2. Insert the correct single service
console.log("\n📝 إدخال الخدمة الصحيحة...");
const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
  method: "POST",
  headers: { ...headers, "Prefer": "return=representation" },
  body: JSON.stringify({
    name: "الاستشارة",
    description: "مكالمة استشارية مع الراقي لتقييم الحالة وتحديد خطة العلاج المناسبة. يمكنك اختيار استشارة عادية (مواعيد من 3 إلى 7 أيام) أو مستعجلة (خلال 24 ساعة).",
    icon: "Phone",
    duration_minutes: 30,
    is_active: true,
    display_order: 1
  })
});

const data = await insertRes.json();
if (insertRes.ok) {
  console.log("✅ تم إدخال الخدمة الصحيحة بنجاح!");
  console.log(`   → ${data.name}`);
  console.log(`   → ${data.description}`);
  console.log(`   → المدة: ${data.duration_minutes} دقيقة`);
} else {
  console.log("❌ خطأ:", JSON.stringify(data));
}
