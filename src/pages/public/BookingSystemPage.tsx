import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookingCategory } from '../../types';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
  Sparkles,
  Users,
  Compass,
  Star,
} from 'lucide-react';

export const BookingSystemPage: React.FC = () => {
  const { addRequest, buddies, destinations, currentUser, t, language } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL query pre-fills
  const buddyIdFromUrl = searchParams.get('buddyId');
  const buddyNameFromUrl = searchParams.get('buddy');
  const preselectedBuddy = buddies.find(
    (b) => b.id === buddyIdFromUrl || (buddyNameFromUrl && b.name.toLowerCase() === buddyNameFromUrl.toLowerCase())
  );

  const initialDestination = searchParams.get('destination') || searchParams.get('city') || 'Varanasi (Kashi)';
  const initialCategory = (searchParams.get('category') as BookingCategory) || 'HALF_DAY';
  const initialDate = searchParams.get('date') || searchParams.get('startDate') || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  })();
  const initialEndDate = searchParams.get('endDate') || initialDate;
  const initialTravelers = Number(searchParams.get('travelers')) || 2;

  // Multi-step State (Steps 1 to 7, Step 8 is Confirmation)
  const [step, setStep] = useState<number>(1);
  const totalSteps = 7;

  // Selected Buddy State
  const [selectedBuddyId, setSelectedBuddyId] = useState<string>(preselectedBuddy ? preselectedBuddy.id : (buddies[0]?.id || ''));
  const activeBuddy = buddies.find((b) => b.id === selectedBuddyId) || preselectedBuddy || buddies[0];

  // Trip Specifications
  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startTime, setStartTime] = useState(activeBuddy?.availableTimeSlots?.[0] || '08:00 AM');
  const [isMultiDay, setIsMultiDay] = useState(initialEndDate > initialDate);
  const [category, setCategory] = useState<BookingCategory>(initialCategory);

  // Traveler Information (Auto pre-filled if authenticated)
  const [travelerCount, setTravelerCount] = useState(initialTravelers);
  const [adultsCount, setAdultsCount] = useState(initialTravelers);
  const [childrenCount, setChildrenCount] = useState(0);
  const [travelerCountryCity, setTravelerCountryCity] = useState('New Delhi, India');
  const [travelerName, setTravelerName] = useState(currentUser?.name || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [travelerPhone, setTravelerPhone] = useState('+91 98201 44521');
  const [pickupLocation, setPickupLocation] = useState('Hotel Taj Ganges / Assi Ghat');
  const [preferredLanguage, setPreferredLanguage] = useState(activeBuddy?.languages?.[0] || 'English');

  // Tour Planning & Destinations
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([
    'Shri Kashi Vishwanath Dham',
    'Dashashwamedh Ghat',
    'Assi Ghat',
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Ghats',
    'Spiritual Experiences',
    'Temples',
  ]);
  const [crowdPreference, setCrowdPreference] = useState<
    'Peaceful Locations' | 'Popular/Crowded Attractions' | 'Balanced Experiences'
  >('Balanced Experiences');

  // Preferences & Notes
  const [buddyGenderPreference, setBuddyGenderPreference] = useState<'Any' | 'Female' | 'Male'>('Any');
  const [specialRequests, setSpecialRequests] = useState('');

  // Confirmation Result
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Sync if preselectedBuddy loads
  useEffect(() => {
    if (preselectedBuddy) {
      setSelectedBuddyId(preselectedBuddy.id);
      if (preselectedBuddy.availableTimeSlots?.[0]) {
        setStartTime(preselectedBuddy.availableTimeSlots[0]);
      }
    }
  }, [preselectedBuddy]);

  // Available tour destinations for selection
  const tourLocations = [
    { name: 'Dashashwamedh Ghat', category: 'Famous Ghats', duration: '1.5 hrs', cost: 0, desc: 'Sacred riverfront & Evening Maha Aarti vantage' },
    { name: 'Assi Ghat', category: 'Famous Ghats', duration: '1.5 hrs', cost: 0, desc: 'Subah-e-Banaras, yoga & morning chants' },
    { name: 'Shri Kashi Vishwanath Dham', category: 'Temples', duration: '2 hrs', cost: 0, desc: 'Holy Jyotirlinga sanctum & river corridor' },
    { name: 'Manikarnika Ghat Vantage', category: 'Famous Ghats', duration: '1 hr', cost: 0, desc: 'Ancient cremation ghat philosophy & history' },
    { name: 'Morning Ganga Boat Ride', category: 'Boat Ride', duration: '1.5 hrs', cost: 400, desc: 'Traditional wooden sunrise rowboat on Ganga' },
    { name: 'Sarnath Deer Park & Stupa', category: 'Heritage', duration: '3 hrs', cost: 250, desc: 'Buddhist heritage site & Ashoka pillar' },
    { name: 'Kachori Gali & Local Food Trail', category: 'Local Food', duration: '1.5 hrs', cost: 200, desc: 'Authentic Banarasi kachori, jalebi & blue lassi' },
    { name: 'Madanpura Handloom Silk Weavers', category: 'Banarasi Shopping', duration: '2 hrs', cost: 0, desc: 'Centuries-old jacquard zari pit-looms' },
  ];

  const togglePlace = (placeName: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(placeName) ? prev.filter((p) => p !== placeName) : [...prev, placeName]
    );
  };

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Accurate Configured Price Calculation Engine
  const calculatePricing = () => {
    const currentBuddy = activeBuddy;
    let baseRate = currentBuddy ? currentBuddy.halfDayRate : 2000;
    let durationLabel = 'Half Day (4 hrs)';

    if (category === 'HOURLY') {
      baseRate = (currentBuddy ? currentBuddy.hourlyRate : 500) * 3; // 3 hrs minimum block
      durationLabel = 'Hourly Basis (3 hrs)';
    } else if (category === 'FULL_DAY') {
      baseRate = currentBuddy ? currentBuddy.fullDayRate : 3500;
      durationLabel = 'Full Day (8 hrs)';
    } else if (isMultiDay) {
      baseRate = (currentBuddy ? currentBuddy.multiDayDailyRate : 3000) * 2; // 2 days baseline
      durationLabel = 'Multi-Day (2 Days Baseline)';
    }

    // Additional places / activities cost (e.g. boat ride, food tastings)
    const extraPlacesCost = selectedPlaces.reduce((sum, pName) => {
      const match = tourLocations.find((loc) => loc.name === pName);
      return sum + (match ? match.cost : 0);
    }, 0);

    // Group surcharge if above standard 2 persons (₹300 per extra traveler for coordination)
    const extraTravelers = Math.max(0, travelerCount - 2);
    const travelerSurcharge = extraTravelers * 300;

    const serviceFee = 150; // Platform coordination & safety assurance fee
    const totalAmount = baseRate + extraPlacesCost + travelerSurcharge + serviceFee;

    return {
      baseRate,
      durationLabel,
      extraPlacesCost,
      travelerSurcharge,
      serviceFee,
      totalAmount,
      formattedTotal: `₹${totalAmount.toLocaleString('en-IN')}`,
    };
  };

  const pricing = calculatePricing();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addRequest({
      destination,
      startDate,
      endDate: isMultiDay ? endDate : startDate,
      startTime,
      isMultiDay,
      category,
      durationText: pricing.durationLabel,
      travelerCount,
      adultsCount,
      childrenCount,
      travelerCountryCity,
      travelerName: travelerName || (currentUser?.name || 'Traveler Guest'),
      travelerEmail: travelerEmail || (currentUser?.email || 'guest@example.com'),
      travelerPhone: travelerPhone || '+91 98201 44521',
      pickupLocation,
      preferredLanguage,
      interests: selectedInterests,
      selectedPlaces,
      crowdPreference,
      buddyGenderPreference,
      assignedBuddyId: activeBuddy ? activeBuddy.id : undefined,
      assignedBuddyName: activeBuddy ? activeBuddy.name : undefined,
      specialRequests:
        specialRequests + (activeBuddy ? ` (Requested Companion: ${activeBuddy.name})` : ''),
      priceBreakdown: {
        baseRate: pricing.baseRate,
        durationLabel: pricing.durationLabel,
        travelerSurcharge: pricing.travelerSurcharge,
        selectedPlacesCost: pricing.extraPlacesCost,
        serviceFee: pricing.serviceFee,
        totalAmount: pricing.totalAmount,
      },
      estimatedPriceDisplay: pricing.formattedTotal,
    });

    setSubmittedRef(created.bookingRef);
    setStep(8);
  };

  return (
    <div className="layout-container py-12">
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F] block">
          {language === 'HI' ? 'वाराणसी साथी बुकिंग' : 'Varanasi Companion Booking'}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          {t.booking.title}
        </h1>
        <p className="text-sm text-[#6E6E73] font-light max-w-lg mx-auto">
          {t.booking.subtitle}
        </p>
      </div>

      {/* Progress Bar (Visible for steps 1-7) */}
      {step <= 7 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
            <span>{language === 'HI' ? `चरण ${step} / ${totalSteps}` : `Step ${step} of ${totalSteps}`}</span>
            <span className="text-[#1D1D1F]">
              {step === 1 && (language === 'HI' ? 'चयनित बडी एवं सेवा' : 'Selected Buddy & Service')}
              {step === 2 && (language === 'HI' ? 'तिथियां एवं समय' : 'Dates & Schedule')}
              {step === 3 && (language === 'HI' ? 'बुकिंग अवधि' : 'Booking Duration')}
              {step === 4 && (language === 'HI' ? 'यात्री जानकारी' : 'Traveler Information')}
              {step === 5 && (language === 'HI' ? 'यात्रा योजना एवं दर्शनीय स्थल' : 'Tour Planning & Places')}
              {step === 6 && (language === 'HI' ? 'प्राथमिकताएं एवं सुरक्षा' : 'Preferences & Safety')}
              {step === 7 && (language === 'HI' ? 'समीक्षा एवं सारांश' : 'Review & Summary')}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E8E8E6] overflow-hidden">
            <div
              className="h-full bg-[#FF5F1F] transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E6] shadow-sm">
        
        {/* STEP 1: SELECTED BUDDY INFORMATION */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 1 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Selected Travel Companion
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Review your selected local Varanasi buddy and their verified credentials.
              </p>
            </div>

            {/* Selected Buddy Card */}
            {activeBuddy && (
              <div className="p-6 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src={activeBuddy.avatar}
                  alt={activeBuddy.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#1D1D1F]">{activeBuddy.name}</h3>
                      <p className="text-xs font-medium text-[#FF5F1F]">{activeBuddy.title}</p>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FF5F1F]/20 text-[#1D1D1F] text-xs font-bold w-fit mx-auto sm:mx-0">
                      <Star className="w-3.5 h-3.5 fill-[#FF5F1F] text-[#FF5F1F]" />
                      <span>{activeBuddy.ratingDemo}</span>
                      <span className="text-[#6E6E73] text-[11px] font-normal">({activeBuddy.totalTripsDemo} trips)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                    {activeBuddy.bio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-[#6E6E73] pt-1">
                    <span>Native: <strong className="text-[#1D1D1F]">{activeBuddy.nativeOf}</strong></span>
                    <span>•</span>
                    <span>Languages: <strong className="text-[#1D1D1F]">{activeBuddy.languages.join(', ')}</strong></span>
                    <span>•</span>
                    <span>Experience: <strong className="text-[#1D1D1F]">{activeBuddy.experienceYears}+ years</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Change buddy optional switcher */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-2">
                Need to choose a different companion?
              </label>
              <select
                value={selectedBuddyId}
                onChange={(e) => setSelectedBuddyId(e.target.value)}
                className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
              >
                {buddies.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.title} (₹{b.halfDayRate} / half-day)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Travel Dates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATES & SCHEDULE */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 2 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                When are you exploring?
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Select your travel dates and preferred morning or evening starting hour.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Preferred Starting Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                >
                  <option value="05:30 AM (Sunrise Subah-e-Banaras)">05:30 AM (Sunrise Subah-e-Banaras)</option>
                  <option value="08:00 AM (Morning Temple Circuit)">08:00 AM (Morning Temple Circuit)</option>
                  <option value="10:00 AM (Heritage Gallis & Weavers)">10:00 AM (Heritage Gallis & Weavers)</option>
                  <option value="03:30 PM (Afternoon & Sarnath)">03:30 PM (Afternoon & Sarnath)</option>
                  <option value="05:00 PM (Ganga Aarti Vantage Walk)">05:00 PM (Ganga Aarti Vantage Walk)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1D1D1F] block">Multi-Day Journey?</span>
                <span className="text-[11px] text-[#6E6E73] font-light">Explore across multiple consecutive days in Varanasi</span>
              </div>
              <input
                type="checkbox"
                checked={isMultiDay}
                onChange={(e) => setIsMultiDay(e.target.checked)}
                className="w-5 h-5 accent-[#FF5F1F] rounded cursor-pointer"
              />
            </div>

            {isMultiDay && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-[#1D1D1F] block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Duration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BOOKING DURATION */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 3 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Select Companion Duration
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Rates adjust dynamically based on {activeBuddy?.name}'s configured pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setCategory('HOURLY');
                  setIsMultiDay(false);
                }}
                className={`p-6 rounded-3xl text-left border transition-all duration-200 space-y-2 ${
                  category === 'HOURLY' && !isMultiDay
                    ? 'border-[#FF5F1F] bg-[#FFF7ED] shadow-xs'
                    : 'border-[#E8E8E6] bg-white hover:border-[#D2D2D7]'
                }`}
              >
                <span className="text-xs font-bold text-[#FF5F1F] uppercase tracking-wider block">Hourly Basis</span>
                <div className="text-2xl font-bold text-[#1D1D1F]">₹{activeBuddy?.hourlyRate * 3}</div>
                <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                  3 Hours focused walk for specific ghats or quick aarti guidance.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('HALF_DAY');
                  setIsMultiDay(false);
                }}
                className={`p-6 rounded-3xl text-left border transition-all duration-200 space-y-2 relative ${
                  category === 'HALF_DAY' && !isMultiDay
                    ? 'border-[#FF5F1F] bg-[#FFF7ED] shadow-xs'
                    : 'border-[#E8E8E6] bg-white hover:border-[#D2D2D7]'
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-[#FF5F1F] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Most Popular
                </span>
                <span className="text-xs font-bold text-[#FF5F1F] uppercase tracking-wider block">Half Day</span>
                <div className="text-2xl font-bold text-[#1D1D1F]">₹{activeBuddy?.halfDayRate}</div>
                <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                  4 Hours immersion. Perfect for morning sunrise ghats or evening aarti.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('FULL_DAY');
                  setIsMultiDay(false);
                }}
                className={`p-6 rounded-3xl text-left border transition-all duration-200 space-y-2 ${
                  category === 'FULL_DAY' && !isMultiDay
                    ? 'border-[#FF5F1F] bg-[#FFF7ED] shadow-xs'
                    : 'border-[#E8E8E6] bg-white hover:border-[#D2D2D7]'
                }`}
              >
                <span className="text-xs font-bold text-[#FF5F1F] uppercase tracking-wider block">Full Day</span>
                <div className="text-2xl font-bold text-[#1D1D1F]">₹{activeBuddy?.fullDayRate}</div>
                <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                  8 Hours comprehensive exploration covering temples, silk weavers, and riverfront.
                </p>
              </button>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Traveler Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TRAVELER INFORMATION */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 4 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Traveler & Contact Details
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                {currentUser ? `Pre-filled from your signed-in account (${currentUser.email})` : 'Provide your contact details for on-ground coordination.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shalini Verma"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Email Address</label>
                <input
                  type="email"
                  placeholder="shalini.v@example.com"
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">WhatsApp / Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98201 44521"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Origin City / Country</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, India"
                  value={travelerCountryCity}
                  onChange={(e) => setTravelerCountryCity(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Pickup Location in Varanasi</label>
                <input
                  type="text"
                  placeholder="e.g. Hotel Taj Ganges lobby or Assi Ghat"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Number of Guests (Party Size)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={activeBuddy?.maxGroupSize || 8}
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 p-3 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] font-bold text-center"
                  />
                  <span className="text-[11px] text-[#6E6E73]">
                    Max {activeBuddy?.maxGroupSize || 6} persons for {activeBuddy?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Places</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TOUR PLANNING & DESTINATIONS */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 5 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Curate Places to Visit
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Select places you want your buddy to cover. Any extra costs (boats, food tastings) are clearly shown.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tourLocations.map((loc) => {
                const isSelected = selectedPlaces.includes(loc.name);
                return (
                  <div
                    key={loc.name}
                    onClick={() => togglePlace(loc.name)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#FF5F1F] bg-[#FFF7ED] shadow-2xs'
                        : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#D2D2D7]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-[#FF5F1F] border-[#FF5F1F] text-white'
                          : 'border-[#D2D2D7] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#1D1D1F] truncate">{loc.name}</h4>
                        <span className="text-[10px] font-semibold text-[#FF5F1F]">
                          {loc.cost > 0 ? `+₹${loc.cost}` : 'Included'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6E73] font-light line-clamp-1 mt-0.5">{loc.desc}</p>
                      <span className="text-[10px] text-[#86868B] block mt-1">Est. Duration: {loc.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: PREFERENCES & SAFETY */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 6 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Pacing & Special Requirements
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Tailor the trip pace to your comfort, elder assistance, or photography needs.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1D1D1F] block mb-2">Crowd & Atmosphere Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Peaceful Locations', desc: 'Quiet ghats, ashrams & relaxed morning walks' },
                    { label: 'Popular/Crowded Attractions', desc: 'Epicenter aartis, Vishwanath Dham & busy bazaars' },
                    { label: 'Balanced Experiences', desc: 'A thoughtful blend of ancient quiet and grand spectacle' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCrowdPreference(p.label as any)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-200 space-y-1 ${
                        crowdPreference === p.label
                          ? 'border-[#FF5F1F] bg-[#FFF7ED]'
                          : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#D2D2D7]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#1D1D1F] block">{p.label}</span>
                      <p className="text-[11px] text-[#6E6E73] font-light">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Special Notes or Requirements (Wheelchair assistance, dietary restrictions, elder care)
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Traveling with senior parents, prefer slow steps and frequent chai stops."
                  className="w-full p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(7)}
                className="px-8 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Review Booking Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: BOOKING REVIEW PAGE */}
        {step === 7 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 7 of 7</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Review Booking Details
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Inspect your request summary and configured pricing breakdown before submitting.
              </p>
            </div>

            {/* Summary Details Box */}
            <div className="p-6 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-5 text-xs">
              
              {/* Selected Companion Banner */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#E8E8E6]">
                <img
                  src={activeBuddy?.avatar}
                  alt={activeBuddy?.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white shadow-xs"
                />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FF5F1F] block">Requested Companion</span>
                  <h4 className="text-base font-bold text-[#1D1D1F]">{activeBuddy?.name}</h4>
                  <p className="text-[11px] text-[#6E6E73]">{activeBuddy?.title}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Travel Dates</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {startDate} {isMultiDay ? `to ${endDate}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Duration Category</span>
                  <span className="font-bold text-[#1D1D1F]">{pricing.durationLabel}</span>
                </div>
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Starting Time</span>
                  <span className="font-bold text-[#1D1D1F]">{startTime}</span>
                </div>
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Party Size</span>
                  <span className="font-bold text-[#1D1D1F]">{travelerCount} Travelers</span>
                </div>
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Traveler Contact</span>
                  <span className="font-bold text-[#1D1D1F]">{travelerName || 'Guest'}</span>
                </div>
                <div>
                  <span className="text-[#6E6E73] text-[11px] block">Pickup Location</span>
                  <span className="font-bold text-[#1D1D1F] truncate block">{pickupLocation}</span>
                </div>
              </div>

              {/* Selected Places */}
              <div>
                <span className="text-[#6E6E73] text-[11px] block mb-1.5">Selected Itinerary Places</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlaces.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-full bg-white border border-[#E8E8E6] text-[11px] font-medium text-[#1D1D1F]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E8E8E6] space-y-2">
                <span className="text-xs font-bold text-[#1D1D1F] block uppercase tracking-wider">
                  Configured Price Breakdown
                </span>
                <div className="space-y-1.5 text-[11px] text-[#6E6E73]">
                  <div className="flex justify-between">
                    <span>Base Companion Honorarium ({pricing.durationLabel}):</span>
                    <span className="font-medium text-[#1D1D1F]">₹{pricing.baseRate.toLocaleString('en-IN')}</span>
                  </div>
                  {pricing.extraPlacesCost > 0 && (
                    <div className="flex justify-between">
                      <span>Included Activities & Boat Passes:</span>
                      <span className="font-medium text-[#1D1D1F]">₹{pricing.extraPlacesCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pricing.travelerSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span>Group Surcharge ({travelerCount} Guests):</span>
                      <span className="font-medium text-[#1D1D1F]">₹{pricing.travelerSurcharge.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Safety Verification & Coordination:</span>
                    <span className="font-medium text-[#1D1D1F]">₹{pricing.serviceFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E6]">
                  <div>
                    <span className="text-[11px] text-[#6E6E73] block uppercase tracking-wider">Total Estimated Honorarium:</span>
                    <span className="text-2xl font-sans font-bold text-[#FF5F1F]">{pricing.formattedTotal}</span>
                  </div>
                  <span className="text-[10px] text-[#86868B] max-w-[210px] text-right font-light">
                    Payable only upon buddy acceptance. Direct transparent coordination with zero commission markups.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-300 shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_6px_20px_rgba(255,95,31,0.35)] active:scale-95 flex items-center gap-2"
              >
                <span>Confirm & Submit Booking Request</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 8: CONFIRMATION SUCCESS */}
        {step === 8 && (
          <div className="text-center py-8 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#FF5F1F] flex items-center justify-center mx-auto shadow-inner border border-[#FF5F1F]/30">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F] block">
                Request Successfully Submitted
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#1D1D1F]">
                Har Har Mahadev!
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
                Your Varanasi Travel Buddy request has been placed under Tracking Reference:
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] font-mono font-bold text-base text-[#1D1D1F] tracking-wider inline-block">
                {submittedRef}
              </div>
            </div>

            <div className="max-w-lg mx-auto p-5 rounded-3xl bg-[#FFF7ED] border border-[#FF5F1F]/20 text-left text-xs text-[#1D1D1F] space-y-2">
              <span className="font-semibold flex items-center gap-1.5 text-[#FF5F1F]">
                <ShieldCheck className="w-4 h-4" />
                Booking Lifecycle & Next Steps:
              </span>
              <p className="leading-relaxed font-light text-[11px] text-[#6E6E73]">
                Your request is currently in <strong>"Request Submitted"</strong> status. Our operations desk and companion {activeBuddy?.name} will review availability. Once accepted, your confirmed status and coordinates will appear in your Traveler Dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/traveler/requests"
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95"
              >
                Track in Traveler Dashboard
              </Link>
              <Link
                to="/"
                className="px-6 py-3.5 rounded-full border border-[#E8E8E6] text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F3] transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};