import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, MapPin, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EventCard } from './EventCard';

export const HomeEventsSection: React.FC<{ initialCity?: 'Varanasi' | 'Jaipur' | 'All' }> = ({
  initialCity = 'All',
}) => {
  const { events, language, t } = useApp();
  const [selectedCity, setSelectedCity] = useState<'All' | 'Varanasi' | 'Jaipur'>(initialCity);

  // Exclude completed/archived or cancelled events from Upcoming listing on the Homepage
  const activeUpcomingEvents = events.filter((e) => {
    if (e.status !== 'Published') return false;
    if (e.isCancelled) return false;
    if (e.lifecycleStatus === 'COMPLETED') return false;
    return true;
  });

  // Filter by selected city
  const cityFiltered = activeUpcomingEvents.filter((e) => {
    if (selectedCity === 'All') return true;
    return e.city === selectedCity;
  });

  // Sort: Ongoing events first, then upcoming chronologically (closest start date first)
  const sortedEvents = [...cityFiltered].sort((a, b) => {
    if (a.lifecycleStatus === 'ONGOING' && b.lifecycleStatus !== 'ONGOING') return -1;
    if (b.lifecycleStatus === 'ONGOING' && a.lifecycleStatus !== 'ONGOING') return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] border-b border-[#E8E8E6] relative overflow-hidden">
      <div className="layout-container space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FF5F1F]/20 text-xs font-semibold text-[#FF5F1F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.events.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
              {t.events.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
              {t.events.subtitle} {t.events.description}
            </p>
          </div>

          {/* Interactive City Selector Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-[#E8E8E6] shadow-2xs self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedCity('All')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCity === 'All'
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F3]'
              }`}
            >
              {t.events.allCities}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('Varanasi')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCity === 'Varanasi'
                  ? 'bg-[#FF5F1F] text-white shadow-[0_2px_8px_rgba(255,95,31,0.3)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F3]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.events.varanasi}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('Jaipur')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCity === 'Jaipur'
                  ? 'bg-[#FF5F1F] text-white shadow-[0_2px_8px_rgba(255,95,31,0.3)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F3]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.events.jaipur}</span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E8E6] space-y-3">
            <Calendar className="w-10 h-10 text-[#86868B] mx-auto" />
            <p className="font-serif text-lg font-bold text-[#1D1D1F]">{t.events.noEventsFound}</p>
            <button
              type="button"
              onClick={() => setSelectedCity('All')}
              className="px-5 py-2.5 rounded-full bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition shadow-xs"
            >
              {t.events.resetFilters}
            </button>
          </div>
        )}

        {/* View All Events CTA */}
        <div className="text-center pt-4">
          <Link
            to={selectedCity === 'All' ? '/events' : `/events?city=${selectedCity}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F5F5F3] border border-[#E8E8E6] text-sm font-semibold text-[#1D1D1F] hover:text-[#FF5F1F] transition-all shadow-xs hover:shadow-sm"
          >
            <span>{t.events.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
