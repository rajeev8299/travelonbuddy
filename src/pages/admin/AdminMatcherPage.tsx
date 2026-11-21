import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, Star, ShieldCheck, Languages } from 'lucide-react';
import { TravelBuddy } from '../../types';

export const AdminMatcherPage: React.FC = () => {
  const { buddies, requests, updateRequestStatus, showToast } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedInterest, setSelectedInterest] = useState('Temples');
  const [selectedDuration, setSelectedDuration] = useState('HALF_DAY');
  const [genderPref, setGenderPref] = useState('Any');

  // Match Scoring Algorithm Demo
  const scoredBuddies = buddies.map((b) => {
    let score = 70;
    if (b.languages.includes(selectedLanguage)) score += 15;
    if (b.expertise.some((exp) => exp.toLowerCase().includes(selectedInterest.toLowerCase()))) score += 12;
    if (genderPref !== 'Any' && b.gender === genderPref) score += 10;
    return { buddy: b, matchScore: Math.min(score, 99) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleQuickAssign = (buddy: TravelBuddy) => {
    showToast(`Recommendation assigned! Automated invite dispatched to ${buddy.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-saffron text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Algorithmic Companion Matching Prototype</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
          Varanasi Buddy Matcher Simulator
        </h1>
        <p className="text-xs text-charcoal-light max-w-xl">
          Test recommendation heuristics matching traveler preferences, linguistic compatibility, and ghat expertise against approved Varanasi companions.
        </p>
      </div>

      {/* Criteria Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-sand-border shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-river">
          Simulation Parameters:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Language Requirement</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none bg-ivory font-semibold cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Primary Exploration Theme</label>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none bg-ivory font-semibold cursor-pointer"
            >
              <option value="Temples">Temple Architecture & Shrines</option>
              <option value="Ghats">Ghat Lore & Morning Boat</option>
              <option value="Food">Authentic Food & Kachori Trail</option>
              <option value="Photography">Street Photography & Alleys</option>
              <option value="Sarees">Silk Weavers & Handlooms</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Duration Category</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none bg-ivory font-semibold cursor-pointer"
            >
              <option value="HOURLY">Hourly (2-3 hrs)</option>
              <option value="HALF_DAY">Half Day (4 hrs)</option>
              <option value="FULL_DAY">Full Day (8 hrs)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Gender Preference</label>
            <select
              value={genderPref}
              onChange={(e) => setGenderPref(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none bg-ivory font-semibold cursor-pointer"
            >
              <option value="Any">No specific preference</option>
              <option value="Female">Female Companion Required</option>
              <option value="Male">Male Companion</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scored Results */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-river">
          Ranked Candidate Matches ({scoredBuddies.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoredBuddies.map(({ buddy, matchScore }) => (
            <div
              key={buddy.id}
              className="bg-white p-6 rounded-2xl border border-sand-border shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={buddy.avatar}
                      alt={buddy.name}
                      className="w-12 h-12 rounded-xl object-cover border border-sand"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-river">{buddy.name}</h4>
                      <span className="text-[11px] text-saffron block">{buddy.title}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-saffron bg-saffron-muted px-2.5 py-1 rounded-xl border border-saffron/30">
                      {matchScore}% Match
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-ivory">
                    <span className="text-[10px] text-charcoal-muted block">Languages</span>
                    <span className="font-semibold text-river truncate block">{buddy.languages.join(', ')}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-ivory">
                    <span className="text-[10px] text-charcoal-muted block">Experience</span>
                    <span className="font-semibold text-river block">{buddy.experienceYears}+ years ({buddy.ratingDemo}★)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {buddy.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-sand/60 px-2 py-0.5 rounded text-charcoal font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-sand-border flex items-center justify-between">
                <span className="text-[11px] text-charcoal-muted">
                  Availability: {buddy.availabilityNote}
                </span>
                <button
                  onClick={() => handleQuickAssign(buddy)}
                  className="px-4 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light transition shadow-xs"
                >
                  Propose Match
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
