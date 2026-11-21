import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DestinationCard } from '../../components/destinations/DestinationCard';
import { Search } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const { destinations, t, language } = useApp();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || searchParams.get('destination');
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const categoryMap: { [key: string]: { en: string; hi: string } } = {
    'All': { en: 'All', hi: 'सभी' },
    'Famous Ghats': { en: 'Famous Ghats', hi: 'प्रसिद्ध घाट' },
    'Temples': { en: 'Temples', hi: 'मंदिर' },
    'Heritage': { en: 'Heritage', hi: 'विरासत' },
    'Banarasi Food': { en: 'Banarasi Food', hi: 'बनारसी खानपान' },
    'Banarasi Sarees': { en: 'Banarasi Sarees', hi: 'बनारसी साड़ियाँ' },
    'Nearby Attractions': { en: 'Nearby Attractions', hi: 'निकटवर्ती आकर्षण' },
  };

  const categories = Object.keys(categoryMap);

  const filtered = destinations.filter((dest) => {
    // City filter if provided in query
    if (cityParam) {
      const isJaipur = cityParam.toLowerCase().includes('jaipur');
      const isVaranasi = cityParam.toLowerCase().includes('varanasi') || cityParam.toLowerCase().includes('kashi');
      const destLocation = dest.location.toLowerCase();

      if (isJaipur) {
        if (!destLocation.includes('jaipur')) return false;
      } else if (isVaranasi) {
        if (destLocation.includes('jaipur')) return false;
      }
    }

    const query = searchQuery.toLowerCase();
    const nameMatch = dest.name.toLowerCase().includes(query) || (dest.hindiName && dest.hindiName.toLowerCase().includes(query));
    const descMatch = dest.description.toLowerCase().includes(query);
    const locMatch = dest.location.toLowerCase().includes(query);

    const matchesSearch = nameMatch || descMatch || locMatch;
    const matchesCategory =
      selectedCategory === 'All' || dest.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="layout-container py-12 sm:py-16 space-y-12">
      {/* Page Header — Editorial Travel Magazine Style */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
          {t.destinations.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          {t.destinations.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
          {t.destinations.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E8E8E6] flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.destinations.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'bg-[#F5F5F3] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E8E8E6]'
              }`}
            >
              {language === 'HI' ? categoryMap[cat].hi : categoryMap[cat].en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-sand-border space-y-3">
          <p className="font-serif text-lg font-bold text-river">{t.destinations.noDestinationsFound}</p>
          <p className="text-xs text-charcoal-muted">
            {language === 'HI'
              ? 'अपनी खोज या श्रेणी फ़िल्टर बदलकर दोबारा प्रयास करें।'
              : 'Try adjusting your search query or switching category filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-deep-orange transition shadow-sm"
          >
            {t.destinations.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
