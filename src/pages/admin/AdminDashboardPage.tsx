import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { requests, buddies, enquiries } = useApp();

  const confirmedCount = requests.filter((r) => r.status.includes('Confirmed')).length;
  const underReviewCount = requests.filter((r) => r.status.includes('Review') || r.status.includes('Proposed')).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
            Operations Management Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-river">
            Varanasi Platform Overview
          </h1>
          <p className="text-xs text-charcoal-light mt-0.5">
            Real-time traveler inquiries, active companion assignments, and city-level metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/matcher"
            className="px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light shadow transition"
          >
            Launch Buddy Matcher
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-river text-ivory text-xs font-semibold hover:bg-river-light transition"
          >
            All Bookings ({requests.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Total Requests</span>
          <p className="font-serif text-3xl font-bold text-river">{requests.length}</p>
          <span className="text-[10px] text-saffron font-semibold block">+24% vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Under Review</span>
          <p className="font-serif text-3xl font-bold text-saffron">{underReviewCount}</p>
          <span className="text-[10px] text-saffron font-semibold block">Awaiting match</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Confirmed Trips</span>
          <p className="font-serif text-3xl font-bold text-river">{confirmedCount}</p>
          <span className="text-[10px] text-saffron font-semibold block">Companion accepted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Approved Buddies</span>
          <p className="font-serif text-3xl font-bold text-river">{buddies.length}</p>
          <span className="text-[10px] text-river font-semibold block">Active in Kashi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase">Open Enquiries</span>
          <p className="font-serif text-3xl font-bold text-river">{enquiries.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold block">Support desk</span>
        </div>
      </div>

      {/* Grid: Latest Requests & Recent Operations Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Inquiries Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-border pb-3">
            <h3 className="font-serif text-lg font-bold text-river">
              Recent Traveler Inquiries
            </h3>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-saffron hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="table-responsive-container">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-sand-border text-charcoal-muted uppercase font-bold text-[10px]">
                  <th className="py-2.5">Ref ID</th>
                  <th className="py-2.5">Traveler</th>
                  <th className="py-2.5">Duration</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/60">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-sand/20">
                    <td className="py-3 font-mono font-bold text-river">{r.bookingRef}</td>
                    <td className="py-3 font-semibold text-charcoal">
                      {r.travelerName}
                      <span className="text-[10px] text-charcoal-muted block font-normal">{r.travelerPhone}</span>
                    </td>
                    <td className="py-3 text-charcoal-muted">{r.durationText}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/bookings`}
                        className="text-xs font-bold text-river hover:text-saffron"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-river border-b border-sand-border pb-3">
            Varanasi Destination Pulse
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-ivory border border-sand-border flex items-center justify-between">
              <div>
                <span className="font-bold text-river block">Subah-e-Banaras Ghats</span>
                <span className="text-[10px] text-charcoal-muted">Highest morning demand</span>
              </div>
              <span className="font-bold text-saffron">64% Inquiries</span>
            </div>

            <div className="p-3 rounded-xl bg-ivory border border-sand-border flex items-center justify-between">
              <div>
                <span className="font-bold text-river block">Kashi Vishwanath Corridor</span>
                <span className="text-[10px] text-charcoal-muted">Senior citizen assistance</span>
              </div>
              <span className="font-bold text-saffron">52% Inquiries</span>
            </div>

            <div className="p-3 rounded-xl bg-ivory border border-sand-border flex items-center justify-between">
              <div>
                <span className="font-bold text-river block">Silk Weaver Ateliers</span>
                <span className="text-[10px] text-charcoal-muted">Madanpura & Chowk</span>
              </div>
              <span className="font-bold text-saffron">38% Inquiries</span>
            </div>
          </div>

          <div className="pt-2 border-t border-sand-border">
            <div className="p-3 rounded-xl bg-amber-50/70 text-[11px] text-amber-900 border border-amber-200 space-y-1">
              <span className="font-bold block">Demonstration Notice:</span>
              <p>Platform metrics reflect simulation data curated for Varanasi operations testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
