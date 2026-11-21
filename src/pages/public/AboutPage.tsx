import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, CheckCircle2, Shield, HeartHandshake, ArrowRight } from 'lucide-react';
import { IMAGES } from '../../assets/images';

export const AboutPage: React.FC = () => {
  return (
    <div className="layout-container py-12 space-y-16">
      {/* Intro */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron">
          Our Story & Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-river leading-tight">
          Redefining How The World Experiences Varanasi
        </h1>
        <p className="text-base text-charcoal-light leading-relaxed">
          TravelOnBuddy was born out of a simple observation: tourists in Varanasi often leave with pictures of ghats, but without understanding the profound poetry, philosophy, and everyday warmth of Kashi.
        </p>
      </div>

      {/* Grid: Imagery and Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src={IMAGES.subahEBanaras}
            alt="Varanasi heritage lifestyle and culture"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            A Companion, Not Just A Commercial Guide
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
            Conventional tours bundle visitors into large herds, rush them through scripted lectures, and shepherd them into commission-paying gift shops. We created a fundamentally different human model: pairing travelers with educated, cultured local residents who walk with you as a trusted local friend.
          </p>

          <div className="space-y-3 pt-2 text-xs text-charcoal-light">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
              <span><strong>Respectful Cultural Immersion:</strong> Learn the sacred meaning of Ganga Aarti and cremation ghat rituals respectfully without sensationalism.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
              <span><strong>Zero Commission Kickbacks:</strong> Our buddies are paid fair honorariums and are strictly barred from demanding shop kickbacks.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
              <span><strong>Empowering Local Youth & Scholars:</strong> Providing dignified cultural ambassadorship opportunities for university graduates and history scholars.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="bg-sand/40 p-8 sm:p-12 rounded-3xl border border-sand-border space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif text-2xl font-bold text-river">Our Core Principles</h3>
          <p className="text-xs text-charcoal-muted">
            Guided by reverence for the eternal city of Lord Shiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-3">
            <Shield className="w-6 h-6 text-saffron" />
            <h4 className="font-serif text-base font-bold text-river">Absolute Trust & Safety</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              In-depth background vetting, police documentation, and verified identities for all companion hosts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-3">
            <Compass className="w-6 h-6 text-saffron" />
            <h4 className="font-serif text-base font-bold text-river">Authenticity First</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Taking you to centuries-old sweet makers, hidden shrines, and living weaver households untouched by modern tourist gimmicks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-3">
            <HeartHandshake className="w-6 h-6 text-saffron" />
            <h4 className="font-serif text-base font-bold text-river">Human Connection</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Warmth, unhurried conversations, and memories of real friendship along the eternal sacred river.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/book"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light shadow transition"
        >
          <span>Find Your Travel Companion</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
