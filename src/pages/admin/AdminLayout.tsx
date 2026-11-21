import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  UserCheck,
  FileText,
  MapPin,
  Sparkles,
  Star,
  Mail,
  HelpCircle,
  Bell,
  Sliders,
  BarChart3,
  Shield,
  Layers,
  Settings,
  Menu,
  X,
  LogOut,
  FolderGit2,
} from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { requests, enquiries, buddies, currentUser, logout, language, supportTickets } = useApp();

  const openTicketsCount = supportTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  const links = [
    { label: language === 'HI' ? 'डैशबोर्ड' : 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: language === 'HI' ? 'बुकिंग प्रबंधन' : 'Booking Management', path: '/admin/bookings', icon: CalendarCheck, badge: requests.length },
    { label: language === 'HI' ? 'बडी प्रबंधन' : 'Buddy Management', path: '/admin/buddies', icon: UserCheck, badge: buddies.length },
    { label: language === 'HI' ? 'बडी आवेदन' : 'Buddy Applications', path: '/admin/applications', icon: FileText, badge: 1 },
    { label: language === 'HI' ? 'बडी मैचर' : 'Buddy Matcher', path: '/admin/matcher', icon: Sparkles },
    { label: language === 'HI' ? 'यात्री' : 'Travelers', path: '/admin/travelers', icon: Users },
    { label: language === 'HI' ? 'शहर प्रबंधन' : 'City Management', path: '/admin/cities', icon: MapPin },
    { label: language === 'HI' ? 'गंतव्य' : 'Destinations', path: '/admin/destinations', icon: MapPin },
    { label: language === 'HI' ? 'पैकेज प्रबंधन' : 'Packages', path: '/admin/packages', icon: Layers },
    { label: language === 'HI' ? 'त्योहार एवं उत्सव' : 'Festivals & Events', path: '/admin/events', icon: CalendarCheck },
    { label: language === 'HI' ? 'सेवाएं एवं अनुभव' : 'Services & Immersions', path: '/admin/services', icon: Layers },
    { label: language === 'HI' ? 'समीक्षा एवं प्रतिक्रिया' : 'Reviews & Feedback', path: '/admin/reviews', icon: Star },
    { label: language === 'HI' ? 'संपर्क पूछताछ' : 'Contact Enquiries', path: '/admin/enquiries', icon: Mail, badge: enquiries.length },
    { label: language === 'HI' ? 'सपोर्ट टिकट' : 'Support Tickets', path: '/admin/support', icon: HelpCircle, badge: openTicketsCount > 0 ? openTicketsCount : undefined },
    { label: language === 'HI' ? 'सूचनाएं' : 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: language === 'HI' ? 'ईमेल टेम्प्लेट' : 'Email Templates', path: '/admin/email-templates', icon: Mail },
    { label: language === 'HI' ? 'वेबसाइट सीएमएस' : 'Website CMS', path: '/admin/cms', icon: Sliders },
    { label: language === 'HI' ? 'रिपोर्ट एवं विश्लेषण' : 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: language === 'HI' ? 'एडमिन भूमिकाएं' : 'Admin Roles', path: '/admin/roles', icon: Shield },
    { label: language === 'HI' ? 'ऑडिट लॉग' : 'Audit Logs', path: '/admin/audit', icon: FolderGit2 },
    { label: language === 'HI' ? 'सिस्टम सेटिंग्स' : 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col lg:flex-row text-charcoal">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white text-charcoal p-4 flex items-center justify-between border-b border-sand-border shadow-2xs">
        <Link to="/" className="flex items-center gap-2">
          <img src={getAssetUrl('logo.png')} alt="TravelOnBuddy" className="h-8 w-auto object-contain" />
          <span className="font-serif font-bold text-lg text-river">Admin Console</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-light-orange text-saffron"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar (Warm Cream / White light design) */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-72 bg-white text-charcoal border-r border-sand-border flex flex-col justify-between shrink-0 p-5 space-y-6 lg:min-h-screen`}
      >
        <div className="space-y-5">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2.5 pb-4 border-b border-sand-border">
            <img src={getAssetUrl('logo.png')} alt="TravelOnBuddy" className="h-10 w-auto object-contain" />
            <div>
              <span className="font-serif text-lg font-bold text-river block leading-none">
                TravelOnBuddy
              </span>
              <span className="text-[10px] text-deep-orange uppercase font-bold tracking-widest mt-0.5 block">
                Varanasi Operations HQ
              </span>
            </div>
          </div>

          {/* Quick Super Admin Tag */}
          <div className="text-[11px] p-2.5 rounded-xl bg-pale-orange border border-sand-border text-charcoal flex items-center justify-between">
            <span className="font-semibold text-river">Super Admin Console</span>
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
          </div>

          {/* Nav Links */}
          <nav className="space-y-0.5 text-xs font-medium max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-light-orange text-deep-orange font-bold border border-saffron/30 shadow-2xs'
                      : 'text-charcoal hover:bg-sand hover:text-saffron'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-saffron' : 'text-charcoal-muted'}`} />
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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

        {/* Footer */}
        <div className="pt-3 border-t border-sand-border space-y-2">
          {currentUser && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-pale-orange border border-sand-border">
              <div className="w-7 h-7 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left text-xs truncate">
                <span className="font-bold text-river block truncate text-[11px]">{currentUser.name}</span>
                <span className="text-[10px] text-charcoal-muted block truncate">{currentUser.email}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              to="/"
              className="py-1.5 px-2 rounded-lg border border-sand-border text-charcoal text-[11px] hover:bg-sand hover:text-saffron flex items-center justify-center gap-1 transition text-center"
            >
              <span>{language === 'HI' ? 'सार्वजनिक साइट' : 'Public Site'}</span>
            </Link>
            <button
              onClick={logout}
              type="button"
              className="py-1.5 px-2 rounded-lg border border-red-200 text-red-600 text-[11px] hover:bg-red-50 flex items-center justify-center gap-1 transition text-center"
            >
              <LogOut className="w-3 h-3" />
              <span>{language === 'HI' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 w-full min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
