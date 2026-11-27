import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Layouts (Loaded eagerly for instant structural framing)
import { MainLayout } from '../components/layout/MainLayout';
import { TravelerLayout } from '../pages/traveler/TravelerLayout';
import { BuddyLayout } from '../pages/buddy/BuddyLayout';
import { AdminLayout } from '../pages/admin/AdminLayout';

// Critical First-Screen Public Pages (Eagerly Loaded for Immediate LCP)
import { HomePage } from '../pages/public/HomePage';

// Code-Split Below-the-Fold / Secondary Public Routes
const DestinationsPage = lazy(() => import('../pages/public/DestinationsPage').then(m => ({ default: m.DestinationsPage })));
const DestinationDetailPage = lazy(() => import('../pages/public/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })));
const ExperiencesPage = lazy(() => import('../pages/public/ExperiencesPage').then(m => ({ default: m.ExperiencesPage })));
const BuddiesPage = lazy(() => import('../pages/public/BuddiesPage').then(m => ({ default: m.BuddiesPage })));
const BuddyDetailPage = lazy(() => import('../pages/public/BuddyDetailPage').then(m => ({ default: m.BuddyDetailPage })));
const BookingSystemPage = lazy(() => import('../pages/public/BookingSystemPage').then(m => ({ default: m.BookingSystemPage })));
const EventsPage = lazy(() => import('../pages/public/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('../pages/public/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const AboutPage = lazy(() => import('../pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const SafetyPage = lazy(() => import('../pages/public/SafetyPage').then(m => ({ default: m.SafetyPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQsPage = lazy(() => import('../pages/public/FAQsPage').then(m => ({ default: m.FAQsPage })));
const LegalPages = lazy(() => import('../pages/public/LegalPages').then(m => ({ default: m.LegalPages })));

// Auth Pages (Lazy-loaded on demand)
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));

// Code-Split Traveler Dashboard Pages
const TravelerDashboardPage = lazy(() => import('../pages/traveler/TravelerDashboardPage').then(m => ({ default: m.TravelerDashboardPage })));
const TravelerRequestsPage = lazy(() => import('../pages/traveler/TravelerRequestsPage').then(m => ({ default: m.TravelerRequestsPage })));
const TravelerRequestDetailPage = lazy(() => import('../pages/traveler/TravelerRequestDetailPage').then(m => ({ default: m.TravelerRequestDetailPage })));
const TravelerProfileSettingsPages = lazy(() => import('../pages/traveler/TravelerProfileSettingsPages').then(m => ({ default: m.TravelerProfileSettingsPages })));

// Code-Split Buddy Dashboard Pages
const BuddyDashboardPage = lazy(() => import('../pages/buddy/BuddyDashboardPage').then(m => ({ default: m.BuddyDashboardPage })));
const BuddyModulePages = lazy(() => import('../pages/buddy/BuddyModulePages').then(m => ({ default: m.BuddyModulePages })));

// Code-Split Admin Panel Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminBookingsPage = lazy(() => import('../pages/admin/AdminBookingsPage').then(m => ({ default: m.AdminBookingsPage })));
const AdminMatcherPage = lazy(() => import('../pages/admin/AdminMatcherPage').then(m => ({ default: m.AdminMatcherPage })));
const AdminEventsPage = lazy(() => import('../pages/admin/AdminEventsPage').then(m => ({ default: m.AdminEventsPage })));
const AdminModulePages = lazy(() => import('../pages/admin/AdminModulePages').then(m => ({ default: m.AdminModulePages })));

// Minimal Skeleton Fallback fitting Apple/Ivory design
const RouteLoadingFallback = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center p-8">
    <div className="w-6 h-6 rounded-full border-2 border-[#E8E8E6] border-t-[#FF5F1F] animate-spin" />
  </div>
);

/**
 * Role-Based Access Control (RBAC) Route Guard
 * Enforces that only users with the specific assigned role can access dashboard layouts
 */
const ProtectedRoleRoute: React.FC<{
  allowedRole: 'traveler' | 'buddy' | 'admin';
  children: React.ReactElement;
}> = ({ allowedRole, children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    // Unauthenticated: redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    // Authenticated but unauthorized: redirect to user's assigned dashboard
    if (currentUser.role === 'traveler') {
      return <Navigate to="/traveler/dashboard" replace />;
    } else if (currentUser.role === 'buddy') {
      return <Navigate to="/buddy/dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
      {/* Public Pages wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/buddies" element={<BuddiesPage />} />
        <Route path="/buddies/:id" element={<BuddyDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/book" element={<BookingSystemPage />} />
        <Route path="/how-it-works" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/privacy-policy" element={<LegalPages type="privacy" />} />
        <Route path="/terms-conditions" element={<LegalPages type="terms" />} />
        <Route path="/cancellation-policy" element={<LegalPages type="cancellation" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Traveler Dashboard Routes (Protected) */}
      <Route
        path="/traveler"
        element={
          <ProtectedRoleRoute allowedRole="traveler">
            <TravelerLayout />
          </ProtectedRoleRoute>
        }
      >
        <Route index element={<Navigate to="/traveler/dashboard" replace />} />
        <Route path="dashboard" element={<TravelerDashboardPage />} />
        <Route path="requests" element={<TravelerRequestsPage />} />
        <Route path="requests/:id" element={<TravelerRequestDetailPage />} />
        <Route path="trips" element={<TravelerProfileSettingsPages type="trips" />} />
        <Route path="saved" element={<TravelerProfileSettingsPages type="saved" />} />
        <Route path="profile" element={<TravelerProfileSettingsPages type="profile" />} />
        <Route path="notifications" element={<TravelerProfileSettingsPages type="notifications" />} />
        <Route path="history" element={<TravelerProfileSettingsPages type="history" />} />
        <Route path="payments" element={<TravelerProfileSettingsPages type="payments" />} />
        <Route path="support" element={<TravelerProfileSettingsPages type="support" />} />
        <Route path="settings" element={<TravelerProfileSettingsPages type="settings" />} />
      </Route>

      {/* Buddy Dashboard Routes (Protected) */}
      <Route
        path="/buddy"
        element={
          <ProtectedRoleRoute allowedRole="buddy">
            <BuddyLayout />
          </ProtectedRoleRoute>
        }
      >
        <Route index element={<Navigate to="/buddy/dashboard" replace />} />
        <Route path="dashboard" element={<BuddyDashboardPage />} />
        <Route path="assignments" element={<BuddyDashboardPage />} />
        <Route path="profile" element={<BuddyModulePages type="profile" />} />
        <Route path="verification" element={<BuddyModulePages type="verification" />} />
        <Route path="services" element={<BuddyModulePages type="services" />} />
        <Route path="availability" element={<BuddyModulePages type="availability" />} />
        <Route path="upcoming-trips" element={<BuddyDashboardPage />} />
        <Route path="trip-history" element={<BuddyModulePages type="history" />} />
        <Route path="earnings" element={<BuddyModulePages type="earnings" />} />
        <Route path="feedback" element={<BuddyModulePages type="feedback" />} />
        <Route path="notifications" element={<BuddyModulePages type="notifications" />} />
        <Route path="settings" element={<BuddyModulePages type="settings" />} />
      </Route>

      {/* Admin Panel Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="buddies" element={<AdminModulePages type="buddies" />} />
        <Route path="applications" element={<AdminModulePages type="applications" />} />
        <Route path="matcher" element={<AdminMatcherPage />} />
        <Route path="travelers" element={<AdminModulePages type="travelers" />} />
        <Route path="cities" element={<AdminModulePages type="cities" />} />
        <Route path="destinations" element={<AdminModulePages type="destinations" />} />
        <Route path="packages" element={<AdminModulePages type="packages" />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="services" element={<AdminModulePages type="services" />} />
        <Route path="reviews" element={<AdminModulePages type="reviews" />} />
        <Route path="enquiries" element={<AdminModulePages type="enquiries" />} />
        <Route path="support" element={<AdminModulePages type="support" />} />
        <Route path="notifications" element={<AdminModulePages type="notifications" />} />
        <Route path="email-templates" element={<AdminModulePages type="email-templates" />} />
        <Route path="cms" element={<AdminModulePages type="cms" />} />
        <Route path="reports" element={<AdminModulePages type="reports" />} />
        <Route path="roles" element={<AdminModulePages type="roles" />} />
        <Route path="audit" element={<AdminModulePages type="audit" />} />
        <Route path="settings" element={<AdminModulePages type="settings" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
