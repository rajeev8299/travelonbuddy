import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  XCircle,
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { TravelRequest } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const { requests, buddies, updateRequestStatus, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReq, setSelectedReq] = useState<TravelRequest | null>(null);
  const [assigneeId, setAssigneeId] = useState('');

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      r.travelerName.toLowerCase().includes(search.toLowerCase()) ||
      r.pickupLocation.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !assigneeId) return;
    const buddy = buddies.find((b) => b.id === assigneeId);
    if (!buddy) return;

    updateRequestStatus(selectedReq.id, 'Buddy Assignment Proposed', buddy.id, buddy.name);
    setSelectedReq(null);
  };

  const exportCSV = () => {
    showToast('Exporting Varanasi booking ledger as CSV (Demo)...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            Booking & Request Management
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Review incoming requests, assign verified Varanasi companions, and manage statuses.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-white border border-sand-border text-xs font-semibold text-charcoal hover:bg-sand transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-saffron" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search traveler, ref, pickup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory border border-sand-border text-xs focus:outline-none focus:border-saffron"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            'All',
            'Request Submitted',
            'Under Review',
            'Buddy Assignment Proposed',
            'Buddy Accepted',
            'Booking Confirmed',
            'Cancelled',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-saffron text-white shadow-2xs'
                  : 'bg-sand/60 text-charcoal-light hover:bg-light-orange/40 hover:text-saffron'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden">
        <div className="table-responsive-container">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Ref Code</th>
                <th className="p-4">Traveler Info</th>
                <th className="p-4">Dates & Duration</th>
                <th className="p-4">Assigned Buddy</th>
                <th className="p-4">Booking Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-sand/20">
                  <td className="p-4 font-mono font-bold text-river">{r.bookingRef}</td>
                  <td className="p-4 font-semibold text-charcoal">
                    {r.travelerName} ({r.travelerCount} pax)
                    <span className="text-[10px] text-charcoal-muted block font-normal">
                      {r.travelerEmail}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-river block">{r.startDate}</span>
                    <span className="text-[10px] text-charcoal-muted">{r.durationText}</span>
                  </td>
                  <td className="p-4">
                    {r.assignedBuddyName ? (
                      <span className="font-bold text-river flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-saffron" />
                        <span>{r.assignedBuddyName}</span>
                      </span>
                    ) : (
                      <span className="text-saffron-light bg-saffron-muted px-2 py-0.5 rounded-full text-[10px] font-medium border border-saffron/30">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sand text-river">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.paymentStatus === 'Successful'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReq(r)}
                        className="px-3 py-1.5 rounded-lg bg-saffron text-white text-xs font-bold hover:bg-deep-orange transition shadow-2xs"
                      >
                        Assign / Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Buddy Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sand-border shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-border pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-saffron block">
                  {selectedReq.bookingRef}
                </span>
                <h3 className="font-serif text-lg font-bold text-river">
                  Assign Travel Buddy
                </h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg hover:bg-sand text-charcoal-muted"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory text-xs text-charcoal-light space-y-1">
              <div><strong>Traveler:</strong> {selectedReq.travelerName} ({selectedReq.travelerCount} travelers)</div>
              <div><strong>Dates:</strong> {selectedReq.startDate} • {selectedReq.durationText}</div>
              <div><strong>Language Needed:</strong> {selectedReq.preferredLanguage}</div>
              <div><strong>Pickup:</strong> {selectedReq.pickupLocation}</div>
              {selectedReq.specialRequests && <div><strong>Requests:</strong> {selectedReq.specialRequests}</div>}
            </div>

            <form onSubmit={handleAssign} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-river block">
                  Select Approved Varanasi Companion:
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sand-border focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">-- Choose Approved Buddy --</option>
                  {buddies.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.title} ({b.languages.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-sand-border space-y-2">
                <span className="font-bold text-river block text-[11px] uppercase tracking-wider">
                  Admin Direct Actions:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateRequestStatus(selectedReq.id, 'Booking Confirmed', selectedReq.assignedBuddyId, selectedReq.assignedBuddyName);
                      setSelectedReq(null);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateRequestStatus(selectedReq.id, 'Cancelled');
                      setSelectedReq(null);
                    }}
                    className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Cancel</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!assigneeId}
                  className="px-5 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light disabled:opacity-50"
                >
                  Assign / Reassign Buddy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
