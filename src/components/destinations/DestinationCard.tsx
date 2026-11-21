import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, Clock } from 'lucide-react';
import { Destination } from '../../types';
import { useApp } from '../../context/AppContext';

export const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  const { t } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8E8E6] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col justify-between motion-gpu">
      {/* Editorial Image Canvas with Skeleton Placeholder */}
      <Link
        to={`/destinations/${destination.id}`}
        className="relative aspect-[16/11] w-full overflow-hidden bg-[#F5F5F3] block"
      >
        {/* Skeleton shimmer layer preventing layout shift */}
        <div
          className={`absolute inset-0 bg-[#EAEAE8] transition-opacity duration-500 pointer-events-none ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <img
          src={destination.coverImage}
          alt={destination.name}
          width="600"
          height="412"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-[1.045] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle cinematic gradient strictly for text and badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

        {/* Minimal Category Pill */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#1D1D1F] text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full shadow-2xs transition-transform duration-300 group-hover:scale-[1.02]">
          {destination.category}
        </div>

        {/* Location & Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-3">
          <div className="min-w-0">
            {destination.hindiName && (
              <span className="text-[11px] text-white/80 font-medium block mb-0.5">
                {destination.hindiName}
              </span>
            )}
            <h3 className="text-xl font-bold tracking-tight text-white leading-tight truncate">
              {destination.name}
            </h3>
          </div>
          <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-[#FF5F1F] group-hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Editorial Description & Metadata */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <p className="text-[13px] text-[#6E6E73] font-light leading-relaxed line-clamp-2">
            {destination.description}
          </p>

          <div className="mt-4 pt-4 border-t border-[#E8E8E6] flex items-center justify-between text-xs text-[#6E6E73]">
            <span className="flex items-center gap-1.5 font-light">
              <Clock className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>{destination.suggestedDuration}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate max-w-[160px] font-light">
              <MapPin className="w-3.5 h-3.5 text-[#FF5F1F] shrink-0" />
              <span className="truncate">{destination.location.split(',')[0]}</span>
            </span>
          </div>
        </div>

        {/* Action bar */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            to={`/destinations/${destination.id}`}
            className="text-xs font-semibold text-[#1D1D1F] hover:text-[#FF5F1F] transition-colors"
          >
            {t.common.viewDetails} &rarr;
          </Link>
          <Link
            to={`/book?destination=${encodeURIComponent(destination.name)}`}
            className="text-xs font-medium text-[#FF5F1F] hover:text-[#EC5800] hover:underline transition-colors"
          >
            {t.common.bookBuddy}
          </Link>
        </div>
      </div>
    </article>
  );
};
