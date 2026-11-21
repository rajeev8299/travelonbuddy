import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Clock, Check } from 'lucide-react';

export const ExperiencesPage: React.FC = () => {
  const { experiences, t, language } = useApp();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || searchParams.get('destination');
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categoryMap: { [key: string]: { en: string; hi: string } } = {
    'All': { en: 'All', hi: 'सभी' },
    'Sunrise Experience': { en: 'Sunrise Experience', hi: 'सूर्योदय अनुभव' },
    'Heritage Walk': { en: 'Heritage Walk', hi: 'विरासत वॉक' },
    'Spiritual Experience': { en: 'Spiritual Experience', hi: 'आध्यात्मिक अनुभव' },
    'Local Food Exploration': { en: 'Local Food Exploration', hi: 'स्थानीय खानपान' },
    'Local Market Visit': { en: 'Local Market Visit', hi: 'स्थानीय बाज़ार भ्रमण' },
    'Customized City Tour': { en: 'Customized City Tour', hi: 'अनुकूलित नगर यात्रा' },
  };

  const categories = Object.keys(categoryMap);

  const filtered = experiences.filter((exp) => {
    // City filter if specified
    if (cityParam) {
      const isJaipur = cityParam.toLowerCase().includes('jaipur');
      const isVaranasi = cityParam.toLowerCase().includes('varanasi') || cityParam.toLowerCase().includes('kashi');
      const expTitle = exp.title.toLowerCase();
      const expDesc = exp.description.toLowerCase();

      if (isJaipur) {
        if (!expTitle.includes('jaipur') && !expDesc.includes('jaipur') && !expTitle.includes('bespoke')) {
          return false;
        }
      } else if (isVaranasi) {
        if (expTitle.includes('jaipur')) {
          return false;
        }
      }
    }

    return activeCategory === 'All' || exp.category === activeCategory;
  });

  return (
    <div className="layout-container py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron">
          {t.experiences.eyebrow}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-river">
          {t.experiences.title}
        </h1>
        <p className="text-sm text-charcoal-light leading-relaxed">
          {t.experiences.subtitle}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${activeCategory === cat
                ? 'bg-river text-ivory shadow-xs'
                : 'bg-white text-charcoal border border-sand-border hover:bg-sand'
              }`}
          >
            {language === 'HI' ? categoryMap[cat].hi : categoryMap[cat].en}
          </button>
        ))}
      </div>

      {/* Experience List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {filtered.map((exp) => {
          const displayTitle = language === 'HI' && exp.hindiTitle ? exp.hindiTitle : exp.title;
          return (
            <div
              key={exp.id}
              className="bg-white rounded-2xl overflow-hidden border border-sand-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                <img
                  src={exp.coverImage}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {exp.badge && (
                  <span className="absolute top-3 left-3 bg-saffron text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {exp.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-river/90 text-ivory text-xs px-2.5 py-1 rounded-lg backdrop-blur-md">
                  {exp.duration}
                </span>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-saffron uppercase tracking-wider">
                      {exp.category}
                    </span>
                    {exp.hindiTitle && language === 'EN' && (
                      <span className="text-charcoal-muted font-serif">{exp.hindiTitle}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-river group-hover:text-saffron transition">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="pt-2 space-y-1.5 border-t border-sand-border">
                    <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider block">
                      {language === 'HI' ? 'प्रमुख आकर्षण:' : 'Highlights included:'}
                    </span>
                    {exp.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-charcoal-muted">
                        <Check className="w-3.5 h-3.5 text-saffron shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-border">
                  <Link
                    to={`/book?experience=${encodeURIComponent(exp.title)}`}
                    className="w-full py-2.5 rounded-xl bg-river text-ivory text-xs font-semibold hover:bg-river-light transition flex items-center justify-center gap-2 shadow"
                  >
                    <span>{t.experiences.bookCompanionForExp}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
