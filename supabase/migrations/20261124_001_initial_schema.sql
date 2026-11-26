-- ====================================================================
-- TRAVELONBUDDY — PRODUCTION POSTGRESQL DATABASE MIGRATION
-- Compatible with Supabase SQL Editor and Supabase CLI
-- Creates all 15 core entities, indexes, relationships, and RLS policies
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES (Users synced with auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('traveler', 'buddy', 'admin')) DEFAULT 'traveler',
  title TEXT DEFAULT 'Explorer',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for role and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- --------------------------------------------------------------------
-- 2. TRAVEL BUDDIES (Approved & Pending Companions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_buddies (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar TEXT NOT NULL,
  bio TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  expertise TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 1,
  rating_demo NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  total_trips_demo INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('Application Submitted', 'Under Review', 'Additional Details Required', 'Approved', 'Rejected', 'Suspended')) DEFAULT 'Under Review',
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  availability_note TEXT,
  verified_badges TEXT[] NOT NULL DEFAULT '{}',
  native_of TEXT NOT NULL,
  speciality_ghats TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 500,
  half_day_rate NUMERIC(10,2) NOT NULL DEFAULT 1800,
  full_day_rate NUMERIC(10,2) NOT NULL DEFAULT 3200,
  multi_day_daily_rate NUMERIC(10,2) NOT NULL DEFAULT 2900,
  max_group_size INTEGER NOT NULL DEFAULT 6,
  available_time_slots TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  places_covered TEXT[] DEFAULT '{}',
  contact_number TEXT,
  contact_email TEXT,
  allow_whatsapp_contact BOOLEAN NOT NULL DEFAULT true,
  allow_email_share BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_travel_buddies_status ON public.travel_buddies(status);
CREATE INDEX IF NOT EXISTS idx_travel_buddies_native ON public.travel_buddies(native_of);

-- --------------------------------------------------------------------
-- 3. BOOKINGS (Traveler companion bookings & requests)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TEXT,
  is_multi_day BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('HOURLY', 'HALF_DAY', 'FULL_DAY')),
  duration_text TEXT NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  adults_count INTEGER,
  children_count INTEGER,
  traveler_country_city TEXT,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  preferred_language TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  selected_places TEXT[] DEFAULT '{}',
  crowd_preference TEXT DEFAULT 'Balanced Experiences',
  buddy_gender_preference TEXT DEFAULT 'Any',
  special_requests TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'Request Submitted',
    'Under Review',
    'Buddy Assignment Proposed',
    'Buddy Accepted',
    'Booking Confirmed',
    'Trip In Progress',
    'Trip Completed',
    'Cancelled',
    'Assignment Declined'
  )) DEFAULT 'Request Submitted',
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Pending', 'Successful', 'Failed', 'Refunded')) DEFAULT 'Pending',
  payment_transaction_id TEXT,
  assigned_buddy_id TEXT REFERENCES public.travel_buddies(id) ON DELETE SET NULL,
  assigned_buddy_name TEXT,
  price_breakdown JSONB,
  estimated_price_display TEXT NOT NULL,
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_buddy ON public.bookings(assigned_buddy_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);

-- --------------------------------------------------------------------
-- 4. DESTINATIONS (Catalog)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hindi_name TEXT,
  tagline TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  suggested_duration TEXT,
  best_time_to_visit TEXT,
  highlights TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  available_experiences TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 5. TRAVEL PACKAGES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_hi TEXT,
  city TEXT NOT NULL CHECK (city IN ('Varanasi', 'Jaipur')),
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT,
  price NUMERIC(10,2) NOT NULL,
  max_party_size INTEGER NOT NULL DEFAULT 6,
  included_en TEXT[] DEFAULT '{}',
  included_hi TEXT[] DEFAULT '{}',
  cover_image TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Draft')) DEFAULT 'Published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 6. BUDDY SERVICES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buddy_services (
  id TEXT PRIMARY KEY,
  buddy_id TEXT NOT NULL REFERENCES public.travel_buddies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  rate NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Under Review', 'Inactive')) DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 7. BUDDY DOCUMENTS (Verification records)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buddy_documents (
  id TEXT PRIMARY KEY,
  buddy_id TEXT NOT NULL REFERENCES public.travel_buddies(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  doc_number TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Approved', 'Under Review', 'Rejected', 'Not Submitted')) DEFAULT 'Under Review',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  rejection_reason TEXT
);

-- --------------------------------------------------------------------
-- 8. REVIEWS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  booking_ref TEXT,
  buddy_id TEXT REFERENCES public.travel_buddies(id) ON DELETE CASCADE,
  buddy_name TEXT,
  traveler_name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Flagged', 'Hidden')) DEFAULT 'Published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 9. ENQUIRIES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('New', 'In Progress', 'Resolved')) DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 10. SUPPORT TICKETS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  ticket_ref TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Normal', 'Urgent')) DEFAULT 'Normal',
  status TEXT NOT NULL CHECK (status IN ('Open', 'In Review', 'Resolved', 'Closed')) DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 11. NOTIFICATIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_hi TEXT,
  message_en TEXT NOT NULL,
  message_hi TEXT,
  type TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 12. SAVED ITEMS (Wishlist per user)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('buddy', 'destination', 'experience', 'package')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, item_type, item_id)
);

-- --------------------------------------------------------------------
-- 13. EVENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Varanasi', 'Jaipur')),
  is_near_city BOOLEAN DEFAULT false,
  near_city_details TEXT,
  category TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  date_status TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Draft', 'Archived')) DEFAULT 'Published',
  lifecycle_status TEXT DEFAULT 'UPCOMING',
  venue_en TEXT NOT NULL,
  venue_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  long_description_en TEXT,
  long_description_hi TEXT,
  cultural_significance_en TEXT,
  cultural_significance_hi TEXT,
  visitor_experience_en TEXT[] DEFAULT '{}',
  visitor_experience_hi TEXT[] DEFAULT '{}',
  schedule_details TEXT,
  entry_fee_en TEXT,
  entry_fee_hi TEXT,
  cover_image TEXT NOT NULL,
  image_alt_text TEXT,
  organizer TEXT NOT NULL,
  official_source_url TEXT,
  last_verified_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 14. EVENT SYNC LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_sync_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PARTIAL', 'SKIPPED')),
  events_analyzed INTEGER NOT NULL DEFAULT 0,
  events_updated INTEGER NOT NULL DEFAULT 0,
  events_added INTEGER NOT NULL DEFAULT 0,
  details TEXT
);

-- --------------------------------------------------------------------
-- 15. EMAIL AUDIT LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_audit_logs (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  booking_ref TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  assigned_buddy_id TEXT NOT NULL,
  assigned_buddy_name TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  delivery_attempt INTEGER NOT NULL DEFAULT 1,
  provider TEXT NOT NULL,
  provider_reference TEXT NOT NULL,
  email_status TEXT NOT NULL,
  sent_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  subject TEXT NOT NULL,
  error TEXT
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read policies for catalogs
CREATE POLICY "Public can view destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Public can view approved buddies" ON public.travel_buddies FOR SELECT USING (status = 'Approved' OR is_admin());
CREATE POLICY "Public can view published packages" ON public.travel_packages FOR SELECT USING (status = 'Published' OR is_admin());
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (status = 'Published' OR is_admin());
CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT USING (status = 'Published' OR is_admin());

-- Bookings RLS
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  traveler_email = auth.jwt()->>'email' OR 
  is_admin()
);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = user_id OR is_admin()
);

-- Profiles RLS
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Enquiries and Support
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view enquiries" ON public.enquiries FOR ALL USING (is_admin());
CREATE POLICY "Users can manage own support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Admin full access across all operational tables
CREATE POLICY "Admin full access destinations" ON public.destinations FOR ALL USING (is_admin());
CREATE POLICY "Admin full access packages" ON public.travel_packages FOR ALL USING (is_admin());
CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (is_admin());
CREATE POLICY "Admin full access buddies" ON public.travel_buddies FOR ALL USING (is_admin());
CREATE POLICY "Admin full access documents" ON public.buddy_documents FOR ALL USING (is_admin());
CREATE POLICY "Admin full access reviews" ON public.reviews FOR ALL USING (is_admin());
CREATE POLICY "Admin full access email logs" ON public.email_audit_logs FOR ALL USING (is_admin());
CREATE POLICY "Admin full access sync logs" ON public.event_sync_logs FOR ALL USING (is_admin());
