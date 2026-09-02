-- =============================================================================
-- Migration: Site Content CMS & Pages SEO Management
-- Description: Creates tables and policies for admin-managed site content & SEO
-- =============================================================================

-- 1. Create table for Site Content (Dynamic CMS sections)
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_name text NOT NULL,
  section_key text NOT NULL,
  locale text NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'tr')),
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_content_pkey PRIMARY KEY (id),
  CONSTRAINT site_content_unique UNIQUE (page_name, section_key, locale)
);

-- 2. Create table for Pages SEO (Meta titles, descriptions, keywords, OG)
CREATE TABLE IF NOT EXISTS public.pages_seo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  locale text NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'tr')),
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_image_url text,
  canonical_url text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pages_seo_pkey PRIMARY KEY (id),
  CONSTRAINT pages_seo_unique UNIQUE (page_path, locale)
);

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_site_cms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON public.site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE PROCEDURE update_site_cms_updated_at();

DROP TRIGGER IF EXISTS trg_pages_seo_updated_at ON public.pages_seo;
CREATE TRIGGER trg_pages_seo_updated_at
  BEFORE UPDATE ON public.pages_seo
  FOR EACH ROW EXECUTE PROCEDURE update_site_cms_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages_seo ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for site_content
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content"
  ON public.site_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete site content" ON public.site_content;
CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. RLS Policies for pages_seo
DROP POLICY IF EXISTS "Public can view pages seo" ON public.pages_seo;
CREATE POLICY "Public can view pages seo"
  ON public.pages_seo FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert pages seo" ON public.pages_seo;
CREATE POLICY "Admins can insert pages seo"
  ON public.pages_seo FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update pages seo" ON public.pages_seo;
CREATE POLICY "Admins can update pages seo"
  ON public.pages_seo FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete pages seo" ON public.pages_seo;
CREATE POLICY "Admins can delete pages seo"
  ON public.pages_seo FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
