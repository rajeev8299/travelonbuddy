import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Share2,
  ExternalLink,
  Users,
  Compass,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { events, buddies, language, showToast, t } = useApp();
  const navigate = useNavigate();

  const event = events.find((e) => e.slug === slug || e.id === slug);

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const title = language === 'HI' ? event.titleHi : event.titleEn;
  const description = language === 'HI' ? event.descriptionHi : event.descriptionEn;
  const longDescription = language === 'HI' ? event.longDescriptionHi : event.longDescriptionEn;
  const venue = language === 'HI' ? event.venueHi : event.venueEn;
  const culturalSignificance =
    language === 'HI' ? event.culturalSignificanceHi : event.culturalSignificanceEn;
  const visitorExperience =
    language === 'HI' ? event.visitorExperienceHi : event.visitorExperienceEn;
  const entryFee = language === 'HI' ? event.entryFeeHi : event.entryFeeEn;

  // Format date display
  const formatDateDisplay = (start: string, end?: string) => {
    try {
      const s = new Date(start);
      const sStr = s.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (end && end !== start) {
        const e = new Date(end);
        const eStr = e.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        return `${sStr} – ${eStr}`;
      }
      return sStr;
    } catch {
      return start;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'HI' ? 'इवेंट लिंक कॉपी किया गया!' : 'Event link copied to clipboard!');
    }
  };

  // Find relevant local buddies for this city
  const relevantBuddies = buddies.filter((b) => {
    const loc = (b.nativeOf || '').toLowerCase();
    const isJaipur = event.city === 'Jaipur';
    return isJaipur ? loc.includes('jaipur') : !loc.includes('jaipur');
  });

  const planVisitUrl = `/book?destination=${encodeURIComponent(event.city)}&date=${event.startDate}${
    event.endDate ? `&endDate=${event.endDate}` : ''
  }&eventName=${encodeURIComponent(event.titleEn)}`;

  return (
    <div className="layout-container py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
        <Link to="/" className="hover:text-[#1D1D1F]">
          {language === 'HI' ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <Link to="/events" className="hover:text-[#1D1D1F]">
          {language === 'HI' ? 'त्योहार एवं उत्सव' : 'Festivals & Events'}
        </Link>
        <span>/</span>
        <span className="text-[#1D1D1F] font-semibold">{title}</span>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E8E8E6]">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FFF7ED] text-[#FF5F1F] text-xs font-bold uppercase tracking-wider border border-[#FF5F1F]/20">
              {event.city}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F5F5F3] text-[#1D1D1F] text-xs font-medium">
              {event.category}
            </span>
            {event.isCancelled ? (
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                {t.events.cancelled}
              </span>
            ) : event.lifecycleStatus === 'ONGOING' ? (
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>{t.events.ongoing}</span>
              </span>
            ) : event.lifecycleStatus === 'COMPLETED' ? (
              <span className="px-3 py-1 rounded-full bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider">
                {language === 'HI' ? 'सम्पन्न (Past Event)' : 'Completed / Past Event'}
              </span>
            ) : null}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                event.dateStatus === 'Confirmed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {event.dateStatus === 'Confirmed' ? t.events.confirmed : t.events.tentative}
            </span>
            {event.isNearCity && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                {event.nearCityDetails}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-sans font-extrabold text-[#1D1D1F] tracking-tight">
            {title}
          </h1>

          <p className="text-base text-[#6E6E73] font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
          <button
            onClick={handleShare}
            className="p-3.5 rounded-2xl border border-[#E8E8E6] text-[#1D1D1F] hover:bg-[#F5F5F3] transition cursor-pointer"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            to={planVisitUrl}
            className="px-7 py-3.5 rounded-full bg-[#FF5F1F] text-white font-semibold text-sm hover:bg-[#EC5800] shadow-[0_4px_14px_rgba(255,95,31,0.35)] transition flex items-center gap-2"
          >
            <span>{t.events.planMyVisit}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Visual Image Banner */}
      <div className="w-full h-[360px] sm:h-[480px] rounded-3xl overflow-hidden bg-[#F5F5F3] border border-[#E8E8E6] shadow-md relative group">
        <img
          src={event.coverImage}
          alt={event.imageAltText || title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Banner Details Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
              <Calendar className="w-4 h-4 text-[#FF5F1F]" />
              <span className="text-sm font-bold">{formatDateDisplay(event.startDate, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <MapPin className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>{venue}</span>
            </div>
          </div>
          <div className="text-[11px] text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span>{t.events.lastVerified}: {event.lastVerifiedAt}</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details & Culture */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E8E8E6] space-y-4 shadow-xs">
            <h2 className="text-2xl font-bold text-[#1D1D1F]">
              {language === 'HI' ? 'उत्सव परिचय एवं महत्व' : 'Event Overview & History'}
            </h2>
            <p className="text-sm text-[#48484A] font-light leading-relaxed whitespace-pre-line">
              {longDescription}
            </p>
          </div>

          {/* Cultural Significance */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E8E8E6] space-y-4 shadow-xs">
            <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
              <span>{t.events.culturalSignificance}</span>
            </h3>
            <p className="text-sm text-[#48484A] font-light leading-relaxed">
              {culturalSignificance}
            </p>
          </div>

          {/* What Visitors Can Experience */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E8E8E6] space-y-4 shadow-xs">
            <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF5F1F]" />
              <span>{t.events.whatToExperience}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {visitorExperience.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#48484A]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5F1F] shrink-0 mt-0.5" />
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Local Companions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1D1D1F]">
                {t.events.findCompanionForEvent}
              </h3>
              <Link
                to={`/buddies?city=${encodeURIComponent(event.city)}`}
                className="text-xs font-semibold text-[#FF5F1F] hover:underline"
              >
                {language === 'HI' ? 'सभी देखें' : 'View all'} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relevantBuddies.slice(0, 2).map((buddy) => (
                <div
                  key={buddy.id}
                  className="bg-white p-5 rounded-3xl border border-[#E8E8E6] flex items-center gap-4 shadow-2xs hover:border-[#FF5F1F]/40 transition"
                >
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1D1D1F] truncate">{buddy.name}</h4>
                    <p className="text-xs text-[#FF5F1F] truncate">{buddy.title}</p>
                    <p className="text-[11px] text-[#86868B] mt-0.5">{buddy.nativeOf}</p>
                    <Link
                      to={`/book?buddyId=${buddy.id}&destination=${encodeURIComponent(event.city)}&date=${event.startDate}`}
                      className="mt-2 text-[11px] font-semibold text-[#1D1D1F] hover:text-[#FF5F1F] inline-flex items-center gap-1"
                    >
                      <span>{language === 'HI' ? 'बडी बुक करें' : 'Book for Event'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Planning & Event Facts */}
        <div className="space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-[#E8E8E6] shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E8E8E6] pb-3">
              {language === 'HI' ? 'कार्यक्रम विवरण' : 'Event Details & Logistics'}
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                  {language === 'HI' ? 'स्थान' : 'Venue'}
                </span>
                <span className="text-sm font-semibold text-[#1D1D1F] block mt-0.5">{venue}</span>
              </div>

              <div>
                <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                  {language === 'HI' ? 'तिथियां' : 'Scheduled Dates'}
                </span>
                <span className="text-sm font-semibold text-[#1D1D1F] block mt-0.5">
                  {formatDateDisplay(event.startDate, event.endDate)}
                </span>
                <span className="text-[11px] text-[#86868B] block mt-0.5">
                  {language === 'HI' ? 'स्थिति' : 'Status'}: <strong>{event.dateStatus}</strong>
                </span>
              </div>

              {event.scheduleDetails && (
                <div>
                  <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                    {language === 'HI' ? 'दैनिक समय सारणी' : 'Schedule Details'}
                  </span>
                  <span className="text-xs text-[#48484A] block mt-0.5 leading-relaxed">
                    {event.scheduleDetails}
                  </span>
                </div>
              )}

              {entryFee && (
                <div>
                  <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                    {language === 'HI' ? 'प्रवेश शुल्क' : 'Entry Fees'}
                  </span>
                  <span className="text-xs text-[#48484A] block mt-0.5 leading-relaxed">
                    {entryFee}
                  </span>
                </div>
              )}

              {event.dateChangeHistory && event.dateChangeHistory.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 uppercase tracking-wider block text-[10px]">
                    {t.events.dateShifted}
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    {language === 'HI' ? 'पिछली तारीख' : 'Previous schedule'}: {event.dateChangeHistory[event.dateChangeHistory.length - 1].oldStartDate}. {event.dateChangeHistory[event.dateChangeHistory.length - 1].reason}
                  </p>
                </div>
              )}

              <div>
                <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                  {language === 'HI' ? 'आयोजक' : 'Organizer'}
                </span>
                <span className="text-xs font-semibold text-[#1D1D1F] block mt-0.5">{event.organizer}</span>
              </div>

              <div>
                <span className="font-bold text-[#86868B] uppercase tracking-wider block text-[10px]">
                  {language === 'HI' ? 'आधिकारिक स्रोत' : 'Official Verification Source'}
                </span>
                <a
                  href={event.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#FF5F1F] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span className="truncate">{event.officialSourceUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Plan Button */}
            <div className="pt-4 border-t border-[#E8E8E6] space-y-2">
              <Link
                to={planVisitUrl}
                className="w-full py-3.5 rounded-full bg-[#FF5F1F] text-white text-xs font-bold hover:bg-[#EC5800] transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t.events.planMyVisit}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={event.city === 'Jaipur' ? '/buddies?city=Jaipur' : '/destinations'}
                className="w-full py-2.5 rounded-full bg-[#F5F5F3] text-[#1D1D1F] text-xs font-medium hover:bg-[#E8E8E6] transition flex items-center justify-center"
              >
                <span>{language === 'HI' ? `${event.city} को जानें` : `Explore ${event.city}`}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
