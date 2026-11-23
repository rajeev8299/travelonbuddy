import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Phone,
  Mail,
} from 'lucide-react';

export const TravelerRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, buddies, updateRequestStatus } = useApp();

  const req = requests.find((r) => r.id === id);

  if (!req) {
    return <Navigate to="/traveler/requests" replace />;
  }

  const assignedBuddy = buddies.find((b) => b.id === req.assignedBuddyId);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/traveler/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-river hover:text-saffron"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Requests</span>
        </Link>

        <span className="font-mono text-xs font-bold text-saffron bg-white px-3 py-1.5 rounded-lg border border-sand-border">
          {req.bookingRef}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              Varanasi Travel Companion Booking
            </span>
            <h1 className="font-serif text-2xl font-bold text-river">
              {req.destination} — {req.durationText}
            </h1>
          </div>
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto border ${
              req.status.includes('Confirmed')
                ? 'bg-saffron text-white border-saffron'
                : 'bg-saffron-muted text-saffron-light border-saffron/30'
            }`}
          >
            {req.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-charcoal-muted block">Travel Dates</span>
            <span className="font-bold text-river">{req.startDate}</span>
          </div>
          <div>
            <span className="text-charcoal-muted block">Duration Type</span>
            <span className="font-bold text-river">{req.category}</span>
          </div>
          <div>
            <span className="text-charcoal-muted block">Group Count</span>
            <span className="font-bold text-river">{req.travelerCount} Persons</span>
          </div>
          <div>
            <span className="text-charcoal-muted block">Estimated Honorarium</span>
            <span className="font-bold text-river">{req.estimatedPriceDisplay}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Assigned Buddy & Detailed Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Buddy Card */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-xs space-y-4 h-fit">
          <h3 className="font-serif text-base font-bold text-river border-b border-sand-border pb-3">
            Assigned Travel Buddy
          </h3>

          {assignedBuddy ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={assignedBuddy.avatar}
                  alt={assignedBuddy.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-sand"
                />
                <div>
                  <h4 className="font-serif font-bold text-river">{assignedBuddy.name}</h4>
                  <span className="text-xs text-saffron block font-medium">
                    {assignedBuddy.title}
                  </span>
                  <span className="text-[10px] text-charcoal-muted">
                    Native of: {assignedBuddy.nativeOf}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-ivory border border-sand-border text-xs space-y-1">
                <span className="font-bold text-river block">Languages:</span>
                <span className="text-charcoal-light">{assignedBuddy.languages.join(', ')}</span>
              </div>

              {req.status === 'Booking Confirmed' ? (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-river block">Verified Companion Direct Contact:</span>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-800">Phone:</span>
                      <a
                        href={`tel:${(assignedBuddy.contactNumber || '+91 98390 12044').replace(/[^0-9+]/g, '')}`}
                        className="font-bold text-[#FF5F1F] font-mono hover:underline"
                      >
                        {assignedBuddy.contactNumber || '+91 98390 12044'}
                      </a>
                    </div>
                    {assignedBuddy.allowWhatsAppContact && (
                      <a
                        href={`https://wa.me/${(assignedBuddy.contactNumber || '+91 98390 12044').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${assignedBuddy.name}! I am ${req.travelerName}, booking ref ${req.bookingRef} on TravelOnBuddy for ${req.startDate}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-center block text-[11px] transition shadow-2xs"
                      >
                        Chat with {assignedBuddy.name.split(' ')[0]} on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-sand/40 border border-sand-border text-xs text-charcoal-muted">
                  <span className="font-semibold block text-river text-[11px]">Direct Contact Notice:</span>
                  <span className="text-[11px] leading-relaxed">
                    Companion direct phone number is released automatically via email and this portal once your booking is officially <strong>Confirmed</strong>.
                  </span>
                </div>
              )}

              <Link
                to={`/buddies/${assignedBuddy.id}`}
                className="w-full py-2 rounded-xl border border-sand-border text-xs font-semibold text-center block hover:bg-sand transition"
              >
                View Full Companion Profile
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
              <span className="font-bold block">Review in Progress</span>
              <p className="text-[11px] leading-relaxed">
                Our Varanasi team is matching your preferred language and dates with an approved local buddy. You will be alerted once assignment is proposed.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-6">
          <h3 className="font-serif text-lg font-bold text-river">
            Detailed Request Timeline
          </h3>

          <div className="space-y-5">
            {req.timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-0.5">
                  {item.status === 'completed' ? (
                    <span className="w-6 h-6 rounded-full bg-saffron text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  ) : item.status === 'current' ? (
                    <span className="w-6 h-6 rounded-full bg-saffron text-white flex items-center justify-center text-xs animate-pulse">
                      •
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-sand text-charcoal-muted flex items-center justify-center text-xs">
                      ○
                    </span>
                  )}
                </div>

                <div className="flex-1 pb-4 border-b border-sand-border/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-river">{item.title}</span>
                    <span className="text-[11px] text-charcoal-muted font-medium">{item.time}</span>
                  </div>
                  <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Traveler Preferences Recap */}
          <div className="pt-4 border-t border-sand-border space-y-3">
            <h4 className="text-xs font-bold text-river uppercase tracking-wider">
              Enquiry Notes & Special Requests
            </h4>
            <div className="p-4 rounded-xl bg-ivory text-xs text-charcoal-light border border-sand-border space-y-2">
              <div>
                <strong>Interests:</strong> {req.interests.join(', ')}
              </div>
              <div>
                <strong>Atmosphere:</strong> {req.crowdPreference}
              </div>
              <div>
                <strong>Pickup Location:</strong> {req.pickupLocation}
              </div>
              {req.specialRequests && (
                <div>
                  <strong>Special Requests:</strong> {req.specialRequests}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
