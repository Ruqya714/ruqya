# مشروع موقع مركز الرقية بكلام الرحمن لرد كيد الشيطان
## Ruqyah Center Website - Project Plan

---

## نظرة عامة
موقع إلكتروني متكامل لمركز الرقية الشرعية في إسطنبول، يتضمن موقعاً عاماً تعريفياً مع نظام حجز استشارات أونلاين، ولوحة تحكم داخلية لإدارة الحجوزات والمعالجين والمقالات.

- **اللغة:** عربي فقط (RTL)
- **الأدوار:** Admin, Healer (معالج), Visitor (زائر)
- **بوابة الدفع:** placeholder للمرحلة الحالية (ستُضاف لاحقاً)

---

## التقنيات المستخدمة
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (RTL configured)
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Rich Text Editor:** TipTap (for articles)
- **SEO:** Next.js Metadata API + next-sitemap
- **Deployment:** Vercel
- **Icons:** Lucide React

### استراتيجية الـ Rendering
| القسم | الطريقة | السبب |
|-------|---------|-------|
| الصفحات العامة (Home, About, Services, etc.) | SSG (Static) | أداء عالي + SEO ممتاز |
| المقالات | SSG + ISR (revalidate: 3600) | SEO + تحديث تلقائي كل ساعة |
| صفحة الحجز | Client Component | تفاعلية عالية (multi-step form) |
| لوحة الأدمن | Client Components | لا تحتاج SEO |
| لوحة المعالج | Client Components | لا تحتاج SEO |

---

## نظام التصميم (Design System)

### الألوان (مستلهمة من شعار المركز)
| الاسم | الكود | الاستخدام |
|-------|-------|-----------|
| Primary Green | `#1a5c2a` | الأزرار الرئيسية، العناوين، الشعار |
| Primary Green Light | `#2d7a3e` | Hover states |
| Primary Green Dark | `#0f3d1a` | Sidebar, Header |
| Gold Accent | `#c5a028` | CTA buttons، عناصر مميزة، الشعار |
| Gold Light | `#d4b84a` | Hover على الذهبي |
| Teal Dark | `#1a3a4a` | خلفيات ثانوية، footer |
| Background | `#f7f5f0` | خلفية الصفحات (warm white) |
| Card Background | `#ffffff` | خلفية الكروت |
| Text Primary | `#1a1a1a` | النص الأساسي |
| Text Secondary | `#6b7280` | النص الثانوي |
| Border | `#e5e2d9` | الحدود |
| Success | `#16a34a` | رسائل النجاح |
| Warning | `#f59e0b` | التنبيهات |
| Error | `#dc2626` | الأخطاء |

### الخطوط
- **العناوين:** IBM Plex Sans Arabic (Bold/SemiBold)
- **النص:** IBM Plex Sans Arabic (Regular/Light)

### المكونات العامة
- الزوايا: `rounded-lg` (8px)
- الظلال: `shadow-sm` للكروت
- الأيقونات: Lucide React
- الاتجاه: RTL على كل الصفحات
- Hover transitions: `transition-all duration-200`

---

## هيكل قاعدة البيانات (Supabase Schema)

### 1. profiles
يُنشأ تلقائياً عند تسجيل المستخدم عبر trigger
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'healer')) DEFAULT 'healer',
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. healers
معلومات إضافية عن المعالجين (تظهر على الموقع العام)
```sql
CREATE TABLE healers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  title TEXT NOT NULL, -- مثل: مستشار ومعالج والمدير التنفيذي
  photo_url TEXT,
  specialization TEXT,
  experience_years INTEGER,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true, -- يظهر على الموقع العام
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. services
الخدمات المقدمة
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- اسم أيقونة Lucide
  duration_minutes INTEGER DEFAULT 30,
  price DECIMAL(10,2), -- nullable حتى تُضاف بوابة الدفع
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. available_slots
المواعيد المتاحة التي يحددها الأدمن لكل معالج
```sql
CREATE TABLE available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  healer_id UUID REFERENCES healers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(healer_id, slot_date, start_time)
);
```

### 5. bookings
الحجوزات
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES available_slots(id) ON DELETE SET NULL,
  healer_id UUID REFERENCES healers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  -- بيانات الزائر (بدون تسجيل)
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_country TEXT,
  patient_age INTEGER,
  patient_gender TEXT CHECK (patient_gender IN ('male', 'female')),
  patient_notes TEXT, -- وصف مختصر للحالة
  -- حالة الحجز
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
  -- الدفع (placeholder)
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  -- تعيين المعالج
  assigned_by UUID REFERENCES profiles(id),
  admin_notes TEXT, -- ملاحظات داخلية
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6. articles
المقالات وقصص الشفاء
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- مقتطف قصير
  content TEXT NOT NULL, -- HTML from TipTap
  cover_image_url TEXT,
  category TEXT CHECK (category IN ('article', 'healing_story', 'announcement')) DEFAULT 'article',
  author_id UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 7. testimonials
شهادات المرضى (يديرها الأدمن)
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 8. site_settings
إعدادات الموقع العامة
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- keys: phone, whatsapp, email, address, google_maps_url,
--        instagram, youtube, facebook, twitter,
--        about_text, booking_instructions
```

### 9. faqs
الأسئلة الشائعة
```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies Summary
| الجدول | Public (anon) | Healer | Admin |
|--------|--------------|--------|-------|
| profiles | ❌ | Read own | Full |
| healers | Read visible | Read own | Full |
| services | Read active | Read | Full |
| available_slots | Read unbooked | Read own healer | Full |
| bookings | Insert (create) | Read assigned | Full |
| articles | Read published | ❌ | Full |
| testimonials | Read visible | ❌ | Full |
| site_settings | Read | ❌ | Full |
| faqs | Read visible | ❌ | Full |

---

## خريطة الشاشات

### الموقع العام (Public) - 9 شاشات

#### S01: الصفحة الرئيسية (Home)
- Hero section مع شعار المركز وعنوان رئيسي + CTA "سجل حالتك"
- قسم "من نحن" مختصر
- قسم الخدمات (4 كروت)
- قسم "ما الذي يمكن علاجه" (4 بطاقات: روحي، نفسي، صحي، تحصين)
- قسم فريق العمل (عرض المعالجين)
- قسم شهادات المرضى (carousel)
- قسم الأسئلة الشائعة (accordion)
- CTA أخير "هل أنت مستعد؟ سجل حالتك"
- Footer: معلومات التواصل، روابط التواصل الاجتماعي

#### S02: من نحن (About)
- قصة المركز وتاريخه (تأسس 2017)
- رؤية ورسالة المركز
- ميزات المركز (من الملف)
- فريق العمل بالتفصيل

#### S03: الخدمات (Services)
- عرض كل خدمة بتفصيل: الاستشارة الصوتية، التشخيص، العلاج بإشراف خاص، الكورسات
- CTA لكل خدمة يوجه لصفحة الحجز

#### S04: الرحلة العلاجية (Treatment Journey)
- عرض مراحل العلاج الـ6 بشكل timeline/stepper
- شرح كل مرحلة
- ميزات العلاج بإشراف خاص

#### S05: المقالات وقصص الشفاء (Blog)
- قائمة المقالات مع فلتر حسب التصنيف (مقال، قصة شفاء، إعلان)
- كارت لكل مقال: صورة غلاف، عنوان، مقتطف، تاريخ

#### S06: تفاصيل مقال (Article Detail)
- عرض المقال كاملاً
- صورة الغلاف
- مقالات ذات صلة

#### S07: حجز استشارة (Booking)
- Step 1: اختيار الخدمة
- Step 2: اختيار الموعد من المواعيد المتاحة (calendar view)
- Step 3: تعبئة بيانات المريض (الاسم، الهاتف، الإيميل، البلد، العمر، الجنس، وصف الحالة)
- Step 4: تأكيد الحجز (+ placeholder للدفع)
- Step 5: رسالة تأكيد مع تفاصيل الحجز

#### S08: الأسئلة الشائعة (FAQ)
- عرض accordion لكل الأسئلة

#### S09: اتصل بنا (Contact)
- معلومات التواصل (هاتف، واتساب، بريد)
- العنوان مع خريطة Google
- روابط التواصل الاجتماعي

---

### صفحات المصادقة - شاشتان

#### S10: تسجيل دخول (Login)
- إيميل + كلمة مرور
- توجيه حسب الدور: admin → لوحة الأدمن، healer → لوحة المعالج

#### S11: نسيت كلمة المرور (Forgot Password)
- إدخال الإيميل → رابط إعادة تعيين

---

### لوحة تحكم الأدمن (Admin Dashboard) - 10 شاشات

#### S12: الرئيسية - الأدمن (Admin Home)
- إحصائيات سريعة: عدد الحجوزات اليوم، الأسبوع، الشهر
- حجوزات بانتظار التأكيد
- آخر الحجوزات
- رسم بياني بسيط للحجوزات

#### S13: إدارة الحجوزات (Bookings Management)
- جدول بكل الحجوزات مع فلاتر (التاريخ، الحالة، المعالج)
- تغيير حالة الحجز
- تخصيص حجز لمعالج معين
- إضافة ملاحظات داخلية
- عرض تفاصيل المريض

#### S14: إدارة المواعيد (Slots Management)
- تقويم أسبوعي/شهري
- إضافة مواعيد متاحة (اختيار المعالج + الخدمة + التاريخ + الوقت)
- إضافة مجمّعة (bulk): مثلاً كل يوم أحد من 10-2 لمعالج معين
- حذف/تعديل المواعيد

#### S15: إدارة المعالجين (Healers Management)
- قائمة المعالجين
- إضافة/تعديل معالج (الاسم، اللقب، الصورة، التخصص، سنوات الخبرة)
- تفعيل/إلغاء تفعيل
- إنشاء حساب login لكل معالج

#### S16: إدارة الخدمات (Services Management)
- إضافة/تعديل/حذف خدمة
- تحديد المدة والسعر
- ترتيب العرض

#### S17: إدارة المقالات (Articles Management)
- قائمة المقالات (منشور / مسودة)
- Rich text editor (TipTap)
- رفع صور
- تحديد التصنيف

#### S18: كتابة/تعديل مقال (Article Editor)
- TipTap editor بالعربي
- رفع صورة غلاف
- اختيار تصنيف
- نشر / حفظ كمسودة

#### S19: إدارة شهادات المرضى (Testimonials Management)
- إضافة/تعديل/حذف شهادة
- ترتيب العرض

#### S20: إدارة الأسئلة الشائعة (FAQ Management)
- إضافة/تعديل/حذف سؤال
- ترتيب العرض

#### S21: إعدادات الموقع (Site Settings)
- تعديل معلومات التواصل
- تعديل روابط التواصل الاجتماعي
- تعديل نص "من نحن"

---

### لوحة تحكم المعالج (Healer Dashboard) - 3 شاشات

#### S22: الرئيسية - المعالج (Healer Home)
- حجوزات اليوم
- حجوزات قادمة
- إحصائيات بسيطة (عدد الحجوزات هذا الشهر)

#### S23: حجوزاتي (My Bookings)
- جدول بالحجوزات المخصصة له
- فلتر حسب التاريخ والحالة
- عرض تفاصيل المريض ووصف الحالة
- تغيير الحالة (confirmed → completed)

#### S24: ملفي الشخصي (My Profile)
- تعديل الصورة والبيانات الشخصية
- تغيير كلمة المرور

---

## المكونات المشتركة (Shared Components)

### Layout Components
- `PublicLayout` — header + footer للموقع العام
- `AdminLayout` — sidebar + header للوحة الأدمن
- `HealerLayout` — sidebar + header للوحة المعالج

### UI Components
- `Button` — primary (green), accent (gold), secondary, danger
- `Card` — بطاقة عامة
- `Input` / `Textarea` / `Select` — حقول الإدخال
- `Modal` — نافذة منبثقة
- `Table` — جدول بيانات مع pagination
- `Badge` — حالات (pending, confirmed, etc.)
- `Accordion` — للأسئلة الشائعة
- `Calendar` — لاختيار المواعيد
- `Stepper` — لخطوات الحجز
- `Toast` — إشعارات
- `LoadingSpinner`
- `EmptyState`

---

## هيكل الملفات (Next.js App Router)
```
app/
├── layout.jsx                    (Root layout: RTL, fonts, metadata)
├── globals.css                   (Tailwind + RTL + custom fonts)
├── page.jsx                      (S01 - الرئيسية — SSG)
├── about/
│   └── page.jsx                  (S02 - من نحن — SSG)
├── services/
│   └── page.jsx                  (S03 - الخدمات — SSG)
├── treatment-journey/
│   └── page.jsx                  (S04 - الرحلة العلاجية — SSG)
├── blog/
│   ├── page.jsx                  (S05 - المقالات — SSG + ISR)
│   └── [slug]/
│       └── page.jsx              (S06 - تفاصيل مقال — SSG + ISR)
├── booking/
│   └── page.jsx                  (S07 - حجز استشارة — Client Component)
├── faq/
│   └── page.jsx                  (S08 - الأسئلة الشائعة — SSG)
├── contact/
│   └── page.jsx                  (S09 - اتصل بنا — SSG)
├── login/
│   └── page.jsx                  (S10 - تسجيل الدخول)
├── forgot-password/
│   └── page.jsx                  (S11 - نسيت كلمة المرور)
├── admin/
│   ├── layout.jsx                (AdminLayout — Client, Protected)
│   ├── page.jsx                  (S12 - لوحة الأدمن)
│   ├── bookings/
│   │   └── page.jsx              (S13 - إدارة الحجوزات)
│   ├── slots/
│   │   └── page.jsx              (S14 - إدارة المواعيد)
│   ├── healers/
│   │   └── page.jsx              (S15 - إدارة المعالجين)
│   ├── services/
│   │   └── page.jsx              (S16 - إدارة الخدمات)
│   ├── articles/
│   │   ├── page.jsx              (S17 - إدارة المقالات)
│   │   └── [id]/
│   │       └── page.jsx          (S18 - تعديل مقال)
│   ├── testimonials/
│   │   └── page.jsx              (S19 - شهادات المرضى)
│   ├── faqs/
│   │   └── page.jsx              (S20 - الأسئلة الشائعة)
│   └── settings/
│       └── page.jsx              (S21 - الإعدادات)
├── healer/
│   ├── layout.jsx                (HealerLayout — Client, Protected)
│   ├── page.jsx                  (S22 - لوحة المعالج)
│   ├── bookings/
│   │   └── page.jsx              (S23 - حجوزاتي)
│   └── profile/
│       └── page.jsx              (S24 - ملفي الشخصي)
├── api/                          (Route Handlers if needed)
│   └── revalidate/
│       └── route.js              (On-demand ISR revalidation)
components/
├── ui/                           (Button, Card, Input, Modal, Table, Badge, etc.)
├── layout/                       (Header, Footer, AdminSidebar, HealerSidebar)
└── shared/                       (Logo, ServiceCard, HealerCard, BookingSteps, etc.)
lib/
├── supabase/
│   ├── client.js                 (Browser client)
│   └── server.js                 (Server client for SSR/SSG)
├── constants.js
├── helpers.js
└── validators.js
hooks/
├── useAuth.js
├── useBookings.js
├── useArticles.js
└── useSlots.js
public/
├── images/
│   └── logo.png
└── fonts/
```

---

## ترتيب التنفيذ المقترح

### المرحلة 1: الأساسيات (Foundation)
1. إعداد المشروع (Next.js 14 App Router + Tailwind RTL + Supabase)
2. تصميم الـ Design System والمكونات الأساسية (UI components)
3. إنشاء الـ Database Schema + RLS Policies
4. إعداد Auth + Middleware (protected routes) + Supabase server/client

### المرحلة 2: الموقع العام
5. S01 - الصفحة الرئيسية
6. S02 - من نحن
7. S03 - الخدمات
8. S04 - الرحلة العلاجية
9. S05 + S06 - المقالات
10. S08 - الأسئلة الشائعة
11. S09 - اتصل بنا
12. S07 - حجز استشارة (multi-step form)

### المرحلة 3: لوحة الأدمن
13. S10 + S11 - صفحات المصادقة
14. S12 - لوحة الأدمن الرئيسية
15. S15 - إدارة المعالجين
16. S16 - إدارة الخدمات
17. S14 - إدارة المواعيد
18. S13 - إدارة الحجوزات
19. S17 + S18 - إدارة المقالات
20. S19 - إدارة شهادات المرضى
21. S20 - إدارة الأسئلة الشائعة
22. S21 - إعدادات الموقع

### المرحلة 4: لوحة المعالج
23. S22 - لوحة المعالج الرئيسية
24. S23 - حجوزاتي
25. S24 - ملفي الشخصي

### المرحلة 5 (مستقبلية):
- ربط بوابة الدفع
- إشعارات بريد إلكتروني/واتساب عند الحجز
- تقارير وإحصائيات متقدمة
- نظام تقييم المعالجين
- تطبيق موبايل

---

## ملاحظات مهمة
- كل الصفحات RTL من البداية
- الموقع العام لا يتطلب تسجيل دخول (الزائر يحجز بدون حساب)
- الأدمن هو من ينشئ حسابات المعالجين
- المقالات تُكتب بـ TipTap rich text editor ويتم حفظها كـ HTML
- صور المعالجين والمقالات تُخزن في Supabase Storage
- بوابة الدفع placeholder: الحجز يتم تسجيله مع payment_status = 'pending'
- **SEO:** كل صفحة عامة تتضمن metadata (title, description, og:image) عبر Next.js Metadata API
- **SEO:** المقالات تستخدم ISR مع revalidate كل ساعة لتحديث المحتوى بدون إعادة build
- **SEO:** يتم توليد sitemap.xml تلقائياً عبر next-sitemap
- **SEO:** المقالات تستخدم structured data (JSON-LD) للظهور بشكل أفضل بنتائج البحث
- **Supabase:** يوجد client منفصل للـ server (SSR/SSG) وآخر للـ browser (Client Components)
- **Middleware:** يتم حماية routes الأدمن والمعالج عبر Next.js middleware
