import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookingCategory } from '../../types';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Compass,
  Star,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';

export const BookingSystemPage: React.FC = () => {
  const { addRequest, buddies, destinations, currentUser, t, language, updatePaymentStatus } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL query pre-fills
  const buddyIdFromUrl = searchParams.get('buddyId');
  const buddyNameFromUrl = searchParams.get('buddy');
  const cityFromUrl = searchParams.get('destination') || searchParams.get('city') || 'Varanasi (Kashi)';
  const dateFromUrl = searchParams.get('date') || searchParams.get('startDate');
  const endDateFromUrl = searchParams.get('endDate');
  const travelersFromUrl = Number(searchParams.get('travelers')) || 2;
  const categoryFromUrl = (searchParams.get('category') as BookingCategory) || 'HALF_DAY';

  // Find buddy from URL if given
  const preselectedBuddy = buddies.find(
    (b) => b.id === buddyIdFromUrl || (buddyNameFromUrl && b.name.toLowerCase() === buddyNameFromUrl.toLowerCase())
  );

  // 5 Step Linear Process (Plus Step 6 for Confirmation & Payment Simulation)
  // Step 1: Plan Your Trip (City, Dates, Duration, Travelers, Language, Experience)
  // Step 2: Select Your Travel Buddy (Cards with Verified Badge, Languages, Rating, Pricing)
  // Step 3: Customise Your Experience (Activities, Meeting Point, Notes)
  // Step 4: Booking Summary (Itemized fees, cancellation terms)
  // Step 5: Submit Booking
  // Step 6: Confirmation & Payment
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Trip Planning State
  const [destinationCity, setDestinationCity] = useState<'Varanasi' | 'Jaipur'>(
    cityFromUrl.toLowerCase().includes('jaipur') ? 'Jaipur' : 'Varanasi'
  );
  const [startDate, setStartDate] = useState(dateFromUrl || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  })());
  const [endDate, setEndDate] = useState(endDateFromUrl || startDate);
  const [isMultiDay, setIsMultiDay] = useState(Boolean(endDateFromUrl && endDateFromUrl > (dateFromUrl || '')));
  const [category, setCategory] = useState<BookingCategory>(categoryFromUrl);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [travelerCount, setTravelerCount] = useState(travelersFromUrl);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [tripExperienceType, setTripExperienceType] = useState('Heritage & Cultural Walk');

  // Step 2: Buddy Selection
  const [selectedBuddyId, setSelectedBuddyId] = useState<string>(preselectedBuddy ? preselectedBuddy.id : '');
  const [buddySelectionError, setBuddySelectionError] = useState<string | null>(null);

  // Filter buddies by destinationCity
  const cityBuddies = buddies.filter((b) => {
    const loc = (b.nativeOf || '').toLowerCase();
    const places = (b.placesCovered || []).join(' ').toLowerCase();
    if (destinationCity === 'Jaipur') {
      return loc.includes('jaipur') || places.includes('jaipur') || places.includes('hawa mahal') || places.includes('amber');
    } else {
      return !loc.includes('jaipur') && !places.includes('jaipur');
    }
  });

  const activeBuddy = buddies.find((b) => b.id === selectedBuddyId) || cityBuddies[0] || buddies[0];

  useEffect(() => {
    // If the currently selected buddy doesn't match the new city, select the first valid city buddy
    const isCurrentBuddyInCity = cityBuddies.some((b) => b.id === selectedBuddyId);
    if (!isCurrentBuddyInCity && cityBuddies.length > 0) {
      setSelectedBuddyId(cityBuddies[0].id);
      setBuddySelectionError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationCity, cityBuddies.length]);

  // Step 3: Customisation & Activities
  const varanasiActivities = [
    { name: 'Ghat Exploration & Boat Lore', category: 'Ghats', cost: 0, desc: 'Vedic steps, morning ceremonies & riverfront bastions' },
    { name: 'Shri Kashi Vishwanath Dham', category: 'Temples', cost: 0, desc: 'Sacred Jyotirlinga river-to-shrine corridor darshan' },
    { name: 'Evening Ganga Maha Aarti Vantage', category: 'Spiritual', cost: 0, desc: 'Reserved boat-side vantage for Dashashwamedh Aarti' },
    { name: 'Traditional Sunrise Wooden Rowboat', category: 'Boat Ride', cost: 400, desc: 'Peaceful dawn rowing past 84 ghats on holy Ganga' },
    { name: 'Kachori Gali & Street Food Trail', category: 'Local Food', cost: 200, desc: 'Fresh hing kachoris, winter malaiyo, and Banarasi paan' },
    { name: 'Sarnath Deer Park & Stupa Odyssey', category: 'Heritage', cost: 250, desc: 'Where Lord Buddha preached the first sermon' },
    { name: 'Madanpura Jacquard Handloom Ateliers', category: 'Handicrafts', cost: 0, desc: 'Direct-from-weaver ethical pure silk loom immersion' },
    { name: 'Ramnagar Fort & Royal Museum Walk', category: 'Heritage', cost: 200, desc: '18th-century sandstone fortress on the Ganga' },
  ];

  const jaipurActivities = [
    { name: 'Hawa Mahal & Old Walled Bazaars', category: 'Heritage', cost: 0, desc: '1799 pink sandstone palace and Johari gem lanes' },
    { name: 'Amber Fort & Maota Lake Bastions', category: 'Heritage', cost: 0, desc: 'Opulent Sheesh Mahal and Rajput hill fortress' },
    { name: 'Albert Hall Museum & Ram Niwas Bagh', category: 'Museum', cost: 150, desc: 'Indo-Saracenic royal architecture and artifacts' },
    { name: 'Jaipur Street Food & Pyaaz Kachori', category: 'Local Food', cost: 200, desc: 'Historic snack stalls, masala chai & saffron lassi' },
    { name: 'Traditional Block Printing Workshop', category: 'Handicrafts', cost: 300, desc: 'Hands-on natural block print demonstration' },
  ];

  const availableActivities = destinationCity === 'Jaipur' ? jaipurActivities : varanasiActivities;
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    destinationCity === 'Jaipur' ? 'Hawa Mahal & Old Walled Bazaars' : 'Shri Kashi Vishwanath Dham',
    destinationCity === 'Jaipur' ? 'Amber Fort & Maota Lake Bastions' : 'Ghat Exploration & Boat Lore',
  ]);

  const [pickupLocation, setPickupLocation] = useState(
    destinationCity === 'Jaipur' ? 'Hotel / Central Jaipur Railway Station' : 'Hotel Taj Ganges / Assi Ghat'
  );
  const [specialRequests, setSpecialRequests] = useState('');
  const [travelerName, setTravelerName] = useState(currentUser?.name || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [travelerPhone, setTravelerPhone] = useState('+91 98201 44521');

  const toggleActivity = (name: string) => {
    setSelectedActivities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Accurate Validated Pricing Calculation
  const calculatePricing = () => {
    const b = activeBuddy;
    let baseRate = b ? b.halfDayRate : 2000;
    let durationLabel = 'Half Day (4 hrs)';

    if (category === 'HOURLY') {
      baseRate = (b ? b.hourlyRate : 500) * 3;
      durationLabel = 'Hourly Basis (3 hrs minimum)';
    } else if (category === 'FULL_DAY') {
      baseRate = b ? b.fullDayRate : 3500;
      durationLabel = 'Full Day (8 hrs)';
    } else if (isMultiDay) {
      baseRate = (b ? b.multiDayDailyRate : 3000) * 2;
      durationLabel = 'Multi-Day (2 Days Baseline)';
    }

    const extraActivitiesCost = selectedActivities.reduce((sum, actName) => {
      const match = availableActivities.find((a) => a.name === actName);
      return sum + (match ? match.cost : 0);
    }, 0);

    const extraTravelers = Math.max(0, travelerCount - 2);
    const travelerSurcharge = extraTravelers * 300;
    const platformServiceFee = 150;
    const applicableTaxes = Math.round((baseRate + extraActivitiesCost + travelerSurcharge) * 0.05); // 5% GST
    const totalAmount = baseRate + extraActivitiesCost + travelerSurcharge + platformServiceFee + applicableTaxes;

    return {
      baseRate,
      durationLabel,
      extraActivitiesCost,
      travelerSurcharge,
      platformServiceFee,
      applicableTaxes,
      totalAmount,
      formattedTotal: `₹${totalAmount.toLocaleString('en-IN')}`,
    };
  };

  const pricing = calculatePricing();

  // Submission State
  const [createdBooking, setCreatedBooking] = useState<{ id: string; bookingRef: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const created = addRequest({
      destination: destinationCity === 'Jaipur' ? 'Jaipur (Pink City)' : 'Varanasi (Kashi)',
      startDate,
      endDate: isMultiDay ? endDate : startDate,
      startTime,
      isMultiDay,
      category,
      durationText: pricing.durationLabel,
      travelerCount,
      travelerCountryCity: destinationCity,
      travelerName: travelerName || (currentUser?.name || 'Traveler Guest'),
      travelerEmail: travelerEmail || (currentUser?.email || 'guest@example.com'),
      travelerPhone: travelerPhone || '+91 98201 44521',
      pickupLocation,
      preferredLanguage,
      interests: [tripExperienceType],
      selectedPlaces: selectedActivities,
      crowdPreference: 'Balanced Experiences',
      buddyGenderPreference: 'Any',
      assignedBuddyId: activeBuddy ? activeBuddy.id : undefined,
      assignedBuddyName: activeBuddy ? activeBuddy.name : undefined,
      specialRequests: specialRequests
        ? `${specialRequests} (Companion Chosen: ${activeBuddy?.name || 'Any'})`
        : `Selected Companion: ${activeBuddy?.name || 'Any'}`,
      priceBreakdown: {
        baseRate: pricing.baseRate,
        durationLabel: pricing.durationLabel,
        travelerSurcharge: pricing.travelerSurcharge,
        selectedPlacesCost: pricing.extraActivitiesCost,
        serviceFee: pricing.platformServiceFee + pricing.applicableTaxes,
        totalAmount: pricing.totalAmount,
      },
      estimatedPriceDisplay: pricing.formattedTotal,
    });

    setCreatedBooking({ id: created.id, bookingRef: created.bookingRef });
    setIsSubmitting(false);
    setStep(6);
  };

  const handleSimulatePayment = () => {
    if (!createdBooking) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      const mockTxn = `TXN-RAZOR-${Math.floor(100000 + Math.random() * 900000)}`;
      updatePaymentStatus(createdBooking.id, 'Successful', mockTxn);
      setPaymentProcessing(false);
    }, 1200);
  };

  return (
    <div className="layout-container py-12">
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F] block">
          {language === 'HI' ? 'सत्यापित साथी बुकिंग' : 'Verified Travel Buddy Booking'}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          {language === 'HI' ? 'अपनी यात्रा एवं साथी चुनें' : 'Book Your Verified Travel Buddy'}
        </h1>
        <p className="text-sm text-[#6E6E73] font-light max-w-lg mx-auto">
          {language === 'HI'
            ? 'अपनी यात्रा की तारीखें तय करें, अपनी पसंद के स्थानीय साथी चुनें और सुरक्षित रूप से अपनी बुकिंग करें।'
            : 'Plan dates, select from verified local companions, customize your itinerary, and track your booking status.'}
        </p>
      </div>

      {/* 5-Step Linear Progress Bar (Visible for steps 1-5) */}
      {step <= 5 && (
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
            <span>{`Step ${step} of ${totalSteps}`}</span>
            <span className="text-[#1D1D1F]">
              {step === 1 && 'Step 1: Plan Your Trip'}
              {step === 2 && 'Step 2: Select Your Travel Buddy'}
              {step === 3 && 'Step 3: Customise Your Experience'}
              {step === 4 && 'Step 4: Booking Summary'}
              {step === 5 && 'Step 5: Review & Submit Booking'}
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

      {/* Main Booking Card Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E6] shadow-sm">
        
        {/* ================= STEP 1: PLAN YOUR TRIP ================= */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1 pb-4 border-b border-[#E8E8E6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 1 — Destination & Dates</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Where and when are you travelling?
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Select your supported destination city, travel dates, companion duration, and party size.
              </p>
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider block">
                Destination City
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDestinationCity('Varanasi')}
                  className={`p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between ${
                    destinationCity === 'Varanasi'
                      ? 'border-[#FF5F1F] bg-[#FFF7ED] ring-1 ring-[#FF5F1F]'
                      : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#D2D2D7]'
                  }`}
                >
                  <div>
                    <h4 className="text-base font-bold text-[#1D1D1F]">Varanasi (Kashi)</h4>
                    <p className="text-xs text-[#6E6E73] mt-0.5">84 Ghats, Vishwanath Corridor, Sarnath & Street Food</p>
                  </div>
                  {destinationCity === 'Varanasi' && <CheckCircle2 className="w-5 h-5 text-[#FF5F1F]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationCity('Jaipur')}
                  className={`p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between ${
                    destinationCity === 'Jaipur'
                      ? 'border-[#FF5F1F] bg-[#FFF7ED] ring-1 ring-[#FF5F1F]'
                      : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#D2D2D7]'
                  }`}
                >
                  <div>
                    <h4 className="text-base font-bold text-[#1D1D1F]">Jaipur (Pink City)</h4>
                    <p className="text-xs text-[#6E6E73] mt-0.5">Hawa Mahal, Amber Fort, Albert Hall & Royal Bazaars</p>
                  </div>
                  {destinationCity === 'Jaipur' && <CheckCircle2 className="w-5 h-5 text-[#FF5F1F]" />}
                </button>
              </div>
            </div>

            {/* Travel Dates & Multi-Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Travel Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Preferred Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                >
                  <option value="05:30 AM (Sunrise & Ghat Ceremony)">05:30 AM (Sunrise & Ghat Ceremony)</option>
                  <option value="08:00 AM (Morning Heritage Walk)">08:00 AM (Morning Heritage Walk)</option>
                  <option value="10:30 AM (Alleyways & Local Artisans)">10:30 AM (Alleyways & Local Artisans)</option>
                  <option value="03:30 PM (Afternoon Exploration)">03:30 PM (Afternoon Exploration)</option>
                  <option value="05:00 PM (Sunset & Evening Aarti)">05:00 PM (Sunset & Evening Aarti)</option>
                </select>
              </div>
            </div>

            {/* Multi-day toggle */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1D1D1F] block">Multi-Day Accompaniment?</span>
                <span className="text-[11px] text-[#6E6E73] font-light">Explore across multiple consecutive days</span>
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
                <label className="text-xs font-semibold text-[#1D1D1F] block">Travel End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            )}

            {/* Duration Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider block">
                Companion Duration Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'HOURLY', label: 'Hourly Block (3 Hrs)', desc: 'Focused visits, boat rides, or food trails' },
                  { id: 'HALF_DAY', label: 'Half Day (4 Hrs)', desc: 'Standard morning or evening immersion' },
                  { id: 'FULL_DAY', label: 'Full Day (8 Hrs)', desc: 'Unrushed all-day cultural exploration' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setCategory(tier.id as BookingCategory);
                      setIsMultiDay(false);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                      category === tier.id && !isMultiDay
                        ? 'border-[#FF5F1F] bg-[#FFF7ED] ring-1 ring-[#FF5F1F]'
                        : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#D2D2D7]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#1D1D1F] block">{tier.label}</span>
                    <span className="text-[11px] text-[#6E6E73] font-light block mt-0.5">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Party Size & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Number of Travellers</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs font-bold text-[#1D1D1F] text-center"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Preferred Companion Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                </select>
              </div>
            </div>

            {/* Primary Experience Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1F] block">Type of Travel Experience</label>
              <select
                value={tripExperienceType}
                onChange={(e) => setTripExperienceType(e.target.value)}
                className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
              >
                <option value="Heritage & Cultural Walk">Heritage & Cultural Walk</option>
                <option value="Spiritual & Temple Exploration">Spiritual & Temple Exploration</option>
                <option value="Ghat Exploration & Boat Lore">Ghat Exploration & Boat Lore</option>
                <option value="Local Street Food Trail">Local Street Food Trail</option>
                <option value="Handicraft & Silk Weavers Route">Handicraft & Silk Weavers Route</option>
                <option value="Photography & Hidden Alleys">Photography & Hidden Alleys</option>
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Select Travel Buddy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SELECT YOUR TRAVEL BUDDY ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1 pb-4 border-b border-[#E8E8E6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 2 — Available Buddies</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Choose your companion in {destinationCity}
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Every listed companion is identity-verified. Compare hourly rates, languages, and cultural specialties.
              </p>
            </div>

            {/* Validation Alert */}
            {buddySelectionError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 text-xs animate-shake">
                <AlertCircle className="w-5 h-5 text-[#FF5F1F] shrink-0" />
                <span className="font-medium">{buddySelectionError}</span>
              </div>
            )}

            {/* Buddy Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityBuddies.map((buddy) => {
                const isSelected = selectedBuddyId === buddy.id;
                return (
                  <div
                    key={buddy.id}
                    onClick={() => {
                      setSelectedBuddyId(buddy.id);
                      setBuddySelectionError(null);
                    }}
                    className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-[#FF5F1F] bg-[#FFF7ED] ring-1 ring-[#FF5F1F] shadow-sm'
                        : 'border-[#E8E8E6] bg-white hover:border-[#D2D2D7]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={buddy.avatar}
                          alt={buddy.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
                        />
                        <span
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF5F1F] text-white flex items-center justify-center border-2 border-white shadow-2xs"
                          title="Verified Active Companion"
                        >
                          <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-[#1D1D1F] truncate">{buddy.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF5F1F] shrink-0">
                            <Star className="w-3 h-3 fill-[#FF5F1F]" />
                            <span>{buddy.ratingDemo}</span>
                            <span className="text-[#6E6E73] font-normal">({buddy.totalTripsDemo})</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#FF5F1F] font-medium line-clamp-1">{buddy.title}</p>
                        <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2 leading-relaxed font-light">{buddy.bio}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E8E6]/60 text-[11px] space-y-1.5 text-[#6E6E73]">
                      <div className="flex items-center justify-between">
                        <span>Languages:</span>
                        <strong className="text-[#1D1D1F]">{buddy.languages.join(', ')}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rate:</span>
                        <strong className="text-[#1D1D1F]">
                          ₹{buddy.halfDayRate} / half-day (₹{buddy.hourlyRate}/hr)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Availability:</span>
                        <span className="text-emerald-700 font-semibold">{buddy.availabilityNote || 'Slots Available'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        to={`/buddies/${buddy.id}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] underline"
                      >
                        View Full Profile
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBuddyId(buddy.id);
                          setBuddySelectionError(null);
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                          isSelected
                            ? 'bg-[#FF5F1F] text-white shadow-xs'
                            : 'bg-[#F5F5F3] text-[#1D1D1F] hover:bg-[#E8E8E6]'
                        }`}
                      >
                        {isSelected ? 'Selected Companion' : 'Select Companion'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => {
                  setBuddySelectionError(null);
                  setStep(1);
                }}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedBuddyId) {
                    setBuddySelectionError('Please choose a local travel companion before proceeding to customize your experience.');
                    return;
                  }
                  setBuddySelectionError(null);
                  setStep(3);
                }}
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Customise Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CUSTOMISE YOUR EXPERIENCE ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1 pb-4 border-b border-[#E8E8E6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 3 — Customise Experience</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Select Itinerary Activities in {destinationCity}
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Tailor your journey. Included stops and supplemental coordination fees (like boat passes) are transparently shown.
              </p>
            </div>

            {/* Activities Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableActivities.map((act) => {
                const isSelected = selectedActivities.includes(act.name);
                return (
                  <div
                    key={act.name}
                    onClick={() => toggleActivity(act.name)}
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
                        <h4 className="text-xs font-bold text-[#1D1D1F] truncate">{act.name}</h4>
                        <span className="text-[10px] font-semibold text-[#FF5F1F]">
                          {act.cost > 0 ? `+₹${act.cost}` : 'Included'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6E73] font-light line-clamp-1 mt-0.5">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Meeting Point & Special Requirements */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">Preferred Meeting / Pickup Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Hotel lobby, Assi Ghat, or Badi Choupad"
                  className="w-full p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Special Notes or Requirements (Senior mobility assistance, photography pace, diet)
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

            {/* Traveler Contact Fields */}
            <div className="pt-2 border-t border-[#E8E8E6] space-y-3">
              <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider block">Lead Traveler Contact</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile (+91)"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="p-3.5 rounded-full bg-[#FAFAF8] border border-[#E8E8E6] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#FF5F1F]"
                  required
                />
              </div>
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
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Booking Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: BOOKING SUMMARY ================= */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1 pb-4 border-b border-[#E8E8E6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 4 — Transparent Summary</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Booking Summary & Breakdown
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Inspect every itemized line item, policy terms, and companion honorarium before final submission.
              </p>
            </div>

            {/* Selected Companion Banner */}
            <div className="p-5 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center gap-4">
              <img
                src={activeBuddy?.avatar}
                alt={activeBuddy?.name}
                className="w-16 h-16 rounded-2xl object-cover border border-white shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#FF5F1F] uppercase tracking-wider block">Assigned Local Companion</span>
                <h3 className="text-base font-bold text-[#1D1D1F]">{activeBuddy?.name}</h3>
                <p className="text-xs text-[#6E6E73] font-light">{activeBuddy?.title} • {activeBuddy?.nativeOf}</p>
              </div>
            </div>

            {/* Key Trip Parameters Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-5 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6]">
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Destination</span>
                <strong className="text-[#1D1D1F]">{destinationCity}</strong>
              </div>
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Travel Date</span>
                <strong className="text-[#1D1D1F]">{startDate} {isMultiDay ? `to ${endDate}` : ''}</strong>
              </div>
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Start Time</span>
                <strong className="text-[#1D1D1F]">{startTime}</strong>
              </div>
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Duration Category</span>
                <strong className="text-[#1D1D1F]">{pricing.durationLabel}</strong>
              </div>
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Travelers</span>
                <strong className="text-[#1D1D1F]">{travelerCount} Guests</strong>
              </div>
              <div>
                <span className="text-[#6E6E73] text-[11px] block">Preferred Language</span>
                <strong className="text-[#1D1D1F]">{preferredLanguage}</strong>
              </div>
            </div>

            {/* Itemized Pricing Breakdown Box */}
            <div className="p-5 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-2 text-xs">
              <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider block">
                Validated Price Engine Breakdown
              </span>

              <div className="space-y-1.5 text-[11px] text-[#6E6E73] pt-1">
                <div className="flex justify-between">
                  <span>Companion Honorarium ({pricing.durationLabel}):</span>
                  <span className="font-semibold text-[#1D1D1F]">₹{pricing.baseRate.toLocaleString('en-IN')}</span>
                </div>
                {pricing.extraActivitiesCost > 0 && (
                  <div className="flex justify-between">
                    <span>Selected Activity Passes / Boat Coordination:</span>
                    <span className="font-semibold text-[#1D1D1F]">₹{pricing.extraActivitiesCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {pricing.travelerSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Group Surcharge ({travelerCount} Guests):</span>
                    <span className="font-semibold text-[#1D1D1F]">₹{pricing.travelerSurcharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Platform Verification & Safety Coordination:</span>
                  <span className="font-semibold text-[#1D1D1F]">₹{pricing.platformServiceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (5%):</span>
                  <span className="font-semibold text-[#1D1D1F]">₹{pricing.applicableTaxes.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E8E6] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6E6E73] block uppercase tracking-wider">Final Payable Amount:</span>
                  <span className="text-2xl font-bold text-[#FF5F1F] font-sans">{pricing.formattedTotal}</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200">
                  No Hidden Convenience Fees
                </span>
              </div>
            </div>

            {/* Policy & Terms Banner */}
            <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FF5F1F]/20 text-xs text-[#1D1D1F] space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-[#FF5F1F]">
                <ShieldCheck className="w-4 h-4" />
                Cancellation & Refund Terms:
              </span>
              <p className="text-[11px] text-[#6E6E73] font-light leading-relaxed">
                Full 100% refund on cancellations requested at least 24 hours prior to scheduled starting hour. Easy rescheduling supported directly from your Traveler Dashboard.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Selections</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Proceed to Submit Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: SUBMIT BOOKING ================= */}
        {step === 5 && (
          <form onSubmit={handleSubmitBooking} className="space-y-6 animate-fade-in">
            <div className="space-y-1 pb-4 border-b border-[#E8E8E6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">Step 5 — Final Confirmation</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Confirm & Place Booking Request
              </h2>
              <p className="text-xs text-[#6E6E73] font-light">
                Once submitted, your booking request is assigned to {activeBuddy?.name} and recorded with a unique tracking reference.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
                <span className="text-[#6E6E73]">Lead Traveler:</span>
                <strong className="text-[#1D1D1F]">{travelerName || 'Guest'} ({travelerPhone})</strong>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
                <span className="text-[#6E6E73]">Destination & Companion:</span>
                <strong className="text-[#1D1D1F]">{destinationCity} • {activeBuddy?.name}</strong>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
                <span className="text-[#6E6E73]">Date & Time:</span>
                <strong className="text-[#1D1D1F]">{startDate} @ {startTime}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6E73]">Payable Amount:</span>
                <strong className="text-base text-[#FF5F1F] font-bold">{pricing.formattedTotal}</strong>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E8E8E6]">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-full border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Review Summary</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-300 shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_6px_20px_rgba(255,95,31,0.35)] active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Request...' : 'Confirm & Submit Booking'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 6: CONFIRMATION & PAYMENT SIMULATION ================= */}
        {step === 6 && createdBooking && (
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#FF5F1F] flex items-center justify-center mx-auto shadow-inner border border-[#FF5F1F]/30">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F] block">
                Booking Request Placed
              </span>
              <h2 className="text-3xl font-sans font-bold text-[#1D1D1F]">
                Thank you, {travelerName || 'Guest'}!
              </h2>
              <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                Your travel companion request has been assigned reference ID:
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] font-mono font-bold text-base text-[#1D1D1F] tracking-wider inline-block">
                {createdBooking.bookingRef}
              </div>
            </div>

            {/* Payment Gateway Notice (Pending Integration) */}
            <div className="max-w-md mx-auto p-5 rounded-3xl bg-[#FAFAF8] border border-[#E8E8E6] text-left text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E6]">
                <span className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#FF5F1F]" />
                  Payment Gateway Integration
                </span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Pending Gateway Activation
                </span>
              </div>
              <p className="text-[11px] text-[#6E6E73] font-light leading-relaxed">
                Online payment processing via Razorpay/UPI/Cards is currently pending merchant onboarding and will be activated in an upcoming update. Your booking request has been safely recorded in the platform with payment status: <strong>Pending Escrow</strong>.
              </p>
              <div className="p-3 rounded-2xl bg-white border border-[#E8E8E6] flex items-center justify-between text-xs">
                <span className="text-[#6E6E73]">Total Payable upon Activation:</span>
                <strong className="text-[#1D1D1F] font-bold">{pricing.formattedTotal}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/traveler/requests"
                className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95"
              >
                Track in My Bookings
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
