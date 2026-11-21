import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BuddyCard } from '../../components/buddies/BuddyCard';
import { Search, ShieldCheck, Languages, Award } from 'lucide-react';

export const BuddiesPage: React.FC = () => {
  const { buddies, t, language } = useApp();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || searchParams.get('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  const filtered = buddies.filter((buddy) => {
    // City filtering if city/destination is specified in URL query
    if (cityParam) {
      const isJaipur = cityParam.toLowerCase().includes('jaipur');
      const isVaranasi = cityParam.toLowerCase().includes('varanasi') || cityParam.toLowerCase().includes('kashi');

      const buddyLocation = (buddy.nativeOf || '').toLowerCase();
      const buddyPlaces = (buddy.placesCovered || []).join(' ').toLowerCase();

      if (isJaipur) {
        const matchesJaipur = buddyLocation.includes('jaipur') || buddyPlaces.includes('jaipur') || buddyPlaces.includes('hawa mahal') || buddyPlaces.includes('amber');
        if (!matchesJaipur) return false;
      } else if (isVaranasi) {
        const matchesJaipur = buddyLocation.includes('jaipur') || buddyPlaces.includes('jaipur');
        if (matchesJaipur) return false;
      }
    }

    const matchesSearch =
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      buddy.nativeOf.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang =
      selectedLanguage === 'All' || buddy.languages.includes(selectedLanguage);

    const matchesGender =
      selectedGender === 'All' || buddy.gender === selectedGender;

    return matchesSearch && matchesLang && matchesGender;
  });

  return (
    <div className="layout-container py-12 sm:py-16 space-y-12">
      {/* Page Header — Apple Inspired Typography */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
          {t.buddies.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          {t.buddies.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
          {t.buddies.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8E8E6] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.buddies.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
            <Languages className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#FAFAF8] border border-[#E8E8E6] rounded-full px-3 py-1.5 font-medium text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
            >
              <option value="All">{t.buddies.allLanguages}</option>
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Sanskrit">संस्कृत (Sanskrit)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              <option value="Urdu">اردو (Urdu)</option>
            </select>
          </div>

          {/* Gender Preference Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-[#FAFAF8] border border-[#E8E8E6] rounded-full px-3 py-1.5 font-medium text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
            >
              <option value="All">{t.buddies.allGenders}</option>
              <option value="Female">{t.buddies.femaleOnly}</option>
              <option value="Male">{t.buddies.maleOnly}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buddies Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filtered.map((buddy) => (
            <BuddyCard key={buddy.id} buddy={buddy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E6] space-y-4">
          <p className="text-xl font-bold text-[#1D1D1F]">{t.buddies.noBuddiesFound}</p>
          <p className="text-xs text-[#6E6E73] font-light">
            {language === 'HI'
              ? 'सभी उपलब्ध वाराणसी साथियों को देखने के लिए फ़िल्टर रीसेट करें।'
              : 'Try resetting your filters to view all available Varanasi companions.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('All');
              setSelectedGender('All');
            }}
            className="px-6 py-2.5 rounded-full bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition shadow-xs active:scale-95"
          >
            {t.destinations.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
