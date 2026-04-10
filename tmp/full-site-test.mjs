// ═══════════════════════════════════════════════════
// 🧪 فحص شامل للموقع — ruqyacenter.com
// نختبر كل شيء كأننا مستخدم حقيقي
// ═══════════════════════════════════════════════════

const SITE = "https://ruqyacenter.com";
const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjgwNDQsImV4cCI6MjA5MTQwNDA0NH0.1fAU7hySUsIiegpBHZo1NOReYyujqVGWPVAOUnyogas";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";

let passed = 0;
let failed = 0;
let warnings = 0;

function log(emoji, msg) { console.log(`  ${emoji} ${msg}`); }
function pass(msg) { passed++; log("✅", msg); }
function fail(msg) { failed++; log("❌", msg); }
function warn(msg) { warnings++; log("⚠️", msg); }

async function testPage(path, expectedStatus = 200) {
  try {
    const res = await fetch(`${SITE}${path}`, { redirect: "manual" });
    return { status: res.status, ok: res.status === expectedStatus, headers: res.headers };
  } catch (e) {
    return { status: 0, ok: false, error: e.message };
  }
}

async function testAPI(table, method = "GET", body = null) {
  const headers = { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}`, "Content-Type": "application/json" };
  if (method === "POST") headers["Prefer"] = "return=representation";
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, opts);
  const data = await res.json();
  return { status: res.status, data, ok: res.ok };
}

async function testAdminAPI(table) {
  const headers = { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
  return { status: res.status, data: await res.json(), ok: res.ok };
}

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║  🧪 فحص شامل لموقع مركز الرقية — ruqyacenter.com  ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

// ═══════════════════════════════════════════
// TEST 1: الصفحات العامة
// ═══════════════════════════════════════════
console.log("━━━ 1. الصفحات العامة (Public Pages) ━━━");

const publicPages = [
  { path: "/", name: "الرئيسية" },
  { path: "/services", name: "الخدمات" },
  { path: "/booking", name: "الحجز" },
  { path: "/about", name: "من نحن" },
  { path: "/articles", name: "المقالات" },
  { path: "/faq", name: "الأسئلة الشائعة" },
  { path: "/contact", name: "اتصل بنا" },
  { path: "/courses", name: "الكورسات والدورات" },
  { path: "/login", name: "تسجيل الدخول" },
];

for (const page of publicPages) {
  const result = await testPage(page.path);
  if (result.ok) {
    pass(`${page.name} (${page.path}) — ${result.status}`);
  } else if (result.status >= 300 && result.status < 400) {
    pass(`${page.name} (${page.path}) — redirect ${result.status} (طبيعي - i18n)`);
  } else {
    fail(`${page.name} (${page.path}) — ${result.status} ${result.error || ""}`);
  }
}

// ═══════════════════════════════════════════
// TEST 2: حماية صفحات الأدمن
// ═══════════════════════════════════════════
console.log("\n━━━ 2. حماية الصفحات المحمية (Auth Protection) ━━━");

const protectedPages = ["/admin", "/admin/bookings", "/admin/settings", "/healer"];
for (const path of protectedPages) {
  const result = await testPage(path);
  if (result.status >= 300 && result.status < 400) {
    pass(`${path} — محمي بشكل صحيح (يعيد توجيه للـ login)`);
  } else if (result.status === 200) {
    fail(`${path} — ⚠️ غير محمي! يمكن الوصول بدون تسجيل دخول!`);
  } else {
    warn(`${path} — Status: ${result.status}`);
  }
}

// ═══════════════════════════════════════════
// TEST 3: الخدمات
// ═══════════════════════════════════════════
console.log("\n━━━ 3. الخدمات والبيانات (Services & Data) ━━━");

const servicesResult = await testAPI("services?is_active=eq.true&select=id,name,description");
if (servicesResult.ok && servicesResult.data.length > 0) {
  pass(`الخدمات الفعالة: ${servicesResult.data.length} خدمة`);
  servicesResult.data.forEach(s => log("  ", `→ ${s.name}`));
} else {
  fail("لا توجد خدمات فعالة — فورم الحجز لن يعمل!");
}

// ═══════════════════════════════════════════
// TEST 4: الأسئلة الشائعة
// ═══════════════════════════════════════════
const faqsResult = await testAPI("faqs?is_visible=eq.true&select=id,question");
if (faqsResult.ok && faqsResult.data.length > 0) {
  pass(`الأسئلة الشائعة: ${faqsResult.data.length} سؤال`);
} else {
  warn("لا توجد أسئلة شائعة مرئية");
}

// ═══════════════════════════════════════════
// TEST 5: المقالات
// ═══════════════════════════════════════════
const articlesResult = await testAPI("articles?is_published=eq.true&select=id,title");
if (articlesResult.ok && articlesResult.data.length > 0) {
  pass(`المقالات المنشورة: ${articlesResult.data.length} مقالة`);
} else {
  warn("لا توجد مقالات منشورة");
}

// ═══════════════════════════════════════════
// TEST 6: الشهادات
// ═══════════════════════════════════════════
const testimonialsResult = await testAPI("testimonials?is_approved=eq.true&select=id");
if (testimonialsResult.ok) {
  if (testimonialsResult.data.length > 0) {
    pass(`الشهادات المعتمدة: ${testimonialsResult.data.length}`);
  } else {
    warn("لا توجد شهادات — قسم الشهادات في الصفحة الرئيسية سيكون مخفياً");
  }
}

// ═══════════════════════════════════════════
// TEST 7: إعدادات الموقع
// ═══════════════════════════════════════════
console.log("\n━━━ 4. إعدادات الموقع (Site Settings) ━━━");

const settingsResult = await testAPI("site_settings?select=key,value");
if (settingsResult.ok && settingsResult.data.length > 0) {
  pass(`إعدادات الموقع: ${settingsResult.data.length} إعداد`);
  settingsResult.data.forEach(s => {
    const val = s.value ? (s.value.length > 50 ? s.value.substring(0, 50) + "..." : s.value) : "(فارغ)";
    log("  ", `→ ${s.key} = ${val}`);
  });
} else {
  warn("إعدادات الموقع فارغة — الفوتر وصفحة اتصل بنا قد لا يعملان بشكل كامل");
}

// ═══════════════════════════════════════════
// TEST 8: اختبار إرسال رسالة (Contact Form)
// ═══════════════════════════════════════════
console.log("\n━━━ 5. اختبار الفورمات (Forms) ━━━");

const contactTest = await testAPI("contact_messages", "POST", {
  name: "🧪 فحص تلقائي",
  email: "test@test.com",
  phone: "+90 555 000 0000",
  message: "هذه رسالة اختبار تلقائية — يمكن حذفها"
});
if (contactTest.ok) {
  pass("إرسال رسالة اتصل بنا — يعمل بنجاح ✨");
  // Clean up
  const msgId = contactTest.data[0]?.id;
  if (msgId) {
    await fetch(`${SUPABASE_URL}/rest/v1/contact_messages?id=eq.${msgId}`, {
      method: "DELETE",
      headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` }
    });
    log("  ", "→ تم حذف الرسالة التجريبية");
  }
} else {
  fail(`إرسال رسالة اتصل بنا — فشل! (${contactTest.status})`);
}

// ═══════════════════════════════════════════
// TEST 9: اختبار حماية البيانات (RLS)
// ═══════════════════════════════════════════
console.log("\n━━━ 6. حماية البيانات (RLS Security) ━━━");

// Anonymous should NOT see profiles
const anonProfiles = await testAPI("profiles?select=id,role");
if (anonProfiles.ok && anonProfiles.data.length === 0) {
  pass("profiles — محمي (لا يمكن للزائر رؤية بيانات المستخدمين)");
} else if (anonProfiles.data.length > 0) {
  fail("profiles — ⚠️ غير محمي! الزائر يمكنه رؤية بيانات المستخدمين!");
} else {
  pass("profiles — محمي");
}

// Anonymous should NOT see bookings
const anonBookings = await testAPI("bookings?select=id,patient_name");
if (anonBookings.ok && anonBookings.data.length === 0) {
  pass("bookings SELECT — محمي (الزائر لا يرى الحجوزات)");
} else if (anonBookings.data.length > 0) {
  fail("bookings — ⚠️ الزائر يمكنه رؤية حجوزات الآخرين!");
} else {
  pass("bookings SELECT — محمي");
}

// Anonymous should NOT see contact messages
const anonContacts = await testAPI("contact_messages?select=id,name");
if (anonContacts.ok && anonContacts.data.length === 0) {
  pass("contact_messages SELECT — محمي (الزائر لا يرى الرسائل)");
} else if (anonContacts.data.length > 0) {
  fail("contact_messages — ⚠️ الزائر يمكنه رؤية رسائل الآخرين!");
}

// ═══════════════════════════════════════════
// TEST 10: التخزين (Storage)
// ═══════════════════════════════════════════
console.log("\n━━━ 7. التخزين (Storage) ━━━");

const storageRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
  headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` }
});
const buckets = await storageRes.json();
const publicBucket = buckets.find(b => b.id === "public_images");
if (publicBucket) {
  pass(`public_images bucket — موجود (عام: ${publicBucket.public ? "نعم" : "لا"})`);
} else {
  fail("public_images bucket — غير موجود!");
}

// Check infographic image
const settingsData = settingsResult.data || [];
const infographic = settingsData.find(s => s.key === "infographic_image_url");
if (infographic && infographic.value) {
  const imgRes = await fetch(infographic.value, { method: "HEAD" });
  if (imgRes.ok) {
    pass("صورة الإنفوجرافيك — قابلة للتحميل");
  } else {
    fail(`صورة الإنفوجرافيك — غير قابلة للتحميل (${imgRes.status})`);
  }
} else {
  warn("لم يتم تحديد صورة إنفوجرافيك في الإعدادات");
}

// ═══════════════════════════════════════════
// TEST 11: Auth & Admin User
// ═══════════════════════════════════════════
console.log("\n━━━ 8. المستخدمين والصلاحيات (Auth) ━━━");

const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` }
});
const authData = await authRes.json();
const users = authData.users || [];
pass(`عدد المستخدمين: ${users.length}`);
users.forEach(u => {
  const confirmed = u.email_confirmed_at ? "✅ مؤكد" : "❌ غير مؤكد";
  log("  ", `→ ${u.email} — ${confirmed}`);
});

const profilesAdmin = await testAdminAPI("profiles");
const admins = profilesAdmin.data.filter(p => p.role === "admin");
if (admins.length > 0) {
  pass(`مدراء النظام: ${admins.length}`);
} else {
  fail("لا يوجد أي مدير — لا يمكن الدخول للوحة التحكم!");
}

// ═══════════════════════════════════════════
// TEST 12: تسجيل الدخول
// ═══════════════════════════════════════════
console.log("\n━━━ 9. اختبار تسجيل الدخول (Login) ━━━");

const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { "apikey": ANON_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "ruqya714@gmail.com", password: "Ruqya@2026!" })
});
const loginData = await loginRes.json();
if (loginRes.ok && loginData.access_token) {
  pass("تسجيل الدخول بالإيميل والباسورد — ناجح! 🔐");
  
  // Test admin can access profiles
  const adminHeaders = { "apikey": ANON_KEY, "Authorization": `Bearer ${loginData.access_token}` };
  const adminProfileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,role,full_name`, {
    headers: adminHeaders
  });
  const adminProfiles = await adminProfileRes.json();
  if (adminProfiles.length > 0) {
    pass(`المدير يرى الملفات الشخصية: ${adminProfiles.length} ملف`);
  }
  
  // Test admin can see bookings
  const adminBookingsRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=id&limit=1`, {
    headers: adminHeaders
  });
  if (adminBookingsRes.ok) {
    pass("المدير يمكنه الوصول لجدول الحجوزات");
  }
  
  // Test admin can see contact messages
  const adminContactRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages?select=id&limit=1`, {
    headers: adminHeaders
  });
  if (adminContactRes.ok) {
    pass("المدير يمكنه الوصول لصندوق البريد الوارد");
  }
} else {
  fail(`تسجيل الدخول فشل! خطأ: ${loginData.error_description || loginData.msg || JSON.stringify(loginData)}`);
}

// ═══════════════════════════════════════════
// TEST 13: SSL & Domain
// ═══════════════════════════════════════════
console.log("\n━━━ 10. الدومين والأمان (Domain & SSL) ━━━");

const domainRes = await fetch("https://ruqyacenter.com", { redirect: "manual" });
pass(`ruqyacenter.com — يستجيب (Status: ${domainRes.status})`);

const wwwRes = await fetch("https://www.ruqyacenter.com", { redirect: "manual" });
if (wwwRes.ok || (wwwRes.status >= 300 && wwwRes.status < 400)) {
  pass(`www.ruqyacenter.com — يعمل (Status: ${wwwRes.status})`);
} else {
  warn(`www.ruqyacenter.com — Status: ${wwwRes.status}`);
}

// ═══════════════════════════════════════════
// FINAL REPORT
// ═══════════════════════════════════════════
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║              📊 النتيجة النهائية                    ║");
console.log("╚══════════════════════════════════════════════════════╝");
console.log(`  ✅ نجح:     ${passed} اختبار`);
console.log(`  ❌ فشل:     ${failed} اختبار`);
console.log(`  ⚠️  تحذير:   ${warnings} تحذير`);
console.log(`  📊 المجموع:  ${passed + failed + warnings} اختبار`);
console.log("");

if (failed === 0) {
  console.log("  🎉🎉🎉 الموقع جاهز للتسليم! كل الاختبارات نجحت! 🎉🎉🎉");
} else {
  console.log(`  ⚠️ يوجد ${failed} مشكلة تحتاج مراجعة قبل التسليم.`);
}
console.log("");
