import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  Bell,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
  Calendar,
  CheckCircle,
  ShieldCheck,
  Briefcase,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BuddyLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { requests, currentUser, logout, language, notifications } = useApp();

  const myId = currentUser?.id || 'buddy-anand-shukla';

  // Buddy Anand Shukla's assigned requests
  const myAssignments = requests.filter(
    (r) => r.assignedBuddyId === myId || !r.assignedBuddyId
  );

  const pendingRequests = myAssignments.filter(
    (r) => r.status === 'Buddy Assignment Proposed' || r.status === 'Under Review' || r.status === 'Request Submitted'
  );

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const links = [
    { label: language === 'HI' ? 'अवलोकन' : 'Overview', path: '/buddy/dashboard', icon: LayoutDashboard },
    { label: language === 'HI' ? 'बुकिंग अनुरोध' : 'Booking Requests', path: '/buddy/assignments', icon: CalendarCheck, badge: pendingRequests.length > 0 ? pendingRequests.length : undefined },
    { label: language === 'HI' ? 'मेरी प्रोफ़ाइल' : 'My Profile', path: '/buddy/profile', icon: UserCheck },
    { label: language === 'HI' ? 'सत्यापन एवं दस्तावेज़' : 'Verification & Docs', path: '/buddy/verification', icon: ShieldCheck, badge: 'VERIFIED' },
    { label: language === 'HI' ? 'मेरी सेवाएं व मूल्य' : 'My Services & Pricing', path: '/buddy/services', icon: Briefcase },
    { label: language === 'HI' ? 'उपलब्धता कैलेंडर' : 'Availability Calendar', path: '/buddy/availability', icon: Calendar },
    { label: language === 'HI' ? 'आगामी असाइनमेंट' : 'Upcoming Assignments', path: '/buddy/upcoming-trips', icon: Clock },
    { label: language === 'HI' ? 'संपन्न यात्राएं' : 'Completed Trips', path: '/buddy/trip-history', icon: CheckCircle },
    { label: language === 'HI' ? 'कमाई एवं मानदेय' : 'Earnings & Payouts', path: '/buddy/earnings', icon: DollarSign },
    { label: language === 'HI' ? 'यात्री समीक्षाएं' : 'Traveler Feedback', path: '/buddy/feedback', icon: Star, badge: '4.95★' },
    { label: language === 'HI' ? 'सूचनाएं' : 'Notifications', path: '/buddy/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { label: language === 'HI' ? 'सहायता एवं सेटिंग्स' : 'Support & Settings', path: '/buddy/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col lg:flex-row text-charcoal">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white text-charcoal p-4 flex items-center justify-between border-b border-sand-border shadow-2xs">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TravelOnBuddy" className="h-8 w-auto object-contain" />
          <span className="font-serif font-bold text-lg text-river">TravelOnBuddy</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-light-orange text-saffron"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Warm Cream / White light design) */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-white text-charcoal border-r border-sand-border flex flex-col justify-between shrink-0 p-5 space-y-6 lg:min-h-screen`}
      >
        <div className="space-y-6">
          {/* Logo in Desktop */}
          <div className="hidden lg:flex items-center gap-2.5 pb-4 border-b border-sand-border">
            <img src="/logo.png" alt="TravelOnBuddy" className="h-10 w-auto object-contain" />
            <div>
              <span className="font-serif text-lg font-bold text-river block leading-none">
                {language === 'HI' ? 'बडी पोर्टल' : 'Buddy Portal'}
              </span>
              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest mt-0.5 block font-semibold">
                {language === 'HI' ? 'वाराणसी साथी डेस्क' : 'Varanasi Companion Desk'}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="p-3 rounded-xl bg-pale-orange border border-saffron/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
              <span className="text-deep-orange font-bold">{language === 'HI' ? 'स्वीकृत साथी' : 'Approved Host'}</span>
            </div>
            <span className="text-[10px] text-deep-orange font-mono font-bold">{language === 'HI' ? 'सक्रिय' : 'ACTIVE'}</span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-medium">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-light-orange text-deep-orange font-bold border border-saffron/30 shadow-2xs'
                      : 'text-charcoal hover:bg-sand hover:text-saffron'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-saffron' : 'text-charcoal-muted'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? 'bg-saffron text-white' : 'bg-sand border border-sand-border text-charcoal'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Return */}
        <div className="pt-4 border-t border-sand-border space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-pale-orange border border-sand-border">
            <div className="w-8 h-8 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'AS'}
            </div>
            <div className="text-left text-xs truncate">
              <span className="font-bold text-river block truncate">{currentUser?.name || 'Anand Shukla'}</span>
              <span className="text-[10px] text-charcoal-muted block truncate">{currentUser?.title || 'Vedic & Temple Guide'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Link
              to="/"
              className="py-2 px-2 rounded-lg border border-sand-border text-charcoal text-[11px] hover:bg-sand hover:text-saffron flex items-center justify-center gap-1.5 transition text-center"
            >
              <span>{language === 'HI' ? 'सार्वजनिक साइट' : 'Public Site'}</span>
            </Link>
            <button
              onClick={logout}
              type="button"
              className="py-2 px-2 rounded-lg border border-red-200 text-red-600 text-[11px] hover:bg-red-50 flex items-center justify-center gap-1.5 transition text-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 w-full min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
