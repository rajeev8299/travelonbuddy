import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin } from 'lucide-react';
import { TravelBuddy } from '../../types';
import { useApp } from '../../context/AppContext';

export const BuddyCard: React.FC<{ buddy: TravelBuddy }> = ({ buddy }) => {
  const { t, language } = useApp();
  const searchParams = new URLSearchParams(window.location.search);
  const city = searchParams.get('city') || searchParams.get('destination');
  const date = searchParams.get('date') || searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const travelers = searchParams.get('travelers');

  const queryParams = new URLSearchParams();
  queryParams.set('buddyId', buddy.id);
  if (city) queryParams.set('destination', city);
  if (date) queryParams.set('date', date);
  if (endDate) queryParams.set('endDate', endDate);
  if (travelers) queryParams.set('travelers', travelers);

  const bookUrl = `/book?${queryParams.toString()}`;
  const detailUrl = `/buddies/${buddy.id}${window.location.search}`;
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.06)] flex flex-col justify-between group motion-gpu">
      {/* Top Details */}
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={buddy.avatar}
              alt={buddy.name}
              className="w-16 h-16 rounded-2xl object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF5F1F] border-2 border-white flex items-center justify-center text-white shadow-2xs transition-transform duration-300 group-hover:scale-110"
              title="Verified Active Companion"
            >
              <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-lg font-bold text-[#1D1D1F] truncate group-hover:text-[#FF5F1F] transition-colors duration-200">
                {buddy.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#1D1D1F]">
                <Star className="w-3.5 h-3.5 fill-[#FF5F1F] text-[#FF5F1F]" />
                <span>{buddy.ratingDemo}</span>
              </div>
            </div>
            <p className="text-xs text-[#6E6E73] line-clamp-1 mt-0.5">{buddy.title}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-[#6E6E73]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF5F1F]" />
                <span>{buddy.nativeOf}</span>
              </span>
              <span>•</span>
              <span>{buddy.experienceYears}+ {language === 'HI' ? 'वर्ष अनुभव' : 'yrs exp'}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#6E6E73] font-light leading-relaxed line-clamp-3">
          {buddy.bio}
        </p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {buddy.expertise.slice(0, 3).map((item) => (
            <span
              key={item}
              className="text-[11px] font-medium bg-[#F5F5F3] text-[#1D1D1F] px-2.5 py-0.5 rounded-full border border-[#E8E8E6] transition-colors duration-200 group-hover:border-[#FF5F1F]/30"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-[#FAFAF8] border-t border-[#E8E8E6] flex items-center justify-between gap-2">
        <Link
          to={detailUrl}
          className="text-xs font-medium text-[#1D1D1F] hover:text-[#FF5F1F] transition px-2 py-1"
        >
          {t.common.viewDetails} &rarr;
        </Link>
        <Link
          to={bookUrl}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#FF5F1F] text-white transition-all duration-300 shadow-xs hover:shadow-[0_4px_12px_rgba(255,95,31,0.3)] active:scale-95"
        >
          {t.common.bookBuddy}
        </Link>
      </div>
    </div>
  );
};
