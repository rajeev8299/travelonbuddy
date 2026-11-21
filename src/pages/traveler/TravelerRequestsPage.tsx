import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, ArrowRight, Eye, XCircle } from 'lucide-react';

export const TravelerRequestsPage: React.FC = () => {
  const { requests, updateRequestStatus } = useApp();
  const [filter, setFilter] = useState<string>('All');

  const filtered = requests.filter((r) => {
    if (filter === 'Active') return r.status !== 'Trip Completed' && r.status !== 'Cancelled';
    if (filter === 'Completed') return r.status === 'Trip Completed';
    if (filter === 'Cancelled') return r.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            My Travel Requests
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Review status updates, assigned companions, and request history.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-sand-border text-xs font-semibold">
          {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === tab ? 'bg-saffron text-white shadow-2xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-6 border border-sand-border shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-border pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-saffron bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {req.bookingRef}
                </span>
                <span className="font-serif text-lg font-bold text-river">
                  {req.destination}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
                  req.status.includes('Confirmed')
                    ? 'bg-saffron text-white border-saffron'
                    : req.status.includes('Cancelled')
                    ? 'bg-sand text-charcoal-muted border-sand-border'
                    : 'bg-saffron-muted text-saffron-light border-saffron/30'
                }`}
              >
                {req.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-charcoal-muted block">Duration</span>
                <span className="font-bold text-river">{req.durationText}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Dates</span>
                <span className="font-bold text-river">{req.startDate}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Assigned Companion</span>
                <span className="font-bold text-saffron">
                  {req.assignedBuddyName || 'Matching in progress...'}
                </span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Honorarium Estimate</span>
                <span className="font-bold text-river">{req.estimatedPriceDisplay}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-sand-border">
              <span className="text-charcoal-muted text-[11px]">
                Pickup: <strong>{req.pickupLocation}</strong>
              </span>

              <div className="flex items-center gap-2">
                {req.status !== 'Cancelled' && (
                  <button
                    onClick={() => updateRequestStatus(req.id, 'Cancelled')}
                    className="px-3 py-1.5 rounded-lg border border-sand-border text-charcoal-muted hover:bg-sand text-xs font-semibold transition"
                  >
                    Cancel Request
                  </button>
                )}
                <Link
                  to={`/traveler/requests/${req.id}`}
                  className="px-4 py-1.5 rounded-lg bg-saffron text-white text-xs font-bold hover:bg-deep-orange transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Timeline & Details</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
