import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { TravelEvent } from '../../types';
import { useApp } from '../../context/AppContext';

export const EventCard: React.FC<{ event: TravelEvent }> = ({ event }) => {
  const { language, t } = useApp();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const title = language === 'HI' ? event.titleHi : event.titleEn;
  const description = language === 'HI' ? event.descriptionHi : event.descriptionEn;
  const venue = language === 'HI' ? event.venueHi : event.venueEn;

  // Format date display (e.g. "24 Nov 2026" or "20 Nov - 23 Nov 2026")
  const formatDateDisplay = (start: string, end?: string) => {
    try {
      const s = new Date(start);
      const sStr = s.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      if (end && end !== start) {
        const e = new Date(end);
        const eStr = e.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return `${sStr} – ${eStr}`;
      }
      return sStr;
    } catch {
      return start;
    }
  };

  const planVisitUrl = `/book?destination=${encodeURIComponent(event.city)}&date=${event.startDate}${
    event.endDate ? `&endDate=${event.endDate}` : ''
  }&eventName=${encodeURIComponent(event.titleEn)}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.06)] flex flex-col justify-between group motion-gpu">
      <div>
        {/* Event Image Banner with Skeleton Placeholder */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F3]">
          <div
            className={`absolute inset-0 bg-[#EAEAE8] transition-opacity duration-500 pointer-events-none ${
              imgLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={event.coverImage}
            alt={event.imageAltText || title}
            width="600"
            height="375"
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

          {/* City Badge & Category Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#1D1D1F] shadow-2xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FF5F1F]" />
              <span>{event.city}</span>
            </span>
            {event.isNearCity && (
              <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[10px] font-bold text-[#FF5F1F] border border-[#FF5F1F]/30 shadow-2xs">
                {event.nearCityDetails || 'Near City'}
              </span>
            )}
          </div>

          {/* Date Status Badge & Lifecycle Indicator */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
            {event.isCancelled ? (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-600/95 text-white shadow-2xs backdrop-blur-md">
                {t.events.cancelled}
              </span>
            ) : event.lifecycleStatus === 'ONGOING' ? (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>{t.events.ongoing}</span>
              </span>
            ) : event.lifecycleStatus === 'COMPLETED' ? (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-700/90 text-zinc-200 backdrop-blur-md shadow-2xs">
                {language === 'HI' ? 'सम्पन्न' : 'Past Event'}
              </span>
            ) : null}

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-2xs flex items-center gap-1 ${
                event.dateStatus === 'Confirmed'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
              <span>{event.dateStatus === 'Confirmed' ? t.events.confirmed : t.events.tentative}</span>
            </span>
          </div>

          {/* Highlighted Date Pill (Bottom of Image) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>{formatDateDisplay(event.startDate, event.endDate)}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[11px] font-medium text-white">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-3">
          <h3 className="text-xl font-sans font-bold text-[#1D1D1F] group-hover:text-[#FF5F1F] transition-colors leading-snug">
            {title}
          </h3>

          <div className="flex items-start gap-2 text-xs text-[#6E6E73]">
            <MapPin className="w-3.5 h-3.5 text-[#FF5F1F] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{venue}</span>
          </div>

          <p className="text-xs text-[#6E6E73] font-light leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:p-5 bg-[#FAFAF8] border-t border-[#E8E8E6] flex items-center justify-between gap-2">
        <Link
          to={`/events/${event.slug}`}
          className="text-xs font-semibold text-[#1D1D1F] hover:text-[#FF5F1F] transition-colors px-2 py-1 flex items-center gap-1"
        >
          <span>{t.events.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={planVisitUrl}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white transition-all duration-300 shadow-xs hover:shadow-[0_4px_14px_rgba(255,95,31,0.35)] active:scale-95"
        >
          {t.events.planMyVisit}
        </Link>
      </div>
    </div>
  );
};
