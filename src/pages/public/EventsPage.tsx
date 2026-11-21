import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Calendar, Search, MapPin, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../../components/events/EventCard';
import { EventCategory } from '../../types';

export const EventsPage: React.FC = () => {
  const { events, language, t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const cityParam = searchParams.get('city') || 'All';
  const categoryParam = searchParams.get('category') || 'All';

  const [viewTab, setViewTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCity, setSelectedCity] = useState<string>(cityParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [timeFilter, setTimeFilter] = useState<'All' | 'ThisMonth' | 'NextMonth'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'earliest' | 'latest'>('earliest');

  const categories: ('All' | EventCategory)[] = [
    'All',
    'Religious Festivals',
    'Cultural Events',
    'Seasonal Celebrations',
    'Art and Literature',
    'Heritage Events',
    'Local Fairs',
  ];

  // Filter logic
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const filtered = events.filter((e) => {
    // In Upcoming tab: exclude completed/archived or cancelled
    if (viewTab === 'upcoming') {
      if (e.status === 'Archived' || e.lifecycleStatus === 'COMPLETED' || e.isCancelled) return false;
      if (e.status !== 'Published') return false;
    } else {
      // In Past tab: show completed or archived
      if (e.lifecycleStatus !== 'COMPLETED' && e.status !== 'Archived') return false;
    }

    // City filter
    if (selectedCity !== 'All' && e.city !== selectedCity) return false;

    // Category filter
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.titleEn.toLowerCase().includes(q) || e.titleHi.toLowerCase().includes(q);
      const matchVenue = e.venueEn.toLowerCase().includes(q) || e.venueHi.toLowerCase().includes(q);
      const matchDesc = e.descriptionEn.toLowerCase().includes(q) || e.descriptionHi.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchDesc) return false;
    }

    // Time filter
    if (timeFilter !== 'All') {
      const s = new Date(e.startDate);
      if (timeFilter === 'ThisMonth') {
        if (s.getMonth() !== currentMonth || s.getFullYear() !== currentYear) return false;
      } else if (timeFilter === 'NextMonth') {
        const nextMonth = (currentMonth + 1) % 12;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        if (s.getMonth() !== nextMonth || s.getFullYear() !== nextYear) return false;
      }
    }

    return true;
  });

  // Sort: If upcoming, show Ongoing first then earliest. If past, show latest completed first.
  const sorted = [...filtered].sort((a, b) => {
    if (viewTab === 'upcoming') {
      if (a.lifecycleStatus === 'ONGOING' && b.lifecycleStatus !== 'ONGOING') return -1;
      if (b.lifecycleStatus === 'ONGOING' && a.lifecycleStatus !== 'ONGOING') return 1;
    }
    const timeA = new Date(a.startDate).getTime();
    const timeB = new Date(b.startDate).getTime();
    if (viewTab === 'past') {
      return timeB - timeA;
    }
    return sortBy === 'earliest' ? timeA - timeB : timeB - timeA;
  });

  return (
    <div className="layout-container py-12 sm:py-16 space-y-12">
      {/* Editorial Header & Active / Archive Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FF5F1F]/20 text-xs font-semibold text-[#FF5F1F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.events.eyebrow}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F]">
            {viewTab === 'upcoming' ? t.events.title : (language === 'HI' ? 'पुराने उत्सवों का अभिलेखागार' : 'Past Events Archive')}
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
            {t.events.subtitle} {t.events.description}
          </p>
        </div>

        {/* Upcoming vs Past Archive Pill Switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F5F5F3] border border-[#E8E8E6] shadow-2xs self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewTab('upcoming')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewTab === 'upcoming'
                ? 'bg-[#1D1D1F] text-white shadow-2xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {language === 'HI' ? 'आगामी एवं जारी उत्सव' : 'Upcoming & Ongoing'}
          </button>
          <button
            type="button"
            onClick={() => setViewTab('past')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewTab === 'past'
                ? 'bg-[#1D1D1F] text-white shadow-2xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {t.events.pastArchive}
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8E8E6] shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F5F5F3] border border-[#E8E8E6] w-full sm:w-auto">
          {['All', 'Varanasi', 'Jaipur'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {city === 'All' ? t.events.allCities : city === 'Varanasi' ? t.events.varanasi : t.events.jaipur}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'HI' ? 'उत्सव, घाट या स्थान खोजें...' : 'Search festival, venue, fair...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F] transition-colors"
          />
        </div>

        {/* Time and Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-[#FAFAF8] border border-[#E8E8E6] rounded-full px-3.5 py-2 font-medium text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
          >
            <option value="All">{language === 'HI' ? 'सभी आगामी' : 'All Upcoming'}</option>
            <option value="ThisMonth">{language === 'HI' ? 'इस माह' : 'This Month'}</option>
            <option value="NextMonth">{language === 'HI' ? 'अगले माह' : 'Next Month'}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAFAF8] border border-[#E8E8E6] rounded-full px-3.5 py-2 font-medium text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
          >
            <option value="earliest">{language === 'HI' ? 'निकटतम तिथि पहले' : 'Date: Earliest First'}</option>
            <option value="latest">{language === 'HI' ? 'दूरस्थ तिथि पहले' : 'Date: Latest First'}</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1D1D1F] text-white shadow-2xs'
                : 'bg-white text-[#6E6E73] border border-[#E8E8E6] hover:bg-[#F5F5F3]'
            }`}
          >
            {cat === 'All' ? t.events.allCategories : cat}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E6] space-y-4">
          <Calendar className="w-12 h-12 text-[#86868B] mx-auto" />
          <p className="text-xl font-bold text-[#1D1D1F]">{t.events.noEventsFound}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCity('All');
              setSelectedCategory('All');
              setTimeFilter('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition shadow-xs"
          >
            {t.events.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
