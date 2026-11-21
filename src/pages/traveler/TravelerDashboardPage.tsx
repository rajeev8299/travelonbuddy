import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
} from 'lucide-react';

export const TravelerDashboardPage: React.FC = () => {
  const { requests } = useApp();

  const activeRequests = requests.filter((r) => r.status !== 'Trip Completed' && r.status !== 'Cancelled');
  const latestRequest = requests[0];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-saffron uppercase tracking-widest">
            Namaste Shalini
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            Your Kashi Travel Portal
          </h1>
          <p className="text-xs text-charcoal-light max-w-xl">
            Track your companion requests, view verified buddy assignments, and access your Varanasi trip coordinates.
          </p>
        </div>

        <Link
          to="/book"
          className="px-5 py-2.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light transition flex items-center gap-2 self-start md:self-auto shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Buddy Request</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Active Requests</span>
          <p className="font-serif text-3xl font-bold text-river">{activeRequests.length}</p>
          <span className="text-[10px] text-saffron font-semibold block">Under coordination</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Assigned Companions</span>
          <p className="font-serif text-3xl font-bold text-river">
            {requests.filter((r) => r.assignedBuddyId).length}
          </p>
          <span className="text-[10px] text-river font-semibold block">Verified Local Buddies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Varanasi Completed</span>
          <p className="font-serif text-3xl font-bold text-river">1</p>
          <span className="text-[10px] text-charcoal-muted block">Previous Pilgrimage Walk</span>
        </div>
      </div>

      {/* Primary Active Request Card */}
      {latestRequest && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-border pb-4">
            <div>
              <span className="text-[10px] font-mono text-saffron font-bold block">
                REF: {latestRequest.bookingRef}
              </span>
              <h2 className="font-serif text-xl font-bold text-river">
                {latestRequest.destination} — {latestRequest.durationText}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto">
              {latestRequest.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-charcoal-muted block">Travel Dates</span>
              <span className="font-bold text-river">{latestRequest.startDate}</span>
            </div>
            <div>
              <span className="text-charcoal-muted block">Group Size</span>
              <span className="font-bold text-river">{latestRequest.travelerCount} Travelers</span>
            </div>
            <div>
              <span className="text-charcoal-muted block">Pickup Spot</span>
              <span className="font-bold text-river truncate block">{latestRequest.pickupLocation}</span>
            </div>
            <div>
              <span className="text-charcoal-muted block">Assigned Buddy</span>
              <span className="font-bold text-saffron">
                {latestRequest.assignedBuddyName || 'Matching in progress...'}
              </span>
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-river uppercase tracking-wider mb-4">
              Booking Progress Timeline
            </h4>
            <div className="space-y-4">
              {latestRequest.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {step.status === 'completed' ? (
                      <span className="w-5 h-5 rounded-full bg-saffron text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    ) : step.status === 'current' ? (
                      <span className="w-5 h-5 rounded-full bg-saffron text-white flex items-center justify-center text-[10px] animate-pulse">
                        •
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-sand text-charcoal-muted flex items-center justify-center text-[10px]">
                        ○
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-river">{step.title}</span>
                      <span className="text-[10px] text-charcoal-muted">{step.time}</span>
                    </div>
                    <p className="text-charcoal-light mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-sand-border flex justify-end">
            <Link
              to={`/traveler/requests/${latestRequest.id}`}
              className="text-xs font-bold text-river hover:text-saffron flex items-center gap-1.5"
            >
              <span>View Full Trip Coordinates & Buddy Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-sand/40 p-6 rounded-2xl border border-sand-border space-y-2">
          <h4 className="font-serif font-bold text-sm text-river">Need Itinerary Guidance?</h4>
          <p className="text-xs text-charcoal-muted">
            Ask your assigned buddy to coordinate early morning boat rides or specialized wheelchair assistance.
          </p>
          <Link
            to="/traveler/support"
            className="text-xs font-bold text-saffron hover:underline inline-block pt-1"
          >
            Open Support Request &rarr;
          </Link>
        </div>

        <div className="bg-sand/40 p-6 rounded-2xl border border-sand-border space-y-2">
          <h4 className="font-serif font-bold text-sm text-river">Explore More of Kashi</h4>
          <p className="text-xs text-charcoal-muted">
            Check out Sarnath Deer Park, Ramnagar Fort, or book an authentic morning food walk.
          </p>
          <Link
            to="/destinations"
            className="text-xs font-bold text-saffron hover:underline inline-block pt-1"
          >
            Browse Kashi Directory &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
