import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, Minus, Plus, AlertCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TravelBookingSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();

  // Get current date string in YYYY-MM-DD
  const getTodayStr = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getFutureDateStr = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();

  // Supported cities configured for TravelOnBuddy
  const availableCities = [
    { id: 'varanasi', name: 'Varanasi (Banaras)', state: 'Uttar Pradesh', default: true },
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  ];

  const [selectedCity, setSelectedCity] = useState('Varanasi (Banaras)');
  const [fromDate, setFromDate] = useState(() => getFutureDateStr(2));
  const [toDate, setToDate] = useState(() => getFutureDateStr(4));
  const [travelers, setTravelers] = useState<number>(2);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle from date change & ensure toDate >= fromDate
  const handleFromDateChange = (newFrom: string) => {
    setFromDate(newFrom);
    setValidationError(null);
    if (toDate && newFrom > toDate) {
      setToDate(newFrom);
    }
  };

  // Handle to date change
  const handleToDateChange = (newTo: string) => {
    if (fromDate && newTo < fromDate) {
      setValidationError(
        language === 'HI'
          ? 'वापसी तिथि प्रस्थान तिथि से पहले नहीं हो सकती।'
          : 'To Date must be on or after From Date.'
      );
      return;
    }
    setValidationError(null);
    setToDate(newTo);
  };

  // Traveler increment/decrement (min 1, max 20)
  const decrementTravelers = (e: React.MouseEvent) => {
    e.preventDefault();
    if (travelers > 1) {
      setTravelers(travelers - 1);
    }
  };

  const incrementTravelers = (e: React.MouseEvent) => {
    e.preventDefault();
    if (travelers < 20) {
      setTravelers(travelers + 1);
    }
  };

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity) {
      setValidationError(
        language === 'HI' ? 'कृपया गंतव्य शहर चुनें।' : 'Please select a destination city.'
      );
      return;
    }

    if (!fromDate) {
      setValidationError(
        language === 'HI' ? 'कृपया आरंभ तिथि चुनें।' : 'Please select a travel start date.'
      );
      return;
    }

    if (!toDate) {
      setValidationError(
        language === 'HI' ? 'कृपया समाप्ति तिथि चुनें।' : 'Please select a travel end date.'
      );
      return;
    }

    if (fromDate > toDate) {
      setValidationError(
        language === 'HI'
          ? 'वापसी तिथि प्रस्थान तिथि से बाद की होनी चाहिए।'
          : 'End date must be equal to or after start date.'
      );
      return;
    }

    if (travelers < 1) {
      setValidationError(
        language === 'HI' ? 'कम से कम 1 यात्री होना चाहिए।' : 'At least 1 traveler required.'
      );
      return;
    }

    setValidationError(null);

    // Transfer search details to existing Buddies discovery / booking journey
    const params = new URLSearchParams({
      city: selectedCity,
      destination: selectedCity,
      date: fromDate,
      startDate: fromDate,
      endDate: toDate,
      travelers: travelers.toString(),
    });

    navigate(`/buddies?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-10 animate-fade-up delay-250">
      {validationError && (
        <div className="mb-3 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center justify-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Pill Bar Container: High-fidelity layout with generous City field width */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-3xl lg:rounded-full p-2.5 sm:p-2 border border-[#E8E8E6] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2"
      >
        {/* FIELD 1: CITY / DESTINATION (Generous width to show "Varanasi (Banaras)" fully) */}
        <div className="lg:w-[28%] flex items-center gap-3 px-4 py-2.5 rounded-2xl lg:rounded-full hover:bg-[#FAFAF8] transition-colors border border-transparent hover:border-[#E8E8E6]/60 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#FF5F1F] shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-left flex-1 min-w-0 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block leading-tight">
              {language === 'HI' ? 'शहर / गंतव्य' : 'City / Destination'}
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setValidationError(null);
                }}
                className="w-full bg-transparent text-sm font-semibold text-[#1D1D1F] focus:outline-none cursor-pointer appearance-none pr-5 leading-snug whitespace-nowrap"
              >
                {availableCities.map((city) => (
                  <option key={city.id} value={city.name} className="text-[#1D1D1F] py-1">
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#86868B] pointer-events-none absolute right-0 bottom-1" />
            </div>
          </div>
        </div>

        {/* Subtle Divider (Desktop) */}
        <div className="hidden lg:block w-[1px] h-9 bg-[#E8E8E6]" />

        {/* FIELD 2: FROM DATE */}
        <div className="lg:w-[19%] flex items-center gap-3 px-4 py-2.5 rounded-2xl lg:rounded-full hover:bg-[#FAFAF8] transition-colors border border-transparent hover:border-[#E8E8E6]/60 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#FF5F1F] shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block leading-tight">
              {language === 'HI' ? 'प्रस्थान तिथि' : 'From Date'}
            </label>
            <input
              type="date"
              min={todayStr}
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1D1D1F] focus:outline-none cursor-pointer mt-0.5 leading-snug"
            />
          </div>
        </div>

        {/* Subtle Divider (Desktop) */}
        <div className="hidden lg:block w-[1px] h-9 bg-[#E8E8E6]" />

        {/* FIELD 3: TO DATE */}
        <div className="lg:w-[19%] flex items-center gap-3 px-4 py-2.5 rounded-2xl lg:rounded-full hover:bg-[#FAFAF8] transition-colors border border-transparent hover:border-[#E8E8E6]/60 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#FF5F1F] shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block leading-tight">
              {language === 'HI' ? 'वापसी तिथि' : 'To Date'}
            </label>
            <input
              type="date"
              min={fromDate || todayStr}
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1D1D1F] focus:outline-none cursor-pointer mt-0.5 leading-snug"
            />
          </div>
        </div>

        {/* Subtle Divider (Desktop) */}
        <div className="hidden lg:block w-[1px] h-9 bg-[#E8E8E6]" />

        {/* FIELD 4: TRAVELERS NUMBER SELECTOR */}
        <div className="lg:min-w-[235px] lg:shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 rounded-2xl lg:rounded-full hover:bg-[#FAFAF8] transition-colors border border-transparent hover:border-[#E8E8E6]/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#FF5F1F] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] block leading-tight whitespace-nowrap">
                {language === 'HI' ? 'यात्री संख्या' : 'Travelers'}
              </label>
              <span className="text-xs sm:text-sm font-semibold text-[#1D1D1F] block mt-0.5 leading-snug whitespace-nowrap">
                {travelers} {travelers === 1 ? (language === 'HI' ? 'व्यक्ति' : 'Person') : (language === 'HI' ? 'व्यक्ति' : 'Persons')}
              </span>
            </div>
          </div>

          {/* Stepper Buttons (- and +) with improved touch targets & visibility */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-[#F5F5F3] p-1 rounded-full border border-[#E8E8E6]">
            <button
              type="button"
              onClick={decrementTravelers}
              disabled={travelers <= 1}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                travelers <= 1
                  ? 'text-[#86868B]/30 cursor-not-allowed'
                  : 'text-[#1D1D1F] hover:bg-white hover:shadow-2xs active:scale-90'
              }`}
              title="Decrease travelers"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <span className="text-xs font-bold text-[#1D1D1F] w-5 text-center select-none">
              {travelers}
            </span>

            <button
              type="button"
              onClick={incrementTravelers}
              disabled={travelers >= 20}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                travelers >= 20
                  ? 'text-[#86868B]/30 cursor-not-allowed'
                  : 'text-[#1D1D1F] hover:bg-white hover:shadow-2xs active:scale-90'
              }`}
              title="Increase travelers"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* SEARCH ACTION BUTTON */}
        <div className="shrink-0 p-1 lg:p-0">
          <button
            type="submit"
            className="w-full lg:w-auto px-7 py-3.5 rounded-2xl lg:rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_14px_rgba(255,95,31,0.35)] hover:shadow-[0_6px_20px_rgba(255,95,31,0.45)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer btn-press whitespace-nowrap"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'HI' ? 'अपनी यात्रा खोजें' : 'Find Your Trip'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
