import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DestinationCard } from '../../components/destinations/DestinationCard';
import { TravelBookingSearchBar } from '../../components/common/TravelBookingSearchBar';
import { HomeEventsSection } from '../../components/events/HomeEventsSection';
import { TESTIMONIALS_DATA } from '../../data/mockData';

export const HomePage: React.FC = () => {
  const { destinations, buddies, experiences, t, language } = useApp();

  // Curated Packages
  const packages = [
    {
      title: language === 'HI' ? 'प्रातःकालीन बनारस' : 'Morning Awakening',
      subtitle: language === 'HI' ? 'सुबह-ए-बनारस एवं प्राचीन घाट भ्रमण' : 'Subah-e-Banaras & Old Ghat Walk',
      city: 'Varanasi',
      duration: language === 'HI' ? '3.5 घंटे (प्रातः 5:00 – 8:30)' : '3.5 Hours (5:00 AM – 8:30 AM)',
      people: language === 'HI' ? '1 से 4 व्यक्ति' : '1 to 4 People',
      places: language === 'HI' ? 'अस्सी घाट, तुलसी घाट, पारंपरिक अखाड़ा, लकड़ी की नौका यात्रा एवं कुल्हड़ चाय' : 'Assi Ghat, Tulsi Ghat, Akhada visit, Morning wooden boat ride & hot kulhad chai',
      buddyFee: '₹1,500',
      extras: language === 'HI' ? 'नौका शुल्क (~₹400) वास्तविक खर्च पर देय' : 'Boat fee (~₹400) payable at actuals',
      popular: false,
    },
    {
      title: language === 'HI' ? 'काशी की आत्मा' : 'Soul of Kashi',
      subtitle: language === 'HI' ? 'धरोहर गलियाँ, विश्वनाथ धाम एवं गंगा आरती' : 'Heritage Gallis, Vishwanath Dham & River Aarti',
      city: 'Varanasi',
      duration: language === 'HI' ? 'आधा दिन (4.5 घंटे)' : 'Half Day (4.5 Hours)',
      people: language === 'HI' ? '1 से 4 व्यक्ति' : '1 to 4 People',
      places: language === 'HI' ? 'काशी विश्वनाथ कॉरिडोर, प्राचीन गलियाँ, कचौड़ी गली स्वाद एवं दशाश्वमेध महाआरती' : 'Kashi Vishwanath Corridor, Old Alleyways, Kachori Gali tasting & Evening Dashashwamedh Aarti',
      buddyFee: '₹2,400',
      extras: language === 'HI' ? 'प्रसाद एवं खान-पान वास्तविक खर्च पर देय' : 'Food tastings and offerings at actuals',
      popular: true,
    },
    {
      title: language === 'HI' ? 'शाही जयपुर विरासत' : 'Royal Jaipur Heritage',
      subtitle: language === 'HI' ? 'हवा महल, आमेर किला एवं चारदीवारी शहर' : 'Hawa Mahal, Amber Fort & Old Walled Bazaars',
      city: 'Jaipur',
      duration: language === 'HI' ? 'पूरा दिन (7 घंटे)' : 'Full Day (7 Hours)',
      people: language === 'HI' ? '1 से 5 व्यक्ति' : '1 to 5 People',
      places: language === 'HI' ? 'हवा महल झरोखे, जोहरी बाज़ार, आमेर शीश महल एवं प्रामाणिक राजस्थानी स्वाद' : 'Hawa Mahal lattice balconies, Johari Gem Bazaar, Amber Sheesh Mahal & authentic Ghewar tasting',
      buddyFee: '₹3,500',
      extras: language === 'HI' ? 'किला प्रवेश एवं स्थानीय टैक्सी वास्तविक खर्च पर देय' : 'Monument entry & local cab conveyance at actuals',
      popular: false,
    },
    {
      title: language === 'HI' ? 'संपूर्ण बनारस अनुभव' : 'The Complete Immersion',
      subtitle: language === 'HI' ? 'आरामदायक पूरे दिन का सांस्कृतिक सफर' : 'Unhurried Full-Day Cultural Odyssey',
      city: 'Varanasi',
      duration: language === 'HI' ? 'पूरा दिन (8 घंटे)' : 'Full Day (8 Hours)',
      people: language === 'HI' ? '1 से 5 व्यक्ति' : '1 to 5 People',
      places: language === 'HI' ? 'सूर्योदय नौका यात्रा, मदनपुरा के बुनकर करघे, सारनाथ स्तूप एवं संध्या आरती' : 'Sunrise Boat, Weaver Pit-looms of Madanpura, Sarnath Deer Park & Evening Aarti vantage',
      buddyFee: '₹3,800',
      extras: language === 'HI' ? 'स्थानीय वाहन/टैक्सी वास्तविक खर्च पर देय' : 'Auto/Cab conveyance at actuals',
      popular: false,
    },
  ];

  return (
    <div className="bg-[#FAFAF8] text-[#1D1D1F] selection:bg-[#FF5F1F]/20 selection:text-[#EC5800]">
      {/* 1. HERO SECTION — Apple-inspired Minimalist Landing Experience */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 layout-container-wide text-center overflow-hidden animate-fade-in">
        {/* Apple Style Top Category Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#F5F5F3] text-[#6E6E73] text-xs font-medium tracking-wide animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F]" />
          <span>{t.hero.eyebrow}</span>
        </div>

        {/* Large, Bold, Elegant Apple-style Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold tracking-tight text-[#1D1D1F] leading-[1.05] text-balance animate-fade-up delay-100">
          {t.hero.headlinePart1} <br className="hidden sm:inline" />
          <span className="text-[#1D1D1F]">{t.hero.headlinePart2}</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl text-[#6E6E73] font-light max-w-2xl mx-auto leading-relaxed text-balance animate-fade-up delay-150">
          {t.hero.subheadline}
        </p>

        {/* Buttons: Consistent Apple-style Pill Pair */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 animate-fade-up delay-200">
          <Link
            to="/buddies"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_6px_20px_rgba(255,95,31,0.35)] active:scale-95 flex items-center justify-center gap-1.5 btn-press"
          >
            <span>{t.hero.findBuddyBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/destinations"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#F5F5F3] hover:bg-[#E8E8E6] text-[#1D1D1F] text-sm font-medium transition-all duration-200 active:scale-95 btn-press"
          >
            {t.hero.exploreBtn}
          </Link>
        </div>

        {/* Travel Search & Booking Bar inside Hero Banner */}
        <TravelBookingSearchBar />

        {/* Cinematic Travel Photograph with Refined Rounded Border Frame */}
        <div className="mt-12 sm:mt-16 relative rounded-3xl overflow-hidden bg-[#F5F5F3] border border-[#E8E8E6] shadow-[0_8px_40px_rgba(0,0,0,0.06)] aspect-[16/10] sm:aspect-[21/10] lg:aspect-[24/10] group animate-fade-up delay-300">
          <picture className="w-full h-full block">
            <source srcSet="/images/hero/varanasi-dashashwamedh-ghat.webp" type="image/webp" />
            <img
              src="/images/hero/varanasi-dashashwamedh-ghat.jpg"
              alt="Companionship along Dashashwamedh Ghat & River Ganga in Varanasi, India"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width="2000"
              height="1500"
              className="w-full h-full object-cover object-[center_55%] scale-100 group-hover:scale-[1.025] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

          {/* Understated Editorial Caption Pill */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] sm:text-xs font-medium text-[#1D1D1F] shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
            <MapPin className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Dashashwamedh Ghat, Varanasi</span>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION — Spacious, Editorial, Minimal */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F28C28] block mb-4">
          {t.intro.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F] leading-[1.15] text-balance">
          {t.intro.titlePart1} <br className="hidden sm:inline" />
          <span className="text-[#6E6E73] font-normal">{t.intro.titlePart2}</span>
        </h2>
        <p className="mt-8 text-base sm:text-lg md:text-xl text-[#6E6E73] font-light leading-relaxed max-w-3xl mx-auto text-balance">
          {t.intro.description}
        </p>

        {/* 3 Pillars in minimal typography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left border-t border-[#E8E8E6] mt-16">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#1D1D1F]">{t.intro.pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed font-light">
              {t.intro.pillar1Desc}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#1D1D1F]">{t.intro.pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed font-light">
              {t.intro.pillar2Desc}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#1D1D1F]">{t.intro.pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed font-light">
              {t.intro.pillar3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 2.5 HOW IT WORKS — Simple Steps. Better Journeys. */}
      <section className="py-24 sm:py-32 layout-container border-t border-[#E8E8E6]">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
            {t.howItWorks.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Desktop: Horizontal Connected 4-Step Sequence | Mobile: Clean Vertical Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
          {/* Step 1 */}
          <div className="group relative flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] motion-gpu">
            <div className="space-y-4">
              <span className="text-5xl sm:text-6xl font-sans font-extrabold text-[#FF5F1F] tracking-tight block transition-transform duration-300 group-hover:scale-105">
                01
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#FF5F1F] transition-colors duration-200">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6E73] font-light leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-[#86868B] font-medium border-t border-[#E8E8E6]">
              {t.common.explore}
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] motion-gpu">
            <div className="space-y-4">
              <span className="text-5xl sm:text-6xl font-sans font-extrabold text-[#FF5F1F] tracking-tight block transition-transform duration-300 group-hover:scale-105">
                02
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#FF5F1F] transition-colors duration-200">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6E73] font-light leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-[#86868B] font-medium border-t border-[#E8E8E6]">
              {t.common.findBuddy}
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] motion-gpu">
            <div className="space-y-4">
              <span className="text-5xl sm:text-6xl font-sans font-extrabold text-[#FF5F1F] tracking-tight block transition-transform duration-300 group-hover:scale-105">
                03
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#FF5F1F] transition-colors duration-200">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6E73] font-light leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-[#86868B] font-medium border-t border-[#E8E8E6]">
              {t.common.duration}
            </div>
          </div>

          {/* Step 4 */}
          <div className="group relative flex flex-col justify-between space-y-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E8E6] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D2D2D7] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] motion-gpu">
            <div className="space-y-4">
              <span className="text-5xl sm:text-6xl font-sans font-extrabold text-[#FF5F1F] tracking-tight block transition-transform duration-300 group-hover:scale-105">
                04
              </span>
              <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#FF5F1F] transition-colors duration-200">
                {t.howItWorks.step4Title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6E73] font-light leading-relaxed">
                {t.howItWorks.step4Desc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-[#86868B] font-medium border-t border-[#E8E8E6]">
              {t.common.bookBuddy}
            </div>
          </div>
        </div>

        {/* Subtle CTA link */}
        <div className="text-center pt-12">
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[#FF5F1F] hover:text-[#EC5800] transition-colors"
          >
            <span>{t.common.exploreMore} &rarr;</span>
          </Link>
        </div>
      </section>

      {/* 3. EXPLORE SOMEWHERE BEAUTIFUL — Editorial Travel Magazine Grid */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E8E8E6]">
        <div className="layout-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
                {t.destinations.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
                {t.destinations.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
                {t.destinations.subtitle}
              </p>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#FF5F1F] hover:text-[#EC5800] transition-colors self-start md:self-auto group"
            >
              <span>{t.destinations.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {destinations.slice(0, 6).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* NEW: UPCOMING FESTIVALS & CULTURAL EVENTS DISCOVERY SYSTEM */}
      <HomeEventsSection />

      {/* 4. FIND YOUR LOCAL BUDDY — Core Feature with Real Profiles */}
      <section className="py-24 sm:py-32 layout-container">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F28C28] block">
            {t.buddies.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
            {t.buddies.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
            {t.buddies.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {buddies.slice(0, 3).map((buddy) => (
            <div
              key={buddy.id}
              className="bg-white rounded-3xl p-7 border border-[#E8E8E6] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-[#D2D2D7] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Avatar & Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-lg font-bold text-[#1D1D1F] truncate">
                        {buddy.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#1D1D1F]">
                        <Star className="w-3.5 h-3.5 fill-[#F28C28] text-[#F28C28]" />
                        <span>{buddy.ratingDemo}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6E6E73] line-clamp-1 mt-0.5">
                      {buddy.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#6E6E73]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F28C28]" />
                        {buddy.nativeOf}
                      </span>
                      <span>•</span>
                      <span>{buddy.experienceYears}+ yrs exp</span>
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-[#6E6E73] font-light leading-relaxed line-clamp-3">
                  {buddy.bio}
                </p>

                {/* Languages & Specialization */}
                <div className="space-y-2 pt-2 border-t border-[#E8E8E6] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">Languages:</span>
                    <span className="font-medium text-[#1D1D1F]">{buddy.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">Specialization:</span>
                    <span className="font-medium text-[#1D1D1F] truncate max-w-[170px]">{buddy.expertise.slice(0, 2).join(' & ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">Availability:</span>
                    <span className="text-[#EC5800] font-medium text-[11px]">{buddy.availabilityNote}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-[#E8E8E6] grid grid-cols-2 gap-3">
                <Link
                  to={`/buddies/${buddy.id}`}
                  className="py-2.5 text-center rounded-full text-xs font-medium text-[#1D1D1F] bg-[#F5F5F3] hover:bg-[#E8E8E6] transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book?buddy=${encodeURIComponent(buddy.name)}`}
                  className="py-2.5 text-center rounded-full text-xs font-semibold text-white bg-[#F28C28] hover:bg-[#EC5800] transition-colors shadow-2xs active:scale-95"
                >
                  Book Buddy
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-12">
          <Link
            to="/buddies"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1D1D1F] hover:text-[#F28C28] transition-colors"
          >
            <span>Meet all verified Varanasi companions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. EXPERIENCES — Unique Curated Varanasi Immersions */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E8E8E6]">
        <div className="layout-container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F28C28] block">
              {t.experiences.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
              {t.experiences.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
              {t.experiences.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.slice(0, 6).map((exp) => (
              <div
                key={exp.id}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#E8E8E6] p-5 hover:border-[#D2D2D7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#F5F5F3] relative">
                    <img
                      src={exp.coverImage}
                      alt={exp.title}
                      loading="lazy"
                      decoding="async"
                      width="500"
                      height="312"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[11px] font-semibold text-[#1D1D1F] px-2.5 py-1 rounded-full shadow-2xs">
                      {exp.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                      <Clock className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>{exp.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1D1D1F] leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-[#6E6E73] font-light line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E8E6] flex items-center justify-between">
                  <span className="text-xs text-[#6E6E73] font-light">With verified companion</span>
                  <Link
                    to={`/book?category=${encodeURIComponent(exp.category)}`}
                    className="text-xs font-semibold text-[#F28C28] hover:text-[#EC5800] flex items-center gap-1 group/btn"
                  >
                    <span>Book Experience</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRAVEL PACKAGES — Clean & Transparent */}
      <section id="packages" className="py-24 sm:py-32 layout-container">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F28C28] block">
            {t.packages.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
            {t.packages.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
            {t.packages.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 relative motion-gpu ${pkg.popular
                ? 'bg-white border-2 border-[#FF5F1F] shadow-[0_12px_36px_rgba(255,95,31,0.12)] hover:shadow-[0_20px_48px_rgba(255,95,31,0.18)]'
                : 'bg-white border border-[#E8E8E6] shadow-sm hover:border-[#D2D2D7] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]'
                }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5F1F] text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-2xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F]">{pkg.title}</h3>
                  <p className="text-xs text-[#6E6E73] mt-1 font-light">{pkg.subtitle}</p>
                </div>

                <div className="space-y-2 text-xs border-y border-[#E8E8E6] py-4">
                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Duration:</span>
                    <span className="font-medium text-[#1D1D1F]">{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Party Size:</span>
                    <span className="font-medium text-[#1D1D1F]">{pkg.people}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[#1D1D1F] block">Places Covered:</span>
                  <p className="text-xs text-[#6E6E73] font-light leading-relaxed">
                    {pkg.places}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-sans font-bold text-[#1D1D1F]">{pkg.buddyFee}</span>
                    <span className="text-xs text-[#6E6E73]">companion honorarium</span>
                  </div>
                  <p className="text-[11px] text-[#86868B] mt-1">{pkg.extras}</p>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={`/book?destination=${encodeURIComponent(pkg.city || 'Varanasi')}&package=${encodeURIComponent(pkg.title)}`}
                  className={`w-full py-3 rounded-full text-xs font-semibold text-center block transition-all active:scale-95 ${pkg.popular
                    ? 'bg-[#F28C28] hover:bg-[#EC5800] text-white shadow-sm'
                    : 'bg-[#1D1D1F] hover:bg-[#2C2C2E] text-white'
                    }`}
                >
                  Book Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER EXPERIENCES — Apple-Inspired Editorial Testimonials */}
      <section className="py-24 sm:py-32 bg-white border-t border-[#E8E8E6]">
        <div className="layout-container">
          <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20 space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
              {t.testimonials.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
              {t.testimonials.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] font-light max-w-md mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {TESTIMONIALS_DATA.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="bg-[#FAFAF8] rounded-3xl p-8 sm:p-10 border border-[#E8E8E6] flex flex-col justify-between hover:border-[#FF5F1F]/40 transition-all duration-300 group"
              >
                <div className="space-y-6">
                  {/* Subtle Rating Stars */}
                  <div className="flex items-center gap-1 text-[#FF5F1F] text-xs">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>

                  {/* Large Editorial Quote */}
                  <blockquote className="text-base sm:text-lg text-[#1D1D1F] font-light leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                </div>

                {/* Minimal Author Details */}
                <div className="pt-6 mt-6 border-t border-[#E8E8E6] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1D1D1F]">{t.travelerName}</h4>
                    <p className="text-xs text-[#6E6E73] font-light mt-0.5">
                      {t.origin}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#6E6E73] block">Companion</span>
                    <span className="text-xs font-medium text-[#1D1D1F] group-hover:text-[#FF5F1F] transition-colors">
                      {t.buddyName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MINIMAL FINAL CTA — Apple Style Clean Full-Width Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          {language === 'HI' ? 'क्या आप बनारस घूमने को तैयार हैं?' : 'Ready to experience Banaras?'}
        </h2>
        <p className="text-base sm:text-lg text-[#6E6E73] font-light max-w-xl mx-auto leading-relaxed">
          {language === 'HI'
            ? 'आज ही अपने सत्यापित स्थानीय साथी को बुक करें और काशी की अविस्मरणीय यात्रा का आनंद लें।'
            : 'Reserve your verified local companion today and embark on a mindful, unforgettable exploration.'}
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            to="/book"
            className="px-8 py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_6px_20px_rgba(255,95,31,0.35)] active:scale-95"
          >
            {t.common.bookBuddy}
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-[#F5F5F3] hover:bg-[#E8E8E6] text-[#1D1D1F] text-sm font-medium transition-all duration-200 active:scale-95"
          >
            {language === 'HI' ? 'कोई प्रश्न है?' : 'Have Questions?'}
          </Link>
        </div>
      </section>
    </div>
  );
};
