import { supabase, isSupabaseConfigured } from './supabase';
import {
  TravelRequest,
  TravelBuddy,
  ContactEnquiry,
  SupportTicket,
  BookingCategory,
  BookingStatus,
  PaymentStatus,
  BuddyApplicationStatus,
} from '../types';

/**
 * Data Service Layer: Provides uniform data access with automatic fallback to local memory
 * when Supabase is not yet connected, and live PostgreSQL queries when connected.
 */
export const db = {
  // 1. BOOKINGS
  bookings: {
    async getAll(): Promise<TravelRequest[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching bookings from Supabase:', error);
        return [];
      }
      return (data || []).map(mapDbBookingToApp);
    },

    async create(booking: TravelRequest): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase.from('bookings').insert([mapAppBookingToDb(booking)]);
      if (error) {
        console.error('Error inserting booking to Supabase:', error);
        return false;
      }
      return true;
    },

    async updateStatus(
      id: string,
      status: TravelRequest['status'],
      timeline: TravelRequest['timeline'],
      assignedBuddyId?: string,
      assignedBuddyName?: string
    ): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const payload: Record<string, unknown> = {
        status,
        timeline,
        updated_at: new Date().toISOString(),
      };
      if (assignedBuddyId) payload.assigned_buddy_id = assignedBuddyId;
      if (assignedBuddyName) payload.assigned_buddy_name = assignedBuddyName;

      const { error } = await supabase.from('bookings').update(payload).eq('id', id);
      if (error) {
        console.error('Error updating booking status in Supabase:', error);
        return false;
      }
      return true;
    },
  },

  // 2. TRAVEL BUDDIES
  buddies: {
    async getAll(): Promise<TravelBuddy[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase.from('travel_buddies').select('*');
      if (error) {
        console.error('Error fetching buddies from Supabase:', error);
        return [];
      }
      return (data || []).map(mapDbBuddyToApp);
    },

    async updateStatus(id: string, status: TravelBuddy['status']): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase
        .from('travel_buddies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    },
  },

  // 3. ENQUIRIES
  enquiries: {
    async getAll(): Promise<ContactEnquiry[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone || '',
        subject: e.subject,
        message: e.message,
        status: e.status,
        createdAt: e.created_at,
      }));
    },

    async create(enquiry: ContactEnquiry): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase.from('enquiries').insert([
        {
          id: enquiry.id,
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          subject: enquiry.subject,
          message: enquiry.message,
          status: enquiry.status,
          created_at: enquiry.createdAt,
        },
      ]);
      return !error;
    },

    async updateStatus(id: string, status: ContactEnquiry['status']): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
      return !error;
    },
  },

  // 4. SUPPORT TICKETS
  supportTickets: {
    async getAll(): Promise<SupportTicket[]> {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map((t) => ({
        id: t.id,
        ticketRef: t.ticket_ref,
        userId: t.user_id || 'anonymous',
        userName: t.user_name || 'Traveler User',
        userRole: (t.user_role as 'traveler' | 'buddy') || 'traveler',
        subject: t.subject,
        category: t.category,
        message: t.message,
        status: t.status,
        priority: t.priority,
        createdAt: t.created_at,
      }));
    },

    async updateStatus(id: string, status: SupportTicket['status']): Promise<boolean> {
      if (!isSupabaseConfigured()) return false;
      const { error } = await supabase.from('support_tickets').update({ status }).eq('id', id);
      return !error;
    },
  },
};

// Raw database row shapes from Supabase (snake_case)
interface DbBookingRow {
  id: string;
  booking_ref: string;
  destination: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  is_multi_day: boolean;
  category: string;
  duration_text: string;
  traveler_count: number;
  adults_count?: number;
  children_count?: number;
  traveler_country_city?: string;
  traveler_name: string;
  traveler_email: string;
  traveler_phone: string;
  pickup_location: string;
  preferred_language: string;
  interests: string[];
  selected_places?: string[];
  crowd_preference?: string;
  buddy_gender_preference?: string;
  special_requests?: string;
  status: string;
  payment_status?: string;
  payment_transaction_id?: string;
  assigned_buddy_id?: string;
  assigned_buddy_name?: string;
  created_at: string;
  price_breakdown?: TravelRequest['priceBreakdown'];
  estimated_price_display: string;
  timeline: TravelRequest['timeline'];
}

interface DbBuddyRow {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  languages: string[];
  expertise: string[];
  experience_years: number;
  rating_demo: number | string;
  total_trips_demo: number;
  status: string;
  gender: string;
  availability_note: string;
  verified_badges: string[];
  native_of: string;
  speciality_ghats: string[];
  hourly_rate: number | string;
  half_day_rate: number | string;
  full_day_rate: number | string;
  multi_day_daily_rate: number | string;
  max_group_size: number;
  available_time_slots?: string[];
  services_offered?: string[];
  places_covered?: string[];
  contact_number?: string;
  contact_email?: string;
  allow_whatsapp_contact?: boolean;
  allow_email_share?: boolean;
}

// Data mappers between snake_case database schema and camelCase TypeScript models
function mapDbBookingToApp(row: DbBookingRow): TravelRequest {
  return {
    id: row.id,
    bookingRef: row.booking_ref,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    isMultiDay: row.is_multi_day,
    category: row.category as BookingCategory,
    durationText: row.duration_text,
    travelerCount: row.traveler_count,
    adultsCount: row.adults_count,
    childrenCount: row.children_count,
    travelerCountryCity: row.traveler_country_city,
    travelerName: row.traveler_name,
    travelerEmail: row.traveler_email,
    travelerPhone: row.traveler_phone,
    pickupLocation: row.pickup_location,
    preferredLanguage: row.preferred_language,
    interests: row.interests || [],
    selectedPlaces: row.selected_places || [],
    crowdPreference: (row.crowd_preference || 'Balanced Experiences') as TravelRequest['crowdPreference'],
    buddyGenderPreference: (row.buddy_gender_preference || 'Any') as TravelRequest['buddyGenderPreference'],
    specialRequests: row.special_requests,
    status: row.status as BookingStatus,
    paymentStatus: row.payment_status as PaymentStatus | undefined,
    paymentTransactionId: row.payment_transaction_id,
    assignedBuddyId: row.assigned_buddy_id,
    assignedBuddyName: row.assigned_buddy_name,
    createdAt: row.created_at,
    priceBreakdown: row.price_breakdown,
    estimatedPriceDisplay: row.estimated_price_display,
    timeline: row.timeline || [],
  };
}

function mapAppBookingToDb(b: TravelRequest): Record<string, unknown> {
  return {
    id: b.id,
    booking_ref: b.bookingRef,
    destination: b.destination,
    start_date: b.startDate,
    end_date: b.endDate,
    start_time: b.startTime,
    is_multi_day: b.isMultiDay,
    category: b.category,
    duration_text: b.durationText,
    traveler_count: b.travelerCount,
    adults_count: b.adultsCount,
    children_count: b.childrenCount,
    traveler_country_city: b.travelerCountryCity,
    traveler_name: b.travelerName,
    traveler_email: b.travelerEmail,
    traveler_phone: b.travelerPhone,
    pickup_location: b.pickupLocation,
    preferred_language: b.preferredLanguage,
    interests: b.interests,
    selected_places: b.selectedPlaces,
    crowd_preference: b.crowdPreference,
    buddy_gender_preference: b.buddyGenderPreference,
    special_requests: b.specialRequests,
    status: b.status,
    payment_status: b.paymentStatus || 'Pending',
    payment_transaction_id: b.paymentTransactionId,
    assigned_buddy_id: b.assignedBuddyId,
    assigned_buddy_name: b.assignedBuddyName,
    price_breakdown: b.priceBreakdown,
    estimated_price_display: b.estimatedPriceDisplay,
    timeline: b.timeline,
    created_at: b.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function mapDbBuddyToApp(row: DbBuddyRow): TravelBuddy {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    avatar: row.avatar,
    bio: row.bio,
    languages: row.languages || [],
    expertise: row.expertise || [],
    experienceYears: row.experience_years,
    ratingDemo: Number(row.rating_demo),
    totalTripsDemo: row.total_trips_demo,
    status: row.status as BuddyApplicationStatus,
    gender: row.gender as TravelBuddy['gender'],
    availabilityNote: row.availability_note,
    verifiedBadges: row.verified_badges || [],
    nativeOf: row.native_of,
    specialityGhats: row.speciality_ghats || [],
    hourlyRate: Number(row.hourly_rate),
    halfDayRate: Number(row.half_day_rate),
    fullDayRate: Number(row.full_day_rate),
    multiDayDailyRate: Number(row.multi_day_daily_rate),
    maxGroupSize: row.max_group_size,
    availableTimeSlots: row.available_time_slots,
    servicesOffered: row.services_offered,
    placesCovered: row.places_covered,
    contactNumber: row.contact_number,
    contactEmail: row.contact_email,
    allowWhatsAppContact: row.allow_whatsapp_contact,
    allowEmailShare: row.allow_email_share,
  };
}
