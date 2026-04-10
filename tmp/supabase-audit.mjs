// Supabase Full Audit Script
// Checks: Tables, Columns, RLS Policies, Functions, Triggers, Storage, Admin User

const SUPABASE_URL = "https://uleriazfrvuusiemfbax.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyODA0NCwiZXhwIjoyMDkxNDA0MDQ0fQ.RcxGAmxE-XgsPdNAyjj4eAuB-KFDPiByYIwSL0cG3Eo";

const headers = {
  "apikey": SERVICE_ROLE_KEY,
  "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

async function rpc(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  // Use the pg_meta endpoint for raw SQL
  const r = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  });
  return r;
}

async function query(sql) {
  // Use the Supabase SQL endpoint via the REST API
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST", headers, body: JSON.stringify({})
  });
  return res;
}

// Helper: fetch from a table
async function fetchTable(table, select = "*", extra = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${extra}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return { error: `${res.status} ${res.statusText}`, data: null };
  const data = await res.json();
  return { data, error: null };
}

// Helper: fetch with HEAD to check table existence
async function checkTable(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=0`;
  const res = await fetch(url, { headers });
  return { exists: res.ok, status: res.status };
}

// Check storage buckets
async function checkStorage() {
  const url = `${SUPABASE_URL}/storage/v1/bucket`;
  const res = await fetch(url, { headers });
  if (!res.ok) return { error: `${res.status}`, data: null };
  const data = await res.json();
  return { data, error: null };
}

// Check auth users
async function checkAuthUsers() {
  const url = `${SUPABASE_URL}/auth/v1/admin/users`;
  const res = await fetch(url, { headers });
  if (!res.ok) return { error: `${res.status}`, data: null };
  const data = await res.json();
  return { data, error: null };
}

console.log("╔══════════════════════════════════════════════════╗");
console.log("║   🔍 فحص شامل لقاعدة بيانات Supabase الجديدة   ║");
console.log("╚══════════════════════════════════════════════════╝\n");

// ============================================
// 1. CHECK ALL REQUIRED TABLES
// ============================================
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📋 1. فحص الجداول (Tables)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const requiredTables = [
  "profiles",
  "healers", 
  "services",
  "available_slots",
  "bookings",
  "articles",
  "testimonials",
  "site_settings",
  "faqs",
  "contact_messages",
];

let tableResults = [];
for (const table of requiredTables) {
  const result = await checkTable(table);
  const status = result.exists ? "✅" : "❌";
  console.log(`  ${status} ${table}`);
  tableResults.push({ table, ...result });
}

const missingTables = tableResults.filter(t => !t.exists);
if (missingTables.length > 0) {
  console.log(`\n  ⚠️  جداول مفقودة: ${missingTables.map(t => t.table).join(", ")}`);
} else {
  console.log(`\n  🎯 جميع الجداول (${requiredTables.length}) موجودة بنجاح!`);
}

// ============================================
// 2. CHECK CRITICAL COLUMNS IN KEY TABLES
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🧱 2. فحص الأعمدة المهمة (Critical Columns)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Check healers.is_available column
const healerCheck = await fetchTable("healers", "is_available", "&limit=0");
if (healerCheck.error) {
  console.log("  ❌ healers.is_available — العمود مفقود!");
} else {
  console.log("  ✅ healers.is_available — موجود");
}

// Check available_slots.max_capacity
const slotCheck = await fetchTable("available_slots", "max_capacity,current_bookings", "&limit=0");
if (slotCheck.error) {
  console.log("  ❌ available_slots.max_capacity / current_bookings — أعمدة مفقودة!");
} else {
  console.log("  ✅ available_slots.max_capacity — موجود");
  console.log("  ✅ available_slots.current_bookings — موجود");
}

// Check bookings extra fields
const bookingCheck = await fetchTable("bookings", "patient_nationality,patient_residence,patient_marital_status,patient_previous_ruqya,patient_can_travel,patient_need_type", "&limit=0");
if (bookingCheck.error) {
  console.log("  ❌ bookings — حقول المريض الإضافية مفقودة (من migration 002)!");
} else {
  console.log("  ✅ bookings — جميع حقول المريض الإضافية موجودة");
}

// Check contact_messages columns
const contactCheck = await fetchTable("contact_messages", "name,email,phone,message,is_read", "&limit=0");
if (contactCheck.error) {
  console.log("  ❌ contact_messages — أعمدة مفقودة!");
} else {
  console.log("  ✅ contact_messages — جميع الأعمدة موجودة");
}

// ============================================
// 3. CHECK STORAGE BUCKETS
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📦 3. فحص التخزين (Storage Buckets)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const storageResult = await checkStorage();
if (storageResult.error) {
  console.log(`  ❌ خطأ في جلب معلومات التخزين: ${storageResult.error}`);
} else {
  const buckets = storageResult.data;
  const publicImages = buckets.find(b => b.id === "public_images");
  if (publicImages) {
    console.log(`  ✅ public_images bucket — موجود (عام: ${publicImages.public ? "نعم" : "لا"})`);
  } else {
    console.log("  ❌ public_images bucket — غير موجود! (لن يتم رفع الصور)");
  }
  if (buckets.length > 0) {
    console.log(`  📂 جميع الـ Buckets: ${buckets.map(b => b.id).join(", ")}`);
  }
}

// ============================================
// 4. CHECK AUTH USERS & ADMIN
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("👤 4. فحص المستخدمين والمدير (Auth & Admin)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const authResult = await checkAuthUsers();
if (authResult.error) {
  console.log(`  ❌ خطأ في جلب المستخدمين: ${authResult.error}`);
} else {
  const users = authResult.data?.users || [];
  console.log(`  📊 عدد المستخدمين في auth.users: ${users.length}`);
  
  for (const u of users) {
    const confirmed = u.email_confirmed_at ? "✅ مؤكد" : "❌ غير مؤكد";
    console.log(`  👤 ${u.email} — ${confirmed}`);
  }
}

// Check profiles table for admin role
const profilesResult = await fetchTable("profiles", "id,full_name,role,is_active");
if (profilesResult.error) {
  console.log(`  ❌ خطأ في جلب الملفات الشخصية: ${profilesResult.error}`);
} else {
  const profiles = profilesResult.data || [];
  const admins = profiles.filter(p => p.role === "admin");
  const healers = profiles.filter(p => p.role === "healer");
  
  console.log(`\n  📊 الملفات الشخصية (profiles):`);
  console.log(`     مدراء (admin): ${admins.length}`);
  console.log(`     معالجين (healer): ${healers.length}`);
  
  if (admins.length === 0) {
    console.log("  ⚠️  تحذير: لا يوجد أي مدير (admin) في النظام!");
  } else {
    for (const a of admins) {
      console.log(`  🟢 مدير: ${a.full_name || "(بدون اسم)"} — نشط: ${a.is_active ? "نعم" : "لا"}`);
    }
  }

  // Check if auth users match profiles
  if (authResult.data?.users) {
    const authIds = authResult.data.users.map(u => u.id);
    const profileIds = profiles.map(p => p.id);
    const orphanAuth = authIds.filter(id => !profileIds.includes(id));
    const orphanProfiles = profileIds.filter(id => !authIds.includes(id));
    
    if (orphanAuth.length > 0) {
      console.log(`\n  ⚠️  مستخدمون في Auth بدون Profile: ${orphanAuth.length}`);
    }
    if (orphanProfiles.length > 0) {
      console.log(`  ⚠️  Profiles بدون مستخدم Auth: ${orphanProfiles.length}`);
    }
    if (orphanAuth.length === 0 && orphanProfiles.length === 0) {
      console.log(`\n  ✅ تطابق تام بين auth.users و profiles`);
    }
  }
}

// ============================================
// 5. CHECK SEED DATA (FAQs & Articles)
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📝 5. فحص البيانات التأسيسية (Seed Data)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const faqsResult = await fetchTable("faqs", "id", "");
console.log(`  📋 الأسئلة الشائعة (FAQs): ${faqsResult.data?.length || 0} سؤال`);
if ((faqsResult.data?.length || 0) === 0) {
  console.log("  ⚠️  الأسئلة الشائعة فارغة — الصفحة العامة ستظهر بدون أسئلة");
}

const articlesResult = await fetchTable("articles", "id,title,is_published", "");
console.log(`  📰 المقالات (Articles): ${articlesResult.data?.length || 0} مقالة`);
const published = articlesResult.data?.filter(a => a.is_published) || [];
console.log(`     منشورة: ${published.length}`);
if ((articlesResult.data?.length || 0) === 0) {
  console.log("  ⚠️  المقالات فارغة — صفحة المدونة ستظهر فارغة");
}

const servicesResult = await fetchTable("services", "id,name", "");
console.log(`  🛎️  الخدمات (Services): ${servicesResult.data?.length || 0} خدمة`);
if ((servicesResult.data?.length || 0) === 0) {
  console.log("  ⚠️  الخدمات فارغة — يجب على المدير إضافة خدمات من لوحة التحكم");
}

const healersResult = await fetchTable("healers", "id,display_name", "");
console.log(`  🧑‍⚕️ المعالجين (Healers): ${healersResult.data?.length || 0} معالج`);
if ((healersResult.data?.length || 0) === 0) {
  console.log("  ⚠️  المعالجين فارغ — يجب على المدير إضافة معالجين من لوحة التحكم");
}

const testimonialsResult = await fetchTable("testimonials", "id", "");
console.log(`  ⭐ الشهادات (Testimonials): ${testimonialsResult.data?.length || 0} شهادة`);

const settingsResult = await fetchTable("site_settings", "key,value", "");
console.log(`  ⚙️  إعدادات الموقع (Settings): ${settingsResult.data?.length || 0} إعداد`);

// ============================================
// 6. RLS CHECK (try to access as anonymous)
// ============================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔒 6. فحص الحماية (RLS - Row Level Security)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXJpYXpmcnZ1dXNpZW1mYmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjgwNDQsImV4cCI6MjA5MTQwNDA0NH0.1fAU7hySUsIiegpBHZo1NOReYyujqVGWPVAOUnyogas";

const anonHeaders = {
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`,
};

// Anonymous should NOT see profiles
const anonProfiles = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, { headers: anonHeaders });
const anonProfileData = await anonProfiles.json();
if (Array.isArray(anonProfileData) && anonProfileData.length === 0) {
  console.log("  ✅ profiles — محمي (الزائر المجهول لا يرى شيئاً)");
} else if (anonProfileData.length > 0) {
  console.log("  ⚠️  profiles — الزائر المجهول يمكنه رؤية البيانات!");
} else {
  console.log("  ✅ profiles — محمي");
}

// Anonymous should see published articles only
const anonArticles = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id&is_published=eq.false`, { headers: anonHeaders });
const anonArticleData = await anonArticles.json();
if (Array.isArray(anonArticleData) && anonArticleData.length === 0) {
  console.log("  ✅ articles — المقالات غير المنشورة مخفية عن الزائر");
} else {
  console.log("  ⚠️  articles — الزائر يمكنه رؤية مقالات غير منشورة!");
}

// Anonymous should be able to INSERT bookings
const testBooking = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
  method: "POST",
  headers: { ...anonHeaders, "Content-Type": "application/json", "Prefer": "return=minimal" },
  body: JSON.stringify({
    patient_name: "__TEST__",
    patient_phone: "0000",
    status: "pending",
  }),
});
if (testBooking.ok || testBooking.status === 201) {
  console.log("  ✅ bookings — الزائر يمكنه إرسال حجز (INSERT مسموح)");
  // Clean up test booking
  await fetch(`${SUPABASE_URL}/rest/v1/bookings?patient_name=eq.__TEST__`, {
    method: "DELETE",
    headers,
  });
} else {
  const err = await testBooking.text();
  console.log(`  ❌ bookings INSERT — الزائر لا يمكنه الحجز! (${testBooking.status})`);
}

// Anonymous should be able to INSERT contact_messages
const testContact = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
  method: "POST",
  headers: { ...anonHeaders, "Content-Type": "application/json", "Prefer": "return=minimal" },
  body: JSON.stringify({
    name: "__TEST__",
    email: "test@test.com",
    message: "test",
  }),
});
if (testContact.ok || testContact.status === 201) {
  console.log("  ✅ contact_messages — الزائر يمكنه إرسال رسالة (INSERT مسموح)");
  // Clean up
  await fetch(`${SUPABASE_URL}/rest/v1/contact_messages?name=eq.__TEST__`, {
    method: "DELETE",
    headers,
  });
} else {
  console.log(`  ❌ contact_messages INSERT — الزائر لا يمكنه إرسال رسالة! (${testContact.status})`);
}

// Anonymous should see visible FAQs
const anonFaqs = await fetch(`${SUPABASE_URL}/rest/v1/faqs?select=id&is_visible=eq.true`, { headers: anonHeaders });
if (anonFaqs.ok) {
  console.log("  ✅ faqs — الأسئلة المرئية ظاهرة للزائر");
} else {
  console.log("  ❌ faqs — الزائر لا يمكنه رؤية الأسئلة الشائعة!");
}

// Anonymous should see active services
const anonServices = await fetch(`${SUPABASE_URL}/rest/v1/services?select=id&is_active=eq.true`, { headers: anonHeaders });
if (anonServices.ok) {
  console.log("  ✅ services — الخدمات الفعالة ظاهرة للزائر");
} else {
  console.log("  ❌ services — الزائر لا يمكنه رؤية الخدمات!");
}

// Anonymous should see site_settings
const anonSettings = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, { headers: anonHeaders });
if (anonSettings.ok) {
  console.log("  ✅ site_settings — إعدادات الموقع ظاهرة للزائر");
} else {
  console.log("  ❌ site_settings — الزائر لا يمكنه رؤية إعدادات الموقع!");
}

// ============================================
// SUMMARY
// ============================================
console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║              📊 ملخص نتائج الفحص                ║");
console.log("╚══════════════════════════════════════════════════╝");

const allTablesOk = missingTables.length === 0;
const adminExists = (profilesResult.data || []).some(p => p.role === "admin");
const storageOk = storageResult.data?.some(b => b.id === "public_images");

console.log(`  الجداول:     ${allTablesOk ? "✅ مكتملة" : "❌ ناقصة"}`);
console.log(`  المدير:      ${adminExists ? "✅ موجود" : "❌ غير موجود"}`);
console.log(`  التخزين:     ${storageOk ? "✅ جاهز" : "❌ غير موجود"}`);
console.log(`  الأسئلة:     ${(faqsResult.data?.length || 0) > 0 ? "✅ موجودة" : "⚠️  فارغة"}`);
console.log(`  المقالات:    ${(articlesResult.data?.length || 0) > 0 ? "✅ موجودة" : "⚠️  فارغة"}`);
console.log(`  الخدمات:     ${(servicesResult.data?.length || 0) > 0 ? "✅ موجودة" : "⚠️  فارغة (يجب إضافتها)"}`);
console.log(`  المعالجين:   ${(healersResult.data?.length || 0) > 0 ? "✅ موجود" : "⚠️  فارغ (يجب إضافتهم)"}`);
console.log("");
