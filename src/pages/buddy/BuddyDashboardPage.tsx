import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';

export const BuddyDashboardPage: React.FC = () => {
  const { requests, updateRequestStatus, currentUser } = useApp();

  // Buddy's assigned or matched requests
  const myId = currentUser?.id || 'buddy-anand-shukla';
  const myName = currentUser?.name || 'Anand Shukla';

  // Pending assignments where Buddy can Accept or Decline
  const pendingAssignments = requests.filter(
    (r) =>
      (r.assignedBuddyId === myId || !r.assignedBuddyId) &&
      (r.status === 'Buddy Assignment Proposed' || r.status === 'Under Review' || r.status === 'Request Submitted')
  );

  const upcomingConfirmed = requests.filter(
    (r) =>
      (r.assignedBuddyId === myId || !r.assignedBuddyId) &&
      (r.status === 'Buddy Accepted' || r.status === 'Booking Confirmed')
  );

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-saffron uppercase tracking-widest">
            Welcome Anand Shukla
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            Varanasi Companion Console
          </h1>
          <p className="text-xs text-charcoal-light max-w-xl">
            Manage your incoming traveler requests, accept upcoming ghat walks, and update your weekly availability.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-amber-950 text-xs font-bold self-start md:self-auto">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>4.95 Rating</span>
          <span className="text-amber-800/60 font-normal">(142 Trips)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Pending Requests</span>
          <p className="font-serif text-3xl font-bold text-saffron">{pendingAssignments.length}</p>
          <span className="text-[10px] text-saffron font-semibold block">Action needed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Confirmed Trips</span>
          <p className="font-serif text-3xl font-bold text-river">{upcomingConfirmed.length}</p>
          <span className="text-[10px] text-saffron font-semibold block">Upcoming this week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Monthly Trips</span>
          <p className="font-serif text-3xl font-bold text-river">18</p>
          <span className="text-[10px] text-charcoal-muted block">November 2026</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Status</span>
          <p className="font-serif text-2xl font-bold text-saffron-light">Approved</p>
          <span className="text-[10px] text-saffron block">Verified Local Host</span>
        </div>
      </div>

      {/* Actionable Assignments Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-sand-border pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-river">
              Incoming Traveler Assignments
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Review traveler requirements and accept or decline based on your schedule.
            </p>
          </div>
          <span className="text-xs font-bold text-saffron bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {pendingAssignments.length} Pending Decision
          </span>
        </div>

        {pendingAssignments.length > 0 ? (
          <div className="space-y-4">
            {pendingAssignments.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-ivory/60 border border-sand-border space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-saffron bg-white px-2.5 py-1 rounded-lg border border-sand-border">
                      {req.bookingRef}
                    </span>
                    <span className="font-serif text-base font-bold text-river">
                      {req.travelerName} ({req.travelerCount} Travelers)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-charcoal-muted block">Dates</span>
                    <span className="font-bold text-river">{req.startDate}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted block">Duration</span>
                    <span className="font-bold text-river">{req.durationText}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted block">Language Needed</span>
                    <span className="font-bold text-river">{req.preferredLanguage}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted block">Estimated Honorarium</span>
                    <span className="font-bold text-river">{req.estimatedPriceDisplay}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-sand-border text-xs text-charcoal-light">
                  <strong>Traveler Notes:</strong> {req.specialRequests || 'Standard Varanasi walk requested.'}
                </div>

                {/* Accept / Decline CTA */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() =>
                      updateRequestStatus(req.id, 'Assignment Declined', undefined, undefined)
                    }
                    className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold text-charcoal-muted hover:bg-sand transition"
                  >
                    Decline Assignment
                  </button>
                  <button
                    onClick={() =>
                      updateRequestStatus(
                        req.id,
                        'Buddy Accepted',
                        myId,
                        myName
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light transition shadow flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Accept Assignment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-charcoal-muted">
            All caught up! No pending assignments waiting for your decision right now.
          </div>
        )}
      </div>

      {/* Upcoming Confirmed Trips */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-river">
          Confirmed Upcoming Accompaniments
        </h3>

        {upcomingConfirmed.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-xl border border-sand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-saffron font-bold">{req.bookingRef}</span>
                <span className="font-bold text-river">{req.travelerName}</span>
                <span className="text-charcoal-muted">({req.durationText})</span>
              </div>
              <p className="text-charcoal-muted mt-1">
                Pickup: {req.pickupLocation} • Date: {req.startDate}
              </p>
            </div>
            <span className="text-xs font-bold text-saffron bg-saffron-muted px-3 py-1 rounded-full border border-saffron/30 self-start sm:self-auto">
              Ready for Trip
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
