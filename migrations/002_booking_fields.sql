-- Migration: إضافة نظام السعة للمواعيد + حقول الحجز الإضافية
-- Run this in Supabase SQL Editor

-- 1. Add capacity columns to available_slots
ALTER TABLE public.available_slots
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_bookings INTEGER NOT NULL DEFAULT 0;

-- 2. Add new patient fields to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS patient_nationality TEXT,
  ADD COLUMN IF NOT EXISTS patient_residence TEXT,
  ADD COLUMN IF NOT EXISTS patient_marital_status TEXT CHECK (patient_marital_status IN ('married', 'single', 'divorced', 'widowed')),
  ADD COLUMN IF NOT EXISTS patient_previous_ruqya TEXT,
  ADD COLUMN IF NOT EXISTS patient_can_travel BOOLEAN,
  ADD COLUMN IF NOT EXISTS patient_need_type TEXT CHECK (patient_need_type IN ('initial_assessment', 'special_followup', 'need_specialist_opinion'));
