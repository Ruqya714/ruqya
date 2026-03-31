-- إعداد قاعدة بيانات مركز الرقية بكلام الرحمن لرد كيد الشيطان

-- ==========================================
-- 1. profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'healer')) DEFAULT 'healer',
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. healers
-- ==========================================
CREATE TABLE IF NOT EXISTS public.healers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  title TEXT NOT NULL, -- مثل: مستشار ومعالج والمدير التنفيذي
  photo_url TEXT,
  specialization TEXT,
  experience_years INTEGER,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true, -- يظهر على الموقع العام
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. services
-- ==========================================
CREATE TABLE IF NOT EXISTS public.services (
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

-- ==========================================
-- 4. available_slots
-- ==========================================
CREATE TABLE IF NOT EXISTS public.available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  healer_id UUID REFERENCES public.healers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(healer_id, slot_date, start_time)
);

-- ==========================================
-- 5. bookings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.available_slots(id) ON DELETE SET NULL,
  healer_id UUID REFERENCES public.healers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
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
  assigned_by UUID REFERENCES public.profiles(id),
  admin_notes TEXT, -- ملاحظات داخلية
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 6. articles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- مقتطف قصير
  content TEXT NOT NULL, -- HTML from TipTap
  cover_image_url TEXT,
  category TEXT CHECK (category IN ('article', 'healing_story', 'announcement')) DEFAULT 'article',
  author_id UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 7. testimonials
-- ==========================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 8. site_settings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 9. faqs
-- ==========================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- Triggers and Functions
-- ==========================================

-- Function to handle new user registration from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE(new.raw_user_meta_data->>'role', 'healer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function when a new user signs up in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to automatically mark slot as booked when booking is created
CREATE OR REPLACE FUNCTION public.update_slot_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('pending', 'confirmed', 'completed') AND NEW.slot_id IS NOT NULL THEN
    UPDATE public.available_slots SET is_booked = true WHERE id = NEW.slot_id;
  END IF;
  
  -- If cancelled or no_show, free up the slot
  IF NEW.status IN ('cancelled', 'no_show') AND NEW.slot_id IS NOT NULL THEN
    UPDATE public.available_slots SET is_booked = false WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_booking_status_change ON public.bookings;
CREATE TRIGGER on_booking_status_change
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.update_slot_status();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- ==========================================
-- Row-Level Security (RLS) Policies
-- ==========================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 2. Helper function to check if the user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Policies for profiles
CREATE POLICY "Admins can do everything on profiles" ON public.profiles FOR ALL USING (is_admin());
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Policies for healers
CREATE POLICY "Admins can do everything on healers" ON public.healers FOR ALL USING (is_admin());
CREATE POLICY "Anyone can read visible healers" ON public.healers FOR SELECT USING (is_visible = true);
CREATE POLICY "Healers can read their own healer record" ON public.healers FOR SELECT USING (profile_id = auth.uid());

-- 5. Policies for services
CREATE POLICY "Admins can do everything on services" ON public.services FOR ALL USING (is_admin());
CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Healers can read all services" ON public.services FOR SELECT TO authenticated USING (true);

-- 6. Policies for available_slots
CREATE POLICY "Admins can do everything on slots" ON public.available_slots FOR ALL USING (is_admin());
CREATE POLICY "Anyone can read unbooked slots" ON public.available_slots FOR SELECT USING (is_booked = false);
CREATE POLICY "Healers can view their own slots" ON public.available_slots FOR SELECT USING (
  healer_id IN (SELECT id FROM public.healers WHERE profile_id = auth.uid())
);

-- 7. Policies for bookings
CREATE POLICY "Admins can do everything on bookings" ON public.bookings FOR ALL USING (is_admin());
CREATE POLICY "Anyone can insert a booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Healers can view and update their own assigned bookings" ON public.bookings FOR ALL USING (
  healer_id IN (SELECT id FROM public.healers WHERE profile_id = auth.uid()) OR
  assigned_by = auth.uid()
);

-- 8. Policies for articles
CREATE POLICY "Admins can do everything on articles" ON public.articles FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (is_published = true);

-- 9. Policies for testimonials
CREATE POLICY "Admins can do everything on testimonials" ON public.testimonials FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);

-- 10. Policies for site_settings
CREATE POLICY "Admins can do everything on site settings" ON public.site_settings FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);

-- 11. Policies for faqs
CREATE POLICY "Admins can do everything on faqs" ON public.faqs FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view visible faqs" ON public.faqs FOR SELECT USING (is_visible = true);
