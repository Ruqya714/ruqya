// ═══════════════════════════════════════════════════
// ⚡ اختبار سرعة الموقع — ruqyacenter.com
// ═══════════════════════════════════════════════════

const SITE = "https://www.ruqyacenter.com";

async function measurePage(path, name) {
  const start = performance.now();
  try {
    const res = await fetch(`${SITE}${path}`, { 
      redirect: "follow",
      headers: { "Accept": "text/html" }
    });
    const end = performance.now();
    const time = Math.round(end - start);
    const size = res.headers.get("content-length");
    const body = await res.text();
    const sizeKB = Math.round(body.length / 1024);
    
    let speed, emoji;
    if (time < 500) { speed = "سريع جداً"; emoji = "🟢"; }
    else if (time < 1000) { speed = "جيد"; emoji = "🟡"; }
    else if (time < 2000) { speed = "مقبول"; emoji = "🟠"; }
    else { speed = "بطيء"; emoji = "🔴"; }
    
    return { name, path, time, sizeKB, speed, emoji, status: res.status };
  } catch (e) {
    const end = performance.now();
    return { name, path, time: Math.round(end - start), sizeKB: 0, speed: "خطأ", emoji: "❌", error: e.message };
  }
}

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║      ⚡ اختبار سرعة موقع مركز الرقية الشرعية      ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

// Test public pages
const pages = [
  { path: "/ar", name: "🏠 الرئيسية" },
  { path: "/ar/services", name: "🛎️  الخدمات" },
  { path: "/ar/booking", name: "📅 الحجز" },
  { path: "/ar/about", name: "ℹ️  من نحن" },
  { path: "/ar/articles", name: "📰 المقالات" },
  { path: "/ar/faq", name: "❓ الأسئلة الشائعة" },
  { path: "/ar/contact", name: "📞 اتصل بنا" },
  { path: "/ar/courses", name: "🎓 الكورسات" },
  { path: "/ar/login", name: "🔐 تسجيل الدخول" },
];

console.log("━━━ الصفحات العامة ━━━\n");
console.log("  الصفحة                  الوقت     الحجم      التقييم");
console.log("  ─────────────────────  ────────  ────────  ──────────");

let totalTime = 0;
const results = [];

for (const page of pages) {
  const result = await measurePage(page.path, page.name);
  results.push(result);
  totalTime += result.time;
  
  const nameCol = result.name.padEnd(22);
  const timeCol = `${result.time}ms`.padStart(7);
  const sizeCol = `${result.sizeKB}KB`.padStart(7);
  console.log(`  ${nameCol} ${timeCol}   ${sizeCol}   ${result.emoji} ${result.speed}`);
}

// API Speed
console.log("\n━━━ سرعة Supabase API ━━━\n");

const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjgwNDQsImV4cCI6MjA5MTQwNDA0NH0.1fAU7hySUsIiegpBHZo1NOReYyujqVGWPVAOUnyogas";

const apiTests = [
  { table: "services?is_active=eq.true", name: "الخدمات" },
  { table: "faqs?is_visible=eq.true", name: "الأسئلة الشائعة" },
  { table: "articles?is_published=eq.true", name: "المقالات" },
  { table: "site_settings", name: "الإعدادات" },
  { table: "testimonials?is_approved=eq.true", name: "الشهادات" },
];

console.log("  الجدول                  الوقت     التقييم");
console.log("  ─────────────────────  ────────  ──────────");

let totalApiTime = 0;
for (const test of apiTests) {
  const start = performance.now();
  await fetch(`${SUPABASE_URL}/rest/v1/${test.table}?select=*`, {
    headers: { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` }
  });
  const time = Math.round(performance.now() - start);
  totalApiTime += time;
  
  let speed, emoji;
  if (time < 200) { speed = "سريع جداً"; emoji = "🟢"; }
  else if (time < 500) { speed = "جيد"; emoji = "🟡"; }
  else if (time < 1000) { speed = "مقبول"; emoji = "🟠"; }
  else { speed = "بطيء"; emoji = "🔴"; }
  
  const nameCol = test.name.padEnd(22);
  const timeCol = `${time}ms`.padStart(7);
  console.log(`  ${nameCol} ${timeCol}   ${emoji} ${speed}`);
}

// PageSpeed Insights
console.log("\n━━━ Google PageSpeed Insights ━━━\n");

try {
  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE + "/ar")}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;
  const psiRes = await fetch(psiUrl);
  const psi = await psiRes.json();
  
  if (psi.lighthouseResult) {
    const cats = psi.lighthouseResult.categories;
    const scores = {
      "⚡ الأداء (Performance)": Math.round((cats.performance?.score || 0) * 100),
      "♿ سهولة الوصول (Accessibility)": Math.round((cats.accessibility?.score || 0) * 100),
      "✅ أفضل الممارسات (Best Practices)": Math.round((cats["best-practices"]?.score || 0) * 100),
      "🔍 SEO": Math.round((cats.seo?.score || 0) * 100),
    };
    
    for (const [name, score] of Object.entries(scores)) {
      let emoji;
      if (score >= 90) emoji = "🟢";
      else if (score >= 50) emoji = "🟡";
      else emoji = "🔴";
      console.log(`  ${emoji} ${name}: ${score}/100`);
    }
    
    // Key metrics
    const audits = psi.lighthouseResult.audits;
    console.log("\n  📊 مقاييس رئيسية:");
    if (audits["first-contentful-paint"]) console.log(`     FCP (أول رسم): ${audits["first-contentful-paint"].displayValue}`);
    if (audits["largest-contentful-paint"]) console.log(`     LCP (أكبر رسم): ${audits["largest-contentful-paint"].displayValue}`);
    if (audits["total-blocking-time"]) console.log(`     TBT (وقت الحظر): ${audits["total-blocking-time"].displayValue}`);
    if (audits["cumulative-layout-shift"]) console.log(`     CLS (استقرار): ${audits["cumulative-layout-shift"].displayValue}`);
    if (audits["speed-index"]) console.log(`     Speed Index: ${audits["speed-index"].displayValue}`);
  } else {
    console.log("  ⚠️ لم يتمكن من تحليل PageSpeed (قد يحتاج وقتاً أطول)");
  }
} catch (e) {
  console.log("  ⚠️ تعذر الوصول لـ PageSpeed Insights:", e.message);
}

// Summary
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║              📊 ملخص الأداء                        ║");
console.log("╚══════════════════════════════════════════════════════╝");

const avgPage = Math.round(totalTime / pages.length);
const avgApi = Math.round(totalApiTime / apiTests.length);
const fastPages = results.filter(r => r.time < 1000).length;
const slowPages = results.filter(r => r.time >= 2000).length;

console.log(`  📄 متوسط تحميل الصفحة: ${avgPage}ms`);
console.log(`  🗄️  متوسط استجابة API: ${avgApi}ms`);
console.log(`  🟢 صفحات سريعة (<1s): ${fastPages}/${pages.length}`);
if (slowPages > 0) console.log(`  🔴 صفحات بطيئة (>2s): ${slowPages}/${pages.length}`);

let grade;
if (avgPage < 500) grade = "A+ ممتاز";
else if (avgPage < 1000) grade = "A جيد جداً";
else if (avgPage < 1500) grade = "B جيد";
else if (avgPage < 2500) grade = "C مقبول";
else grade = "D يحتاج تحسين";

console.log(`\n  🏆 التقييم العام: ${grade}`);
console.log("");
