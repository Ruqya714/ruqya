const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";

const res = await fetch(`${SUPABASE_URL}/rest/v1/services?select=*`, {
  headers: { "apikey": KEY, "Authorization": `Bearer ${KEY}` }
});
const data = await res.json();
console.log("الخدمات الحالية في قاعدة البيانات:");
data.forEach(s => console.log(`  ✅ ${s.name} — ${s.duration_minutes} دقيقة — فعّالة: ${s.is_active}`));
console.log(`\nالمجموع: ${data.length} خدمة`);
