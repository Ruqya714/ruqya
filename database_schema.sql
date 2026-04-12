-- ==========================================
-- 1. Profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'healer'::text CHECK (role = ANY (ARRAY['admin'::text, 'healer'::text])),
  phone text,
  bio text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. Healers
-- ==========================================
CREATE TABLE IF NOT EXISTS public.healers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid,
  display_name text NOT NULL,
  title text NOT NULL,
  photo_url text,
  specialization text,
  experience_years integer,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  is_available boolean DEFAULT true,
  CONSTRAINT healers_pkey PRIMARY KEY (id),
  CONSTRAINT healers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. Services
-- ==========================================
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  duration_minutes integer DEFAULT 30,
  price numeric,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- ==========================================
-- 4. Available Slots
-- ==========================================
CREATE TABLE IF NOT EXISTS public.available_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  healer_id uuid,
  service_id uuid,
  slot_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_booked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  max_capacity integer NOT NULL DEFAULT 1,
  current_bookings integer NOT NULL DEFAULT 0,
  CONSTRAINT available_slots_pkey PRIMARY KEY (id),
  CONSTRAINT available_slots_healer_id_fkey FOREIGN KEY (healer_id) REFERENCES public.healers(id) ON DELETE CASCADE,
  CONSTRAINT available_slots_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL,
  UNIQUE(healer_id, slot_date, start_time)
);

-- ==========================================
-- 5. Bookings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slot_id uuid,
  healer_id uuid,
  service_id uuid,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  patient_email text,
  patient_country text,
  patient_age integer,
  patient_gender text CHECK (patient_gender = ANY (ARRAY['male'::text, 'female'::text])),
  patient_notes text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text])),
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'refunded'::text])),
  payment_amount numeric,
  assigned_by uuid,
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  patient_nationality text,
  patient_residence text,
  patient_marital_status text CHECK (patient_marital_status = ANY (ARRAY['married'::text, 'single'::text, 'divorced'::text, 'widowed'::text])),
  patient_previous_ruqya text,
  patient_can_travel boolean,
  patient_need_type text CHECK (patient_need_type = ANY (ARRAY['initial_assessment'::text, 'special_followup'::text, 'need_specialist_opinion'::text])),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.available_slots(id) ON DELETE SET NULL,
  CONSTRAINT bookings_healer_id_fkey FOREIGN KEY (healer_id) REFERENCES public.healers(id) ON DELETE SET NULL,
  CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL,
  CONSTRAINT bookings_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.profiles(id)
);

-- ==========================================
-- 6. Articles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  category text DEFAULT 'article'::text CHECK (category = ANY (ARRAY['article'::text, 'healing_story'::text, 'announcement'::text])),
  author_id uuid,
  is_published boolean DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ==========================================
-- 7. Testimonials
-- ==========================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_visible boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- ==========================================
-- 8. Site Settings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- ==========================================
-- 9. FAQs
-- ==========================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);

-- ==========================================
-- 10. Contact Messages
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
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
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

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

-- 12. Policies for contact_messages
CREATE POLICY "Admins can do everything on contact messages" ON public.contact_messages FOR ALL USING (is_admin());
CREATE POLICY "Anyone can insert a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
