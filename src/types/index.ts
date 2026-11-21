export type BookingCategory = 'HOURLY' | 'HALF_DAY' | 'FULL_DAY';

export type BookingStatus =
  | 'Request Submitted'
  | 'Under Review'
  | 'Buddy Assignment Proposed'
  | 'Buddy Accepted'
  | 'Booking Confirmed'
  | 'Trip In Progress'
  | 'Trip Completed'
  | 'Cancelled'
  | 'Assignment Declined';

export type BuddyApplicationStatus =
  | 'Application Submitted'
  | 'Under Review'
  | 'Additional Details Required'
  | 'Approved'
  | 'Rejected'
  | 'Suspended';

export interface Destination {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  category: 'Famous Ghats' | 'Temples' | 'Heritage' | 'Local Markets' | 'Banarasi Food' | 'Banarasi Sarees' | 'Cultural Experiences' | 'Nearby Attractions';
  description: string;
  longDescription: string;
  coverImage: string;
  gallery: string[];
  suggestedDuration: string;
  bestTimeToVisit: string;
  highlights: string[];
  location: string;
  availableExperiences: string[];
  isFeatured?: boolean;
}

export type EventCategory =
  | 'Religious Festivals'
  | 'Cultural Events'
  | 'Music and Dance'
  | 'Art and Literature'
  | 'Food Festivals'
  | 'Local Fairs'
  | 'Heritage Events'
  | 'Seasonal Celebrations';

export type EventDateStatus = 'Confirmed' | 'Tentative' | 'Dates To Be Announced';

export type EventLifecycleStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface DateChangeRecord {
  oldStartDate: string;
  oldEndDate?: string;
  newStartDate: string;
  newEndDate?: string;
  changedAt: string; // ISO date
  reason?: string;
}

export interface TravelEvent {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  city: 'Varanasi' | 'Jaipur';
  isNearCity?: boolean;
  nearCityDetails?: string; // e.g. "Near Jaipur (Pushkar, 140km)"
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  dateStatus: EventDateStatus;
  status: 'Published' | 'Draft' | 'Archived';
  lifecycleStatus?: EventLifecycleStatus; // Computed automatically or saved
  isCancelled?: boolean;
  cancelledReason?: string;
  dateChangeHistory?: DateChangeRecord[];
  venueEn: string;
  venueHi: string;
  descriptionEn: string;
  descriptionHi: string;
  longDescriptionEn: string;
  longDescriptionHi: string;
  culturalSignificanceEn: string;
  culturalSignificanceHi: string;
  visitorExperienceEn: string[];
  visitorExperienceHi: string[];
  scheduleDetails?: string;
  entryFeeEn?: string;
  entryFeeHi?: string;
  registrationUrl?: string;
  visitorInstructionsEn?: string[];
  visitorInstructionsHi?: string[];
  coverImage: string;
  imageAltText: string;
  organizer: string;
  officialSourceUrl: string;
  lastVerifiedAt: string; // YYYY-MM-DD
  featured?: boolean;
}

export interface SyncSourceConfig {
  id: string;
  name: string;
  city: 'Varanasi' | 'Jaipur' | 'Both';
  authority: string;
  url: string;
  feedType: 'GOVERNMENT_TOURISM' | 'DISTRICT_ADMINISTRATION' | 'CULTURAL_ACADEMY' | 'CALENDAR_REGISTRY';
  status: 'Active' | 'Paused' | 'Error';
  lastCheckedAt?: string;
  eventsFoundCount?: number;
}

export interface SyncAuditLog {
  id: string;
  timestamp: string; // ISO
  triggeredBy: 'SCHEDULED_AUTOMATION' | 'ADMIN_MANUAL' | 'APP_INITIALIZATION';
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  sourcesChecked: number;
  discoveredCount: number;
  updatedCount: number;
  expiredCount: number;
  cancelledCount: number;
  errorMessages?: string[];
  summary: string;
}

export interface EventSyncMetadata {
  lastSyncAt: string | null;
  nextScheduledSyncAt: string | null;
  activeSourcesCount: number;
  totalSyncedEvents: number;
  upcomingCount: number;
  ongoingCount: number;
  expiredCount: number;
  cancelledCount: number;
  awaitingReviewCount: number;
  recentLogs: SyncAuditLog[];
}

export interface TravelExperience {
  id: string;
  title: string;
  hindiTitle?: string;
  tagline: string;
  category:
    | 'Spiritual Experience'
    | 'Heritage Walk'
    | 'Local Food Exploration'
    | 'Ghat Exploration'
    | 'Sunrise Experience'
    | 'Local Market Visit'
    | 'Cultural Experience'
    | 'Customized City Tour';
  duration: string;
  description: string;
  highlights: string[];
  recommendedTimes: string[];
  includedHighlights: string[];
  coverImage: string;
  badge?: string;
}

export interface TravelBuddy {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  languages: string[];
  expertise: string[];
  experienceYears: number;
  ratingDemo: number;
  totalTripsDemo: number;
  status: BuddyApplicationStatus;
  gender: 'Male' | 'Female' | 'Other';
  availabilityNote: string;
  verifiedBadges: string[];
  nativeOf: string;
  specialityGhats: string[];
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  multiDayDailyRate: number;
  maxGroupSize: number;
  availableTimeSlots?: string[];
  servicesOffered?: string[];
  placesCovered?: string[];
  reviews?: {
    id: string;
    travelerName: string;
    origin: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface TravelRequest {
  id: string;
  bookingRef: string;
  destination: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  isMultiDay: boolean;
  category: BookingCategory;
  durationText: string;
  travelerCount: number;
  adultsCount?: number;
  childrenCount?: number;
  travelerCountryCity?: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  pickupLocation: string;
  preferredLanguage: string;
  interests: string[];
  selectedPlaces?: string[];
  crowdPreference: 'Peaceful Locations' | 'Popular/Crowded Attractions' | 'Balanced Experiences';
  buddyGenderPreference?: 'Any' | 'Female' | 'Male';
  specialRequests?: string;
  status: BookingStatus;
  assignedBuddyId?: string;
  assignedBuddyName?: string;
  createdAt: string;
  priceBreakdown?: {
    baseRate: number;
    durationLabel: string;
    travelerSurcharge: number;
    selectedPlacesCost: number;
    serviceFee: number;
    totalAmount: number;
  };
  estimatedPriceDisplay: string;
  timeline: {
    title: string;
    description: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
  }[];
}

export interface Testimonial {
  id: string;
  travelerName: string;
  origin: string;
  tripType: string;
  quote: string;
  buddyName: string;
  travelDate: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Booking & Buddies' | 'Safety' | 'Pricing & Cancellation';
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
  internalNotes?: string;
}

export interface SavedItemsState {
  buddyIds: string[];
  destinationIds: string[];
  experienceIds: string[];
  packageIds: string[];
}

export interface ReviewItem {
  id: string;
  bookingRef: string;
  travelerName: string;
  buddyId?: string;
  buddyName: string;
  city: 'Varanasi' | 'Jaipur';
  rating: number;
  comment: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Flagged';
}

export interface SupportTicket {
  id: string;
  ticketRef: string;
  userId: string;
  userName: string;
  userRole: 'traveler' | 'buddy';
  subject: string;
  category: 'Booking Issue' | 'Safety Concern' | 'Payment & Refund' | 'General Query' | 'Dispute';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  responses?: {
    sender: 'user' | 'admin';
    message: string;
    timestamp: string;
  }[];
}

export interface AppNotification {
  id: string;
  userId: string; // or 'all', 'traveler', 'buddy'
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  type: 'booking' | 'system' | 'announcement' | 'alert';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface TravelPackage {
  id: string;
  titleEn: string;
  titleHi: string;
  city: 'Varanasi' | 'Jaipur';
  category: 'Spiritual' | 'Heritage' | 'Food' | 'Full Day' | 'Custom';
  duration: string;
  descriptionEn: string;
  descriptionHi: string;
  price: number;
  maxPartySize: number;
  includedEn: string[];
  includedHi: string[];
  coverImage: string;
  status: 'Published' | 'Draft';
}

export interface BuddyServiceItem {
  id: string;
  buddyId: string;
  name: string;
  city: 'Varanasi' | 'Jaipur';
  description: string;
  duration: string;
  capacity: number;
  rate: number;
  status: 'Active' | 'Under Review' | 'Inactive';
}

export interface BuddyDocument {
  id: string;
  buddyId: string;
  docType: 'Aadhaar Card' | 'Passport' | 'Police Clearance' | 'Degree / Guide Certificate';
  docNumber: string;
  status: 'Approved' | 'Under Review' | 'Rejected' | 'Not Submitted';
  uploadedAt: string;
  rejectionReason?: string;
}
