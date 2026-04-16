-- Run this in your Supabase SQL Editor

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS locale text DEFAULT 'ar';

-- Add an index for faster querying
CREATE INDEX IF NOT EXISTS idx_articles_locale ON public.articles(locale);
