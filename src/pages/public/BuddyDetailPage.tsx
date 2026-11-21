import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Star,
  Languages,
  Award,
  MapPin,
  Calendar,
  Check,
  ArrowRight,
  Clock,
  Users,
  Compass,
  MessageSquareQuote,
  Sparkles,
} from 'lucide-react';

export const BuddyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { buddies } = useApp();
  const navigate = useNavigate();

  const buddy = buddies.find((b) => b.id === id);

  if (!buddy) {
    return <Navigate to="/buddies" replace />;
  }

  const handleBookNow = () => {
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

    navigate(`/book?${queryParams.toString()}`);
  };

  return (
    <div className="layout-container py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
        <Link to="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/buddies" className="hover:text-[#1D1D1F] transition-colors">Buddies</Link>
        <span>/</span>
        <span className="text-[#1D1D1F] font-semibold">{buddy.name}</span>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E6] shadow-xs flex flex-col md:flex-row gap-8 items-start">
        <div className="relative shrink-0 mx-auto md:mx-0">
          <img
            src={buddy.avatar}
            alt={buddy.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-[#F5F5F3] shadow-md"
          />
          {buddy.status === 'Approved' && (
            <span
              className="absolute -bottom-2 -right-2 bg-[#FF5F1F] text-white p-2 rounded-full shadow-lg border-2 border-white"
              title="Verified Active Companion"
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-[#1D1D1F]">
                  {buddy.name}
                </h1>
                {buddy.status === 'Approved' && (
                  <span className="text-xs bg-[#FFF7ED] text-[#FF5F1F] font-bold px-2.5 py-0.5 rounded-full border border-[#FF5F1F]/30">
                    Verified Companion
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-[#FF5F1F] mt-1">{buddy.title}</p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-2 bg-[#FFF7ED] px-3.5 py-1.5 rounded-2xl border border-[#FF5F1F]/20 text-[#1D1D1F] text-sm font-bold">
              <Star className="w-4 h-4 fill-[#FF5F1F] text-[#FF5F1F]" />
              <span>{buddy.ratingDemo}</span>
              <span className="text-[#6E6E73] font-normal text-xs">({buddy.totalTripsDemo} trips)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#6E6E73]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF5F1F]" />
              <span>Native of: <strong className="text-[#1D1D1F] font-semibold">{buddy.nativeOf}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF5F1F]" />
              <span>Experience: <strong className="text-[#1D1D1F] font-semibold">{buddy.experienceYears}+ years</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#FF5F1F]" />
              <span>Languages: <strong className="text-[#1D1D1F] font-semibold">{buddy.languages.join(', ')}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF5F1F]" />
              <span>Max Group: <strong className="text-[#1D1D1F] font-semibold">{buddy.maxGroupSize} travelers</strong></span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
            {buddy.bio}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
            {buddy.verifiedBadges.map((badge, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F3] text-[#1D1D1F] border border-[#E8E8E6] flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#FF5F1F]" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Pricing, Services, Places & Booking CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Details & Services */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Transparent Configured Pricing Cards */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F]">Configured Honorarium</span>
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                  Companion Rates & Durations
                </h3>
              </div>
              <span className="text-xs text-[#6E6E73] bg-[#F5F5F3] px-3 py-1 rounded-full">Zero Commissions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-1 text-center">
                <span className="text-[11px] text-[#6E6E73] block uppercase tracking-wider">Hourly</span>
                <div className="text-lg font-bold text-[#1D1D1F]">₹{buddy.hourlyRate}</div>
                <span className="text-[10px] text-[#6E6E73] block">/ hour</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FF5F1F]/30 space-y-1 text-center shadow-xs">
                <span className="text-[11px] text-[#FF5F1F] font-semibold block uppercase tracking-wider">Half Day</span>
                <div className="text-lg font-bold text-[#1D1D1F]">₹{buddy.halfDayRate}</div>
                <span className="text-[10px] text-[#6E6E73] block">4 hrs duration</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-1 text-center">
                <span className="text-[11px] text-[#6E6E73] block uppercase tracking-wider">Full Day</span>
                <div className="text-lg font-bold text-[#1D1D1F]">₹{buddy.fullDayRate}</div>
                <span className="text-[10px] text-[#6E6E73] block">8 hrs duration</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-1 text-center">
                <span className="text-[11px] text-[#6E6E73] block uppercase tracking-wider">Multi-Day</span>
                <div className="text-lg font-bold text-[#1D1D1F]">₹{buddy.multiDayDailyRate}</div>
                <span className="text-[10px] text-[#6E6E73] block">per day rate</span>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          {buddy.servicesOffered && (
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Services & Experiences Offered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {buddy.servicesOffered.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center gap-3 text-xs font-semibold text-[#1D1D1F]"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#FFF7ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Places & Neighborhoods Covered */}
          {buddy.placesCovered && (
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Places & Neighborhoods Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {buddy.placesCovered.map((place, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-[#FAFAF8] text-[#1D1D1F] text-xs font-medium border border-[#E8E8E6] hover:border-[#FF5F1F]/40 transition-colors"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Time Slots */}
          {buddy.availableTimeSlots && (
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Typical Available Time Slots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {buddy.availableTimeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center gap-2.5 text-xs text-[#1D1D1F] font-medium"
                  >
                    <Clock className="w-4 h-4 text-[#FF5F1F]" />
                    <span>{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          {buddy.reviews && buddy.reviews.length > 0 && (
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Verified Traveler Reviews
              </h3>
              <div className="space-y-4">
                {buddy.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#1D1D1F]">{rev.travelerName}</span>
                        <span className="text-[11px] text-[#6E6E73] ml-2 font-light">({rev.origin})</span>
                      </div>
                      <div className="flex items-center text-xs text-[#FF5F1F]">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-[#6E6E73] font-light leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-[#86868B] block pt-1">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1 col): Sticky Booking Widget */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white p-7 sm:p-8 rounded-3xl border border-[#E8E8E6] shadow-sm space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5F1F] block">
                Reserve Companion
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                Book {buddy.name}
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FF5F1F]/20 text-[#1D1D1F] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#FF5F1F]">
                  <Calendar className="w-4 h-4" />
                  <span>Availability Status:</span>
                </div>
                <p className="text-[11px] text-[#6E6E73] font-light leading-relaxed pl-5">
                  {buddy.availabilityNote}
                </p>
              </div>

              <div className="space-y-2 py-3 border-y border-[#E8E8E6]">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Base Half-Day Rate:</span>
                  <span className="font-bold text-[#1D1D1F]">₹{buddy.halfDayRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Hourly Companion Fee:</span>
                  <span className="font-bold text-[#1D1D1F]">₹{buddy.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Max Recommended Group:</span>
                  <span className="font-bold text-[#1D1D1F]">{buddy.maxGroupSize} Guests</span>
                </div>
              </div>

              <p className="text-[#6E6E73] leading-relaxed text-[11px] font-light">
                Submitting a booking request automatically reserves your slot with {buddy.name}. Our Varanasi desk validates details before confirmation.
              </p>
            </div>

            <button
              onClick={handleBookNow}
              type="button"
              className="w-full py-3.5 rounded-full bg-[#FF5F1F] hover:bg-[#EC5800] text-white text-sm font-semibold transition-all duration-300 shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_4px_16px_rgba(255,95,31,0.35)] flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Book This Buddy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
