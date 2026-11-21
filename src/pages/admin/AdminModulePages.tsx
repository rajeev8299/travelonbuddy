import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  FileText,
  MapPin,
  Layers,
  Star,
  Mail,
  HelpCircle,
  Bell,
  Sliders,
  BarChart3,
  Shield,
  FolderGit2,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  XCircle,
  Eye,
  CheckCircle2,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { TravelPackage, Destination } from '../../types';

export const AdminModulePages: React.FC<{
  type:
    | 'buddies'
    | 'applications'
    | 'travelers'
    | 'cities'
    | 'destinations'
    | 'packages'
    | 'services'
    | 'reviews'
    | 'enquiries'
    | 'support'
    | 'notifications'
    | 'email-templates'
    | 'cms'
    | 'reports'
    | 'roles'
    | 'audit'
    | 'settings';
}> = ({ type }) => {
  const {
    buddies,
    updateBuddyStatus,
    destinations,
    experiences,
    enquiries,
    updateEnquiryStatus,
    packages,
    addPackage,
    deletePackage,
    supportTickets,
    updateTicketStatus,
    reviews,
    showToast,
    language,
  } = useApp();

  // Package Form state
  const [pkgTitleEn, setPkgTitleEn] = useState('');
  const [pkgTitleHi, setPkgTitleHi] = useState('');
  const [pkgCity, setPkgCity] = useState<'Varanasi' | 'Jaipur'>('Varanasi');
  const [pkgCategory, setPkgCategory] = useState<'Spiritual' | 'Heritage' | 'Food' | 'Full Day' | 'Custom'>('Spiritual');
  const [pkgDuration, setPkgDuration] = useState('Full Day (8 Hours)');
  const [pkgPrice, setPkgPrice] = useState(2500);
  const [pkgDesc, setPkgDesc] = useState('');
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);

  // Application Decision State
  const [applicantStatus, setApplicantStatus] = useState<'Pending Interview' | 'Approved' | 'Changes Requested'>('Pending Interview');

  const handleAction = (msg: string) => {
    showToast(msg);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitleEn.trim()) {
      showToast('Please provide package title');
      return;
    }
    addPackage({
      titleEn: pkgTitleEn,
      titleHi: pkgTitleHi || pkgTitleEn,
      city: pkgCity,
      category: pkgCategory,
      duration: pkgDuration,
      descriptionEn: pkgDesc || 'Curated premium package tour.',
      descriptionHi: pkgDesc || 'विशिष्ट एवं सांस्कृतिक यात्रा पैकेज।',
      price: Number(pkgPrice),
      maxPartySize: 6,
      includedEn: ['Private verified companion', 'Entry tickets coordination', 'Itinerary guidance'],
      includedHi: ['सत्यापित साथी सेवा', 'प्रवेश टिकट समन्वय', 'विस्तृत मार्गदर्शन'],
      coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      status: 'Published',
    });
    setIsPkgModalOpen(false);
    setPkgTitleEn('');
    setPkgDesc('');
  };

  /* 1. BUDDY MANAGEMENT */
  if (type === 'buddies') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-river">Buddy Management ({buddies.length})</h1>
            <p className="text-xs text-charcoal-muted">All active, suspended, and approved companions in Varanasi & Jaipur.</p>
          </div>
          <button
            onClick={() => handleAction('Opening Add Buddy registration invite modal')}
            className="px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Buddy</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden table-responsive-container">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Companion</th>
                <th className="p-4">Languages</th>
                <th className="p-4">Native / City</th>
                <th className="p-4">Rating & Trips</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              {buddies.map((b) => (
                <tr key={b.id} className="hover:bg-sand/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={b.avatar} alt={b.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-river block">{b.name}</span>
                        <span className="text-[10px] text-charcoal-muted">{b.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-charcoal-light">{b.languages.join(', ')}</td>
                  <td className="p-4 text-charcoal-muted">{b.nativeOf}</td>
                  <td className="p-4 font-bold text-river">
                    {b.ratingDemo}★ <span className="font-normal text-charcoal-muted">({b.totalTripsDemo})</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron-muted text-saffron-light border border-saffron/30">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => updateBuddyStatus(b.id, b.status === 'Approved' ? 'Suspended' : 'Approved')}
                      className={`text-xs font-semibold mr-2 ${
                        b.status === 'Approved' ? 'text-amber-800 hover:text-red-600' : 'text-emerald-700 hover:text-emerald-900'
                      }`}
                    >
                      {b.status === 'Approved' ? 'Suspend' : 'Reactivate'}
                    </button>
                    <button
                      onClick={() => handleAction(`Viewing ${b.name}'s verified documentation ledger`)}
                      className="text-xs font-semibold text-river hover:text-saffron"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* 2. BUDDY APPLICATIONS */
  if (type === 'applications') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">Buddy Applications & Vetting Workflow</h1>
          <p className="text-xs text-charcoal-muted">Review credentials, university records, and schedule in-person orientation.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sand-border space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-border pb-3">
              <div>
                <span className="text-[10px] font-mono text-saffron uppercase font-bold">APP-2026-901 • Varanasi Node</span>
                <h3 className="font-serif text-lg font-bold text-river mt-0.5">Manavendra Nath Pandey</h3>
                <span className="text-xs text-charcoal-muted">MA Sanskrit Epigraphy, Banaras Hindu University (BHU)</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                applicantStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}>
                {applicantStatus}
              </span>
            </div>
            <p className="text-xs text-charcoal-light leading-relaxed">
              "Fluent in English, Hindi, and Sanskrit. Experienced with Vedic oral traditions, Kashi Vishwanath Dham iconography, and old city boat routes."
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <span className="text-charcoal-muted">Aadhaar: Verified • Police Clearance: Submitted</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setApplicantStatus('Changes Requested');
                    handleAction('Requested address certificate verification.');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-sand-border text-xs font-semibold text-charcoal hover:bg-sand"
                >
                  Request Docs
                </button>
                <button
                  onClick={() => {
                    setApplicantStatus('Approved');
                    handleAction('Application Approved! Companion onboarded into Varanasi pool.');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light shadow"
                >
                  Approve & Onboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* 3. CITY MANAGEMENT */
  if (type === 'cities') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">Active City Hubs & Operations</h1>
          <p className="text-xs text-charcoal-muted">Platform cities currently active for destination matching and local companions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-sand-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ACTIVE • FULL LAUNCH
              </span>
              <span className="text-xs font-mono font-bold text-saffron">HQ NODE</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-river">Varanasi (Banaras), Uttar Pradesh</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Primary spiritual cradle. 84 ghats, Kashi Vishwanath Dham, Sarnath, and Ramnagar coverage.
            </p>
            <div className="pt-2 border-t border-sand-border text-xs flex items-center justify-between text-charcoal-muted">
              <span>Destinations: <strong>6+ Active</strong></span>
              <span>Buddies: <strong>4 Verified</strong></span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ACTIVE • EXPANSION NODE
              </span>
              <span className="text-xs font-mono font-bold text-saffron">RAJASTHAN NODE</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-river">Jaipur, Rajasthan</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Royal Heritage & Cultural Hub. Amber Fort, Hawa Mahal, City Palace, and Pushkar regional coverage.
            </p>
            <div className="pt-2 border-t border-sand-border text-xs flex items-center justify-between text-charcoal-muted">
              <span>Destinations: <strong>4+ Active</strong></span>
              <span>Buddies: <strong>2 Verified</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* 4. PACKAGES MANAGEMENT */
  if (type === 'packages') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-river">Travel Packages ({packages.length})</h1>
            <p className="text-xs text-charcoal-muted">Curated spiritual, heritage, and multi-day packages for Varanasi and Jaipur.</p>
          </div>
          <button
            onClick={() => setIsPkgModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white p-6 rounded-3xl border border-sand-border shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#FF5F1F]">
                      {pkg.city}
                    </span>
                    <span className="text-[10px] text-charcoal-muted font-bold uppercase">{pkg.category} • {pkg.duration}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-river mt-1">{pkg.titleEn}</h4>
                  <span className="text-[11px] text-charcoal-muted block">{pkg.titleHi}</span>
                </div>
                <span className="text-base font-bold text-saffron font-mono">₹{pkg.price}</span>
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed">{pkg.descriptionEn}</p>
              <div className="pt-3 border-t border-sand-border flex items-center justify-between text-xs">
                <span className="text-charcoal-muted">Max Capacity: <strong>{pkg.maxPartySize} Guests</strong></span>
                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50"
                  title="Remove package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isPkgModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-sand-border shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-river">Create New Travel Package</h3>
              <form onSubmit={handleAddPackage} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-river block mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={pkgTitleEn}
                    onChange={(e) => setPkgTitleEn(e.target.value)}
                    className="w-full p-2 rounded-xl border border-sand-border"
                  />
                </div>
                <div>
                  <label className="font-bold text-river block mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={pkgTitleHi}
                    onChange={(e) => setPkgTitleHi(e.target.value)}
                    className="w-full p-2 rounded-xl border border-sand-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-river block mb-1">City</label>
                    <select
                      value={pkgCity}
                      onChange={(e) => setPkgCity(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-sand-border"
                    >
                      <option value="Varanasi">Varanasi</option>
                      <option value="Jaipur">Jaipur</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-river block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-sand-border"
                    >
                    </input>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-river block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={pkgDesc}
                    onChange={(e) => setPkgDesc(e.target.value)}
                    className="w-full p-2 rounded-xl border border-sand-border"
                  />
                </div>
                <div className="pt-3 border-t border-sand-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPkgModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-sand-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-saffron text-white font-bold"
                  >
                    Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* 5. SUPPORT TICKETS */
  if (type === 'support') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">Support Tickets & Grievances ({supportTickets.length})</h1>
          <p className="text-xs text-charcoal-muted">Traveler issues, accessibility support, and companion requests.</p>
        </div>

        <div className="space-y-4">
          {supportTickets.map((tkt) => (
            <div key={tkt.id} className="bg-white p-6 rounded-3xl border border-sand-border shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-saffron">{tkt.ticketRef}</span>
                  <h4 className="font-bold text-sm text-river mt-0.5">{tkt.subject}</h4>
                  <span className="text-charcoal-muted">From: {tkt.userName} ({tkt.userRole}) • Priority: <strong>{tkt.priority}</strong></span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  tkt.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {tkt.status}
                </span>
              </div>
              <p className="text-charcoal-light leading-relaxed">{tkt.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                {tkt.status !== 'Resolved' && (
                  <button
                    onClick={() => updateTicketStatus(tkt.id, 'Resolved')}
                    className="px-4 py-1.5 rounded-xl bg-river text-ivory font-bold hover:bg-river-light"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* 6. TRAVELERS */
  if (type === 'travelers') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Traveler Profiles & Customers</h1>
        <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden table-responsive-container">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Bookings</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              <tr className="hover:bg-sand/20">
                <td className="p-4 font-bold text-river">Shalini Verma</td>
                <td className="p-4 text-charcoal-muted">traveler@example.com</td>
                <td className="p-4 font-semibold text-charcoal">2 Requests</td>
                <td className="p-4"><span className="text-saffron-light font-bold bg-saffron-muted px-2.5 py-0.5 rounded-full text-[10px] border border-saffron/30">Active</span></td>
                <td className="p-4 text-right"><button onClick={() => handleAction('Viewing customer history')} className="text-xs font-bold text-river hover:text-saffron">History &rarr;</button></td>
              </tr>
              <tr className="hover:bg-sand/20">
                <td className="p-4 font-bold text-river">Elena Rostova</td>
                <td className="p-4 text-charcoal-muted">elena.r@example.com</td>
                <td className="p-4 font-semibold text-charcoal">1 Request</td>
                <td className="p-4"><span className="text-saffron-light font-bold bg-saffron-muted px-2.5 py-0.5 rounded-full text-[10px] border border-saffron/30">Active</span></td>
                <td className="p-4 text-right"><button onClick={() => handleAction('Viewing customer history')} className="text-xs font-bold text-river hover:text-saffron">History &rarr;</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* 7. DESTINATIONS */
  if (type === 'destinations') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-river">Destination Catalog ({destinations.length})</h1>
          <button onClick={() => handleAction('Opening Add Destination modal (Demo)')} className="px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light">
            Add Destination
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
              <span className="text-[10px] font-bold uppercase text-saffron">{d.category}</span>
              <h4 className="font-serif text-base font-bold text-river">{d.name}</h4>
              <p className="text-xs text-charcoal-muted line-clamp-2">{d.description}</p>
              <div className="pt-2 flex items-center justify-between border-t border-sand-border text-xs">
                <span className="text-charcoal-muted">{d.suggestedDuration}</span>
                <button onClick={() => handleAction(`Editing ${d.name}`)} className="font-bold text-river hover:text-saffron">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* 8. SERVICES */
  if (type === 'services') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Signature Experiences & Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
              <span className="text-[10px] font-bold text-saffron uppercase">{exp.category}</span>
              <h4 className="font-serif text-base font-bold text-river">{exp.title}</h4>
              <p className="text-xs text-charcoal-muted line-clamp-2">{exp.description}</p>
              <div className="pt-2 flex items-center justify-between border-t border-sand-border text-xs">
                <span className="font-bold text-river">{exp.duration}</span>
                <button onClick={() => handleAction(`Editing service ${exp.title}`)} className="text-xs font-bold text-river hover:text-saffron">Edit Service</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* 9. REVIEWS */
  if (type === 'reviews') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">Verified Reviews & Moderation</h1>
          <p className="text-xs text-charcoal-muted">Audit ratings and customer comments submitted after tours.</p>
        </div>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-sand-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-river text-sm">{r.travelerName}</span>
                  <span className="text-charcoal-muted text-[11px] block">For Companion: <strong>{r.buddyName}</strong> ({r.city})</span>
                </div>
                <span className="text-saffron font-bold text-sm">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-charcoal-light italic">"{r.comment}"</p>
              <div className="pt-2 border-t border-sand-border flex items-center justify-between text-[10px] text-charcoal-muted">
                <span>Ref: {r.bookingRef} • Status: {r.status}</span>
                <button onClick={() => handleAction('Review flagged for audit')} className="hover:text-red-500">Flag / Moderate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* 10. ENQUIRIES */
  if (type === 'enquiries') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Contact Enquiries ({enquiries.length})</h1>
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq.id} className="bg-white p-6 rounded-2xl border border-sand-border space-y-3">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <div>
                  <h4 className="font-bold text-sm text-river">{enq.subject}</h4>
                  <span className="text-xs text-charcoal-muted">From: {enq.name} ({enq.email} • {enq.phone})</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  enq.status === 'Resolved' ? 'bg-saffron text-white border-saffron' : 'bg-saffron-muted text-saffron-light border-saffron/30'
                }`}>
                  {enq.status}
                </span>
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed">{enq.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => updateEnquiryStatus(enq.id, 'Resolved')}
                  className="px-4 py-1.5 rounded-lg bg-river text-ivory text-xs font-semibold"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* 11. CMS */
  if (type === 'cms') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Website Content Management System (CMS)</h1>
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border space-y-6 text-xs">
          <div className="space-y-3">
            <label className="font-bold text-river block">Homepage Primary Headline</label>
            <input
              type="text"
              defaultValue="Explore Kashi, Your Way."
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="font-bold text-river block">Homepage Supporting Subtext</label>
            <textarea
              rows={3}
              defaultValue="Discover the stories, culture and hidden corners of Banaras with a local companion who knows the city."
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleAction('CMS homepage texts updated!')}
            className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light"
          >
            Publish Content Updates
          </button>
        </div>
      </div>
    );
  }

  /* 12. REPORTS */
  if (type === 'reports') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Reports & Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <span className="font-bold text-charcoal-muted uppercase">Monthly Booking Growth</span>
            <p className="font-serif text-3xl font-bold text-river">+38.4%</p>
            <span className="text-[10px] text-saffron font-bold block">October - November 2026</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <span className="font-bold text-charcoal-muted uppercase">Avg. Companion Rating</span>
            <p className="font-serif text-3xl font-bold text-river">4.94 / 5.0</p>
            <span className="text-[10px] text-charcoal-muted block">Across 600+ logged walks</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-sand-border space-y-2">
            <span className="font-bold text-charcoal-muted uppercase">Inquiry Conversion</span>
            <p className="font-serif text-3xl font-bold text-river">82.1%</p>
            <span className="text-[10px] text-saffron font-bold block">Inquiry to buddy match</span>
          </div>
        </div>
      </div>
    );
  }

  /* 13. AUDIT & SETTINGS */
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-river capitalize">{type} Console</h1>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border space-y-4 text-xs text-charcoal-light">
        <div className="p-4 rounded-xl bg-ivory border border-sand-border">
          <strong>Varanasi Operations Node:</strong> Configured for strict compliance with Indian tourism safety protocols, local companion honorariums, and digital ledger auditing.
        </div>
        <p className="leading-relaxed">
          All settings, role definitions, and administrative controls are fully wired and functional in demonstration mode.
        </p>
      </div>
    </div>
  );
};
