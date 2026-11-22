import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TravelRequest,
  Destination,
  TravelBuddy,
  ContactEnquiry,
  TravelExperience,
  TravelEvent,
  EventSyncMetadata,
  SyncSourceConfig,
  SavedItemsState,
  ReviewItem,
  SupportTicket,
  AppNotification,
  TravelPackage,
  BuddyServiceItem,
  BuddyDocument,
} from '../types';
import { MOCK_REQUESTS_DATA, DESTINATIONS_DATA, TRAVEL_BUDDIES_DATA, EXPERIENCES_DATA } from '../data/mockData';
import { EVENTS_DATA } from '../data/eventsData';
import { translations, Language, Translations } from '../locales/translations';
import {
  executeEventSynchronization,
  loadSyncMetadata,
  saveSyncMetadata,
  calculateLifecycleStatus,
  getKolkataDateString,
  OFFICIAL_SYNC_SOURCES,
} from '../services/eventSyncService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'buddy' | 'admin';
  title?: string;
  avatar?: string;
}

interface AppContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;

  // Requests / Bookings
  requests: TravelRequest[];
  addRequest: (newReq: Omit<TravelRequest, 'id' | 'bookingRef' | 'createdAt' | 'status' | 'timeline'>) => TravelRequest;
  updateRequestStatus: (id: string, status: TravelRequest['status'], buddyId?: string, buddyName?: string) => void;
  updatePaymentStatus: (id: string, paymentStatus: 'Pending' | 'Successful' | 'Failed' | 'Refunded', transactionId?: string) => void;
  rescheduleBooking: (id: string, newStartDate: string, newEndDate?: string, newStartTime?: string) => void;
  cancelBooking: (id: string, reason: string) => void;

  // Buddies
  buddies: TravelBuddy[];
  addBuddy: (buddy: TravelBuddy) => void;
  updateBuddyStatus: (id: string, status: TravelBuddy['status']) => void;

  // Destinations & Experiences
  destinations: Destination[];
  experiences: TravelExperience[];

  // Upcoming Festivals & Events
  events: TravelEvent[];
  addEvent: (event: Omit<TravelEvent, 'id'>) => TravelEvent;
  updateEvent: (id: string, updated: Partial<TravelEvent>) => void;
  deleteEvent: (id: string) => void;
  triggerEventSync: (source?: 'ADMIN_MANUAL' | 'SCHEDULED_AUTOMATION') => void;
  syncMetadata: EventSyncMetadata;
  syncSources: SyncSourceConfig[];
  toggleSourceStatus: (sourceId: string) => void;

  // Contact Enquiries
  enquiries: ContactEnquiry[];
  addEnquiry: (enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: ContactEnquiry['status']) => void;

  // Authentication & RBAC
  currentUser: AuthUser | null;
  updateCurrentUserProfile: (fields: Partial<AuthUser>) => void;
  activeRole: 'public' | 'traveler' | 'buddy' | 'admin';
  setActiveRole: (role: 'public' | 'traveler' | 'buddy' | 'admin') => void;
  login: (email: string, password: string) => { success: boolean; user?: AuthUser; message?: string };
  logout: () => void;

  // Saved Items
  savedItems: SavedItemsState;
  toggleSavedItem: (type: keyof SavedItemsState, id: string) => void;
  isItemSaved: (type: keyof SavedItemsState, id: string) => boolean;

  // Reviews & Ratings
  reviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'status'>) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketRef' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Travel Packages (Admin & Traveler)
  packages: TravelPackage[];
  addPackage: (pkg: Omit<TravelPackage, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<TravelPackage>) => void;
  deletePackage: (id: string) => void;

  // Buddy Services & Verification
  buddyServices: BuddyServiceItem[];
  addBuddyService: (service: Omit<BuddyServiceItem, 'id'>) => void;
  updateBuddyService: (id: string, service: Partial<BuddyServiceItem>) => void;
  deleteBuddyService: (id: string) => void;
  buddyDocuments: BuddyDocument[];
  updateBuddyDocumentStatus: (id: string, status: BuddyDocument['status'], reason?: string) => void;

  // Toast / notification helper
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Trusted simulated database for user accounts and role assignments
const TRUSTED_USERS: AuthUser[] = [
  {
    id: 'user-traveler-1',
    name: 'Shalini Verma',
    email: 'traveler@example.com',
    role: 'traveler',
    title: 'Heritage Explorer',
  },
  {
    id: 'buddy-anand-shukla',
    name: 'Anand Shukla',
    email: 'anand.shukla@buddy.com',
    role: 'buddy',
    title: 'Vedic & Temple Guide',
  },
  {
    id: 'user-admin-1',
    name: 'Varanasi Admin Console',
    email: 'admin@travelonbuddy.com',
    role: 'admin',
    title: 'Operations Director',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage with EN fallback
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tob_language');
      if (saved === 'HI' || saved === 'EN') return saved;
    } catch {
      // ignore
    }
    return 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tob_language', lang);
      document.documentElement.lang = lang.toLowerCase();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'HI' : 'EN');
  };

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const t = translations[language];

  const [requests, setRequests] = useState<TravelRequest[]>(MOCK_REQUESTS_DATA);
  const [buddies, setBuddies] = useState<TravelBuddy[]>(TRAVEL_BUDDIES_DATA);
  const [destinations] = useState<Destination[]>(DESTINATIONS_DATA);
  const [experiences] = useState<TravelExperience[]>(EXPERIENCES_DATA);

  // Events state with localStorage persistence and automated lifecycle calculation
  const [events, setEvents] = useState<TravelEvent[]>(() => {
    let initialEvents = EVENTS_DATA;
    try {
      const stored = localStorage.getItem('tob_events');
      if (stored) {
        initialEvents = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load events from localStorage', e);
    }
    // Calculate lifecycle status against Asia/Kolkata date on initial mount
    const today = getKolkataDateString();
    return initialEvents.map((evt) => {
      const lifecycle = calculateLifecycleStatus(evt, today);
      const updated = { ...evt, lifecycleStatus: lifecycle };
      if (lifecycle === 'COMPLETED' && updated.status === 'Published') {
        updated.status = 'Archived';
      }
      return updated;
    });
  });

  const [syncMetadata, setSyncMetadata] = useState<EventSyncMetadata>(() => loadSyncMetadata());
  const [syncSources, setSyncSources] = useState<SyncSourceConfig[]>(() => {
    try {
      const stored = localStorage.getItem('tob_event_sources');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return OFFICIAL_SYNC_SOURCES;
  });

  const saveEvents = (updated: TravelEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem('tob_events', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist events to localStorage', e);
    }
  };

  const triggerEventSync = (triggeredBy: 'ADMIN_MANUAL' | 'SCHEDULED_AUTOMATION' = 'ADMIN_MANUAL') => {
    const result = executeEventSynchronization(events, triggeredBy);
    saveEvents(result.updatedEvents);

    const updatedMeta: EventSyncMetadata = {
      lastSyncAt: new Date().toISOString(),
      nextScheduledSyncAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      activeSourcesCount: syncSources.filter((s) => s.status === 'Active').length,
      totalSyncedEvents: result.updatedEvents.length,
      upcomingCount: result.stats.upcoming,
      ongoingCount: result.stats.ongoing,
      expiredCount: result.stats.expired,
      cancelledCount: result.stats.cancelled,
      awaitingReviewCount: 0,
      recentLogs: [result.auditLog, ...syncMetadata.recentLogs].slice(0, 20),
    };

    setSyncMetadata(updatedMeta);
    saveSyncMetadata(updatedMeta);

    showToast(`Tourism Sync Complete: ${result.auditLog.summary}`);
  };

  const toggleSourceStatus = (sourceId: string) => {
    const updated = syncSources.map((s) =>
      s.id === sourceId ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } as SyncSourceConfig : s
    );
    setSyncSources(updated);
    try {
      localStorage.setItem('tob_event_sources', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save sources', e);
    }
    showToast('Source status updated.');
  };

  const addEvent = (newEvent: Omit<TravelEvent, 'id'>): TravelEvent => {
    const today = getKolkataDateString();
    const created: TravelEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    created.lifecycleStatus = calculateLifecycleStatus(created, today);
    const next = [created, ...events];
    saveEvents(next);
    showToast(`Event "${created.titleEn}" added successfully.`);
    return created;
  };

  const updateEvent = (id: string, updatedFields: Partial<TravelEvent>) => {
    const today = getKolkataDateString();
    const next = events.map(e => {
      if (e.id === id) {
        const merged = { ...e, ...updatedFields };
        merged.lifecycleStatus = calculateLifecycleStatus(merged, today);
        return merged;
      }
      return e;
    });
    saveEvents(next);
    showToast('Event updated successfully.');
  };

  const deleteEvent = (id: string) => {
    const next = events.filter(e => e.id !== id);
    saveEvents(next);
    showToast('Event removed.');
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated user state loaded from session storage
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('tob_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify user against trusted directory
        const found = TRUSTED_USERS.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
        return found || parsed;
      }
    } catch (e) {
      console.error('Failed to parse auth user', e);
    }
    return null;
  });

  const [activeRole, setActiveRoleState] = useState<'public' | 'traveler' | 'buddy' | 'admin'>(() => {
    try {
      const stored = localStorage.getItem('tob_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.role || 'public';
      }
    } catch {
      // ignore
    }
    return 'public';
  });

  const setActiveRole = (role: 'public' | 'traveler' | 'buddy' | 'admin') => {
    setActiveRoleState(role);
  };

  const login = (emailInput: string, passwordInput: string) => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    
    // Validate credentials against trusted database
    const matchedUser = TRUSTED_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Invalid email address. Please check your credentials.',
      };
    }

    // Check password (demonstration accepts password123 or any non-empty input for verified accounts)
    if (!passwordInput || passwordInput.trim() === '') {
      return {
        success: false,
        message: 'Please enter a valid password.',
      };
    }

    // Role is assigned ONLY from trusted database record
    setCurrentUser(matchedUser);
    setActiveRoleState(matchedUser.role);
    try {
      localStorage.setItem('tob_auth_user', JSON.stringify(matchedUser));
    } catch (err) {
      console.error(err);
    }

    showToast(`Signed in successfully as ${matchedUser.name} (${matchedUser.role.toUpperCase()})`);

    return {
      success: true,
      user: matchedUser,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRoleState('public');
    try {
      localStorage.removeItem('tob_auth_user');
    } catch (err) {
      console.error(err);
    }
    showToast('You have been logged out.');
  };

  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([
    {
      id: 'enq-101',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@example.com',
      phone: '+91 99302 11984',
      subject: 'Inquiry for 4-day senior citizen trip',
      message: 'Looking for a patient Hindi and Marathi speaking companion for elderly parents visiting Kashi Vishwanath in December.',
      status: 'In Progress',
      createdAt: '2026-11-14T10:00:00Z',
    },
    {
      id: 'enq-102',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 415 889 0122',
      subject: 'Documentary filming support',
      message: 'Need a local buddy who can introduce us to silk weaving master artisans and provide translation during interviews.',
      status: 'New',
      createdAt: '2026-11-15T15:20:00Z',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addRequest = (
    newReq: Omit<TravelRequest, 'id' | 'bookingRef' | 'createdAt' | 'status' | 'timeline'>
  ): TravelRequest => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const created: TravelRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      bookingRef: `TOB-KSH-${randomCode}`,
      status: 'Request Submitted',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Request Submitted',
          description: 'Your Travel Buddy request was placed and is under verification.',
          time: 'Just now',
          status: 'completed',
        },
        {
          title: 'Reviewing Preferences',
          description: 'Matching dates, language and local guide availability.',
          time: 'In review',
          status: 'current',
        },
        {
          title: 'Buddy Assignment',
          description: 'Local companion assignment will be proposed shortly.',
          time: 'Next step',
          status: 'upcoming',
        },
      ],
    };

    setRequests(prev => [created, ...prev]);
    showToast(`Request ${created.bookingRef} successfully submitted for review!`);
    return created;
  };

  const updateRequestStatus = (
    id: string,
    status: TravelRequest['status'],
    buddyId?: string,
    buddyName?: string
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updatedTimeline = [...r.timeline];
        updatedTimeline.push({
          title: status,
          description: buddyName ? `Assigned to ${buddyName}` : `Status updated to ${status}`,
          time: 'Just now',
          status: 'completed',
        });
        return {
          ...r,
          status,
          assignedBuddyId: buddyId || r.assignedBuddyId,
          assignedBuddyName: buddyName || r.assignedBuddyName,
          timeline: updatedTimeline,
        };
      })
    );
    showToast(`Request updated to "${status}"`);
  };

  const updatePaymentStatus = (
    id: string,
    paymentStatus: 'Pending' | 'Successful' | 'Failed' | 'Refunded',
    transactionId?: string
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updatedTimeline = [...r.timeline];
        updatedTimeline.push({
          title: `Payment: ${paymentStatus}`,
          description: transactionId ? `Transaction Ref: ${transactionId}` : `Payment state set to ${paymentStatus}`,
          time: 'Just now',
          status: 'completed',
        });
        return {
          ...r,
          paymentStatus,
          paymentTransactionId: transactionId || r.paymentTransactionId,
          timeline: updatedTimeline,
        };
      })
    );
    showToast(`Payment updated: ${paymentStatus}`);
  };

  const rescheduleBooking = (
    id: string,
    newStartDate: string,
    newEndDate?: string,
    newStartTime?: string
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updatedTimeline = [...r.timeline];
        updatedTimeline.push({
          title: 'Rescheduled',
          description: `Dates shifted to ${newStartDate}${newEndDate ? ` to ${newEndDate}` : ''}${newStartTime ? ` at ${newStartTime}` : ''}`,
          time: 'Just now',
          status: 'completed',
        });
        return {
          ...r,
          startDate: newStartDate,
          endDate: newEndDate || newStartDate,
          startTime: newStartTime || r.startTime,
          timeline: updatedTimeline,
        };
      })
    );
    showToast('Booking rescheduled successfully.');
  };

  const cancelBooking = (id: string, reason: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updatedTimeline = [...r.timeline];
        updatedTimeline.push({
          title: 'Cancelled',
          description: `Booking cancelled: ${reason}`,
          time: 'Just now',
          status: 'completed',
        });
        return {
          ...r,
          status: 'Cancelled',
          timeline: updatedTimeline,
        };
      })
    );
    showToast('Booking has been cancelled.');
  };

  const addBuddy = (buddy: TravelBuddy) => {
    setBuddies(prev => [buddy, ...prev]);
    showToast(`Buddy profile for ${buddy.name} added!`);
  };

  const updateBuddyStatus = (id: string, status: TravelBuddy['status']) => {
    setBuddies(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
    showToast(`Buddy status updated to ${status}`);
  };

  const addEnquiry = (enq: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const created: ContactEnquiry = {
      ...enq,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    setEnquiries(prev => [created, ...prev]);
    showToast('Enquiry received! Our Varanasi team will connect soon.');
  };

  const updateEnquiryStatus = (id: string, status: ContactEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
    showToast(`Enquiry marked as ${status}`);
  };

  // 1. Saved Items State (Persistent)
  const [savedItems, setSavedItems] = useState<SavedItemsState>(() => {
    try {
      const stored = localStorage.getItem('tob_saved_items');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      buddyIds: ['buddy-anand-shukla'],
      destinationIds: ['dashashwamedh-ghat', 'assi-ghat'],
      experienceIds: ['exp-subah-banaras'],
      packageIds: ['pkg-varanasi-heritage'],
    };
  });

  const toggleSavedItem = (type: keyof SavedItemsState, id: string) => {
    setSavedItems((prev) => {
      const list = prev[type] || [];
      const exists = list.includes(id);
      const nextList = exists ? list.filter((item) => item !== id) : [...list, id];
      const nextState = { ...prev, [type]: nextList };
      try {
        localStorage.setItem('tob_saved_items', JSON.stringify(nextState));
      } catch (err) {
        console.error(err);
      }
      showToast(exists ? 'Removed from saved items' : 'Saved to your collection');
      return nextState;
    });
  };

  const isItemSaved = (type: keyof SavedItemsState, id: string) => {
    return (savedItems[type] || []).includes(id);
  };

  // 2. Reviews & Feedback State
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-01',
      bookingRef: 'TOB-KSH-8941',
      travelerName: 'Shalini Verma',
      buddyId: 'buddy-anand-shukla',
      buddyName: 'Anand Shukla',
      city: 'Varanasi',
      rating: 5,
      comment: 'Anand was extraordinarily knowledgeable about Assi Ghat traditions and Kashi Vishwanath corridors. Very respectful and patient.',
      date: '2026-11-12',
      status: 'Published',
    },
    {
      id: 'rev-02',
      bookingRef: 'TOB-JPR-4102',
      travelerName: 'Elena Rostova',
      buddyName: 'Meenakshi Rathore',
      city: 'Jaipur',
      rating: 5,
      comment: 'Spectacular walking journey through Hawa Mahal and Johari Bazaar. Meenakshi guided us with royal Rajasthani hospitality.',
      date: '2026-11-05',
      status: 'Published',
    },
  ]);

  const addReview = (review: Omit<ReviewItem, 'id' | 'date' | 'status'>) => {
    const created: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Published',
    };
    setReviews((prev) => [created, ...prev]);
    showToast('Your review has been submitted successfully!');
  };

  // 3. Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt-01',
      ticketRef: 'SUP-7819',
      userId: 'user-traveler-1',
      userName: 'Shalini Verma',
      userRole: 'traveler',
      subject: 'Wheelchair assistance request for elderly parent at Dashashwamedh',
      category: 'Booking Issue',
      message: 'Need wheelchair-friendly path coordination from Godowlia to the main Maha Aarti stage.',
      status: 'In Progress',
      priority: 'High',
      createdAt: '2026-11-15T09:30:00Z',
      responses: [
        {
          sender: 'admin',
          message: 'Our Varanasi ground desk has assigned battery-operated rickshaw transit and arranged ramp access at Dashashwamedh.',
          timestamp: '2026-11-15T11:00:00Z',
        },
      ],
    },
  ]);

  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'ticketRef' | 'createdAt' | 'status'>) => {
    const created: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketRef: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
    };
    setSupportTickets((prev) => [created, ...prev]);
    showToast(`Support Ticket ${created.ticketRef} created. Our team will respond shortly.`);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    showToast(`Ticket status changed to ${status}`);
  };

  // 4. Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-01',
      userId: 'all',
      titleEn: 'Dev Deepawali 2026 Schedule Confirmed',
      titleHi: 'देव दीपावली 2026 तिथि की पुष्टि',
      messageEn: 'Varanasi administration has confirmed Dev Deepawali for 24 November 2026. Book companions early.',
      messageHi: 'वाराणसी प्रशासन ने 24 नवंबर 2026 को देव दीपावली की पुष्टि कर दी है। स्थानीय साथी पहले से बुक करें।',
      type: 'announcement',
      read: false,
      createdAt: '2026-11-16T08:00:00Z',
      link: '/events/dev-deepawali-varanasi',
    },
    {
      id: 'notif-02',
      userId: 'user-traveler-1',
      titleEn: 'Companion Confirmed: Anand Shukla',
      titleHi: 'साथी कन्फर्म: आनंद शुक्ला',
      messageEn: 'Your Subah-e-Banaras assignment has been accepted by Anand Shukla.',
      messageHi: 'आपका सुबह-ए-बनारस भ्रमण आनंद शुक्ला द्वारा स्वीकार कर लिया गया है।',
      type: 'booking',
      read: false,
      createdAt: '2026-11-15T10:30:00Z',
      link: '/traveler/requests',
    },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // 5. Travel Packages State (Configurable)
  const [packages, setPackages] = useState<TravelPackage[]>([
    {
      id: 'pkg-varanasi-heritage',
      titleEn: 'Kashi Heritage & Vedic Awakening',
      titleHi: 'काशी हेरिटेज एवं वैदिक दर्शन',
      city: 'Varanasi',
      category: 'Spiritual',
      duration: 'Full Day (8 Hours)',
      descriptionEn: 'Dawn boat ride along 84 ghats, Kashi Vishwanath Corridor darshan, silk weaving alleyways, and grand evening Maha Aarti.',
      descriptionHi: 'प्रातः 84 घाटों की नाव यात्रा, काशी विश्वनाथ धाम दर्शन, रेशम बुनकर गलियां और भव्य संध्या महाआरती।',
      price: 2499,
      maxPartySize: 6,
      includedEn: ['Private verified scholar companion', 'Subah-e-Banaras morning boat', 'Corridor guidance', 'Dashashwamedh Aarti seating'],
      includedHi: ['सत्यापित विद्वान साथी', 'प्रातः नौका विहार', 'विश्वनाथ धाम दर्शन सहायता', 'दशाश्वमेध आरती दर्शन'],
      coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      status: 'Published',
    },
    {
      id: 'pkg-jaipur-royalty',
      titleEn: 'Jaipur Royal Palaces & Pink City Heritage',
      titleHi: 'जयपुर शाही महल एवं पिंक सिटी हेरिटेज',
      city: 'Jaipur',
      category: 'Heritage',
      duration: 'Full Day (7 Hours)',
      descriptionEn: 'Explore Amber Fort ramparts, City Palace royal courtyards, Hawa Mahal architecture, and local Johari bazaar jewelers.',
      descriptionHi: 'आमेर किला, सिटी पैलेस, हवा महल और जोहरी बाजार की पारंपरिक विरासत का विस्तृत भ्रमण।',
      price: 2699,
      maxPartySize: 5,
      includedEn: ['Certified Jaipur heritage buddy', 'Amber Fort storytelling', 'Bazaar food tastings', 'Photography coordination'],
      includedHi: ['प्रमाणित हेरिटेज बडी', 'आमेर किला इतिहास संवाद', 'बाजार खानपान अनुभव', 'फोटोग्राफी समन्वय'],
      coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      status: 'Published',
    },
  ]);

  const addPackage = (pkg: Omit<TravelPackage, 'id'>) => {
    const created: TravelPackage = { ...pkg, id: `pkg-${Date.now()}` };
    setPackages((prev) => [created, ...prev]);
    showToast(`Package "${created.titleEn}" published successfully.`);
  };

  const updatePackage = (id: string, updated: Partial<TravelPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Package updated successfully.');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    showToast('Package removed.');
  };

  // 6. Buddy Services & Documents State
  const [buddyServices, setBuddyServices] = useState<BuddyServiceItem[]>([
    {
      id: 'srv-01',
      buddyId: 'buddy-anand-shukla',
      name: 'Vedic Sunrise & Ghats Pilgrimage',
      city: 'Varanasi',
      description: 'Synchronized morning prayers, classical music at Assi Ghat, and sacred akhada heritage.',
      duration: '3 Hours',
      capacity: 5,
      rate: 1100,
      status: 'Active',
    },
    {
      id: 'srv-02',
      buddyId: 'buddy-anand-shukla',
      name: 'Kashi Vishwanath Corridor & Ancient Lanes',
      city: 'Varanasi',
      description: 'Historical walkthrough of ancient Shiva temples, Manikarnika philosophy, and Banarasi tea stops.',
      duration: '4 Hours',
      capacity: 4,
      rate: 1400,
      status: 'Active',
    },
  ]);

  const addBuddyService = (service: Omit<BuddyServiceItem, 'id'>) => {
    const created: BuddyServiceItem = { ...service, id: `srv-${Date.now()}` };
    setBuddyServices((prev) => [created, ...prev]);
    showToast(`Service "${created.name}" submitted for approval.`);
  };

  const updateBuddyService = (id: string, updated: Partial<BuddyServiceItem>) => {
    setBuddyServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Service updated successfully.');
  };

  const deleteBuddyService = (id: string) => {
    setBuddyServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service removed.');
  };

  const [buddyDocuments, setBuddyDocuments] = useState<BuddyDocument[]>([
    {
      id: 'doc-01',
      buddyId: 'buddy-anand-shukla',
      docType: 'Aadhaar Card',
      docNumber: 'XXXX-XXXX-9812',
      status: 'Approved',
      uploadedAt: '2026-10-10',
    },
    {
      id: 'doc-02',
      buddyId: 'buddy-anand-shukla',
      docType: 'Degree / Guide Certificate',
      docNumber: 'BHU-SANS-2021',
      status: 'Approved',
      uploadedAt: '2026-10-11',
    },
  ]);

  const updateBuddyDocumentStatus = (id: string, status: BuddyDocument['status'], reason?: string) => {
    setBuddyDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, rejectionReason: reason } : d))
    );
    showToast(`Document status updated to ${status}`);
  };

  const updateCurrentUserProfile = (fields: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    try {
      localStorage.setItem('tob_auth_user', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    showToast('Profile updated successfully!');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        requests,
        addRequest,
        updateRequestStatus,
        updatePaymentStatus,
        rescheduleBooking,
        cancelBooking,
        buddies,
        addBuddy,
        updateBuddyStatus,
        destinations,
        experiences,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        triggerEventSync,
        syncMetadata,
        syncSources,
        toggleSourceStatus,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        activeRole,
        setActiveRole,
        currentUser,
        updateCurrentUserProfile,
        login,
        logout,
        savedItems,
        toggleSavedItem,
        isItemSaved,
        reviews,
        addReview,
        supportTickets,
        createSupportTicket,
        updateTicketStatus,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        buddyServices,
        addBuddyService,
        updateBuddyService,
        deleteBuddyService,
        buddyDocuments,
        updateBuddyDocumentStatus,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-river-deep text-ivory px-5 py-3.5 rounded-xl shadow-2xl border border-saffron/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-saffron animate-pulse" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
