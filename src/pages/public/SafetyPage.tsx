import React from 'react';
import { ShieldCheck, UserCheck, PhoneCall, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SafetyPage: React.FC = () => {
  return (
    <div className="layout-container py-12 sm:py-16 space-y-12">
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF5F1F] block">
          Varanasi Security & Standard of Care
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          Safety & Trust Architecture.
        </h1>
        <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
          Your peace of mind in Varanasi is our non-negotiable priority. Discover the verification layers and conduct standards that protect every TravelOnBuddy journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-8 rounded-3xl bg-white border border-[#E8E8E6] space-y-4 hover:border-[#D2D2D7] transition-all duration-300 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#FF5F1F]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            In-Person Background Checks
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
            Every candidate companion is personally interviewed by our local operations directors in Varanasi. We inspect government identification (Aadhaar/Passport), residence credentials, and university records.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E8E8E6] space-y-4 hover:border-[#D2D2D7] transition-all duration-300 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#FF5F1F]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            Solo Women Traveler Support
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
            We provide verified female travel companions upon request. Our female buddies are trained in navigation safety, street photography protocols, and ensuring comfortable spaces throughout the old city lanes.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E8E8E6] space-y-4 hover:border-[#D2D2D7] transition-all duration-300 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#FF5F1F]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            No Forced Shopping / Anti-Tout Policy
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
            Commercial touts regularly steer tourists toward overpriced synthetic silk and gem scams. Our buddies sign binding zero-kickback ethical codes, guiding travelers only to verified handloom cooperatives.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E8E8E6] space-y-4 hover:border-[#D2D2D7] transition-all duration-300 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E6] flex items-center justify-center">
            <PhoneCall className="w-6 h-6 text-[#FF5F1F]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            24/7 On-Ground Emergency Desk
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
            Our local Varanasi control desk maintains real-time coordination with on-ground companions. In case of unexpected illness or elder fatigue, alternate transportation is mobilized instantly.
          </p>
        </div>
      </div>

      {/* Safety Guidelines for Travelers */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E8E6] space-y-5">
        <h3 className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-[#1D1D1F]">
          Helpful Tips For Navigating Varanasi Respectfully
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-[#6E6E73] font-light leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5F1F] shrink-0 mt-2" />
            <span><strong className="text-[#1D1D1F] font-semibold">Cremation Ghats:</strong> Manikarnika and Harishchandra Ghats are sacred cremation sites. Photography of funeral pyres is strictly prohibited out of reverence for the deceased.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5F1F] shrink-0 mt-2" />
            <span><strong className="text-[#1D1D1F] font-semibold">Footwear:</strong> Slip-on footwear is recommended as shoes must be removed before entering temples, shrines, and private weaver ateliers.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5F1F] shrink-0 mt-2" />
            <span><strong className="text-[#1D1D1F] font-semibold">Drinking Water:</strong> We advise drinking bottled water and eating freshly prepared piping hot street delicacies recommended by your buddy.</span>
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/book"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition-all duration-200 shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_4px_16px_rgba(255,95,31,0.35)] active:scale-95"
        >
          <span>Book With Complete Peace of Mind</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
