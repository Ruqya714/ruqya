const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";

const res = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
  method: "POST",
  headers: {
    "apikey": KEY,
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify([
    {
      name: "استشارة صوتية",
      description: "مكالمة استشارية صوتية مع الراقي لتقييم الحالة وتحديد خطة العلاج المناسبة",
      icon: "Phone",
      duration_minutes: 30,
      is_active: true,
      display_order: 1
    },
    {
      name: "استشارة مرئية",
      description: "جلسة استشارية عبر مكالمة فيديو مع الراقي لتشخيص الحالة بشكل مفصل ومباشر",
      icon: "Video",
      duration_minutes: 45,
      is_active: true,
      display_order: 2
    }
  ])
});

const data = await res.json();
if (res.ok) {
  console.log("✅ تم إدخال الخدمات بنجاح!");
  data.forEach(s => console.log(`  → ${s.name} — ${s.duration_minutes} دقيقة`));
} else {
  console.log("❌ خطأ:", JSON.stringify(data));
}
