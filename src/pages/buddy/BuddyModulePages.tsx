import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Star,
  Save,
  CheckCircle2,
  User,
  Award,
  Languages,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  AlertCircle,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuddyModulePages: React.FC<{
  type:
    | 'profile'
    | 'availability'
    | 'feedback'
    | 'upcoming'
    | 'history'
    | 'notifications'
    | 'settings'
    | 'verification'
    | 'services'
    | 'earnings';
}> = ({ type }) => {
  const {
    showToast,
    language,
    buddies,
    currentUser,
    buddyServices,
    addBuddyService,
    deleteBuddyService,
    buddyDocuments,
    requests,
    updateRequestStatus,
    reviews,
    notifications,
  } = useApp();

  const myId = currentUser?.id || 'buddy-anand-shukla';
  const myProfile = buddies.find((b) => b.id === myId) || buddies[0];

  // Profile Form state
  const [name, setName] = useState(myProfile.name);
  const [title, setTitle] = useState(myProfile.title);
  const [nativeOf, setNativeOf] = useState(myProfile.nativeOf);
  const [bio, setBio] = useState(myProfile.bio);
  const [languagesStr, setLanguagesStr] = useState(myProfile.languages.join(', '));
  const [hourlyRate, setHourlyRate] = useState(myProfile.hourlyRate);
  const [halfDayRate, setHalfDayRate] = useState(myProfile.halfDayRate);
  const [fullDayRate, setFullDayRate] = useState(myProfile.fullDayRate);

  // New Service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('3 Hours');
  const [newServiceRate, setNewServiceRate] = useState(1200);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Weekly availability
  const [availableSlots, setAvailableSlots] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Buddy Profile and pricing updated successfully!');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      showToast('Please enter service name.');
      return;
    }
    addBuddyService({
      buddyId: myId,
      name: newServiceName,
      city: 'Varanasi',
      description: newServiceDesc || 'Curated local companion walkthrough.',
      duration: newServiceDuration,
      capacity: 5,
      rate: Number(newServiceRate),
      status: 'Active',
    });
    setNewServiceName('');
    setNewServiceDesc('');
  };

  // 1. VERIFICATION & DOCUMENTS
  if (type === 'verification') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'साथी सत्यापन एवं दस्तावेज़' : 'Buddy Verification & Credential Audit'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Official government verification records, police clearance certificate, and local university credentials.
          </p>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                Verification Grade: Level 1 Certified
              </span>
              <h3 className="font-serif text-lg font-bold text-river">
                Approved Varanasi Cultural Ambassador
              </h3>
              <p className="text-xs text-charcoal-light">
                Identity verified by Varanasi District Operations. Police clearance valid through 2027.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            ACTIVE & VERIFIED
          </span>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Document Type</th>
                <th className="p-4">Document / License ID</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Audit Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              {buddyDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-sand/20">
                  <td className="p-4 font-bold text-river flex items-center gap-2">
                    <FileText className="w-4 h-4 text-saffron" />
                    <span>{doc.docType}</span>
                  </td>
                  <td className="p-4 font-mono text-charcoal-muted">{doc.docNumber}</td>
                  <td className="p-4 text-charcoal-muted">{doc.uploadedAt}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => showToast('Opening secure document preview (Restricted)...')}
                      className="text-xs font-bold text-river hover:text-saffron"
                    >
                      View Record
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

  // 2. SERVICES & PRICING
  if (type === 'services') {
    const myServices = buddyServices.filter((s) => s.buddyId === myId);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'मेरी सेवाएं व मूल्य निर्धारण' : 'My Offerings & Pricing Catalog'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Configure the specific ghat walks, temple visits, and rates you offer to travelers.
          </p>
        </div>

        {/* Existing Services Grid */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river">Active Offerings ({myServices.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myServices.map((srv) => (
              <div key={srv.id} className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-saffron">{srv.city} • {srv.duration}</span>
                    <h4 className="font-serif text-base font-bold text-river mt-0.5">{srv.name}</h4>
                  </div>
                  <span className="text-base font-bold text-saffron font-mono">₹{srv.rate}</span>
                </div>
                <p className="text-xs text-charcoal-light leading-relaxed">{srv.description}</p>
                <div className="pt-2 border-t border-sand-border flex items-center justify-between text-xs">
                  <span className="text-charcoal-muted">Max Capacity: <strong>{srv.capacity} Travelers</strong></span>
                  <button
                    onClick={() => deleteBuddyService(srv.id)}
                    className="p-1.5 text-charcoal-muted hover:text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Service Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <Plus className="w-4 h-4 text-saffron" />
            <span>Create New Offering</span>
          </h3>
          <form onSubmit={handleCreateService} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-river block">Offering Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Manikarnika Philosophy & Evening Boat Walk"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-river block">Honorarium Fee (₹)</label>
              <input
                type="number"
                required
                value={newServiceRate}
                onChange={(e) => setNewServiceRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-river block">Detailed Description & Included Highlights</label>
              <textarea
                rows={2}
                placeholder="What travelers will learn and experience during this accompanied walk..."
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-sand-border focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light"
              >
                Add Service Offering
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. EARNINGS & PAYOUTS
  if (type === 'earnings') {
    const completedTrips = requests.filter(
      (r) => r.assignedBuddyId === myId && r.status === 'Trip Completed'
    );
    const totalEarned = completedTrips.reduce(
      (acc, curr) => acc + (curr.priceBreakdown?.baseRate || 1400),
      4800
    );

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'साथी मानदेय एवं भुगतान' : 'Earnings & Companion Honorariums'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Direct ledger of completed tours, accrued honorariums, and bank disbursement history.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-charcoal-muted">Total Accrued Earnings</span>
            <p className="font-serif text-3xl font-bold text-river">₹{totalEarned.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Honorarium Settled</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-charcoal-muted">Available for Payout</span>
            <p className="font-serif text-3xl font-bold text-saffron">₹1,400</p>
            <span className="text-[10px] text-charcoal-muted block">Next cycle: Friday</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-charcoal-muted">Bank Account on File</span>
            <p className="font-mono text-sm font-bold text-river mt-2">HDFC Bank •••• 9104</p>
            <span className="text-[10px] text-emerald-600 font-semibold block">Verified for direct NEFT</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Tour Reference</th>
                <th className="p-4">Traveler</th>
                <th className="p-4">Date</th>
                <th className="p-4">Duration Tier</th>
                <th className="p-4">Honorarium</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              <tr className="hover:bg-sand/20">
                <td className="p-4 font-mono font-bold text-saffron">TOB-KSH-5120</td>
                <td className="p-4 font-bold text-river">Shalini Verma</td>
                <td className="p-4 text-charcoal-muted">14 Oct 2026</td>
                <td className="p-4 text-charcoal-light">Half Day (4 hrs)</td>
                <td className="p-4 font-bold text-river">₹1,400</td>
                <td className="p-4 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Disbursed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. AVAILABILITY CALENDAR
  if (type === 'availability') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'उपलब्धता कैलेंडर व समय स्लॉट' : 'Availability Calendar & Time Slots'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Configure active days and block private dates to prevent double booking.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {Object.entries(availableSlots).map(([day, active]) => (
              <div
                key={day}
                className="p-4 rounded-xl border border-sand-border flex items-center justify-between"
              >
                <span className="font-bold text-river capitalize">{day}</span>
                <button
                  type="button"
                  onClick={() =>
                    setAvailableSlots((prev) => ({
                      ...prev,
                      [day as keyof typeof availableSlots]: !active,
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    active ? 'bg-saffron text-white shadow-xs' : 'bg-sand text-charcoal-muted'
                  }`}
                >
                  {active ? 'Available' : 'Blocked'}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast('Weekly availability saved successfully!')}
            className="px-6 py-2.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-light"
          >
            Save Weekly Schedule
          </button>
        </div>
      </div>
    );
  }

  // 5. TRIP HISTORY (COMPLETED TRIPS)
  if (type === 'history') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'संपन्न यात्राएं' : 'Completed Accompanied Trips'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Archive of your completed Varanasi tours and verified feedback.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-sand-border pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-saffron">TOB-KSH-5120</span>
                <h4 className="font-serif text-base font-bold text-river mt-0.5">Heritage & Weaver Guild Walk</h4>
                <span className="text-charcoal-muted">Traveler: Shalini Verma (2 Guests)</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Completed
              </span>
            </div>
            <p className="text-charcoal-light">
              4-hour walking tour covering Madanpura handloom looms and ancient Vishwanath temple alleyways.
            </p>
            <div className="p-3 bg-ivory rounded-xl border border-sand-border flex items-center justify-between">
              <span>Earned Honorarium: <strong>₹1,400</strong></span>
              <span className="text-saffron font-bold">★★★★★ (5/5 Review)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. TRAVELER FEEDBACK
  if (type === 'feedback') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-river">
              {language === 'HI' ? 'यात्री समीक्षाएं एवं रेटिंग' : 'Traveler Feedback & Ratings'}
            </h1>
            <p className="text-xs text-charcoal-muted">
              Genuine reviews left by travelers after completed accompanied tours.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            ★ 4.95 Rating (142 Reviews)
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-sand-border space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-river text-sm">{r.travelerName}</span>
                  <span className="text-charcoal-muted block text-[11px]">{r.city} • {r.date}</span>
                </div>
                <span className="text-saffron font-bold text-sm">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-charcoal-light italic leading-relaxed">"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. NOTIFICATIONS
  if (type === 'notifications') {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold text-river">Buddy Notifications</h1>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-2xl border border-sand-border space-y-1 text-xs">
              <span className="text-[10px] font-bold text-saffron uppercase">{n.type}</span>
              <h4 className="font-bold text-sm text-river">{language === 'HI' ? n.titleHi : n.titleEn}</h4>
              <p className="text-charcoal-light">{language === 'HI' ? n.messageHi : n.messageEn}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. PROFILE / SETTINGS (Default)
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-river">
          {type === 'settings' ? 'Companion Settings & Credentials' : 'My Public Buddy Profile'}
        </h1>
        <p className="text-xs text-charcoal-muted">
          Your public biography, linguistic fluency, and honorarium tiers shown to travelers.
        </p>
      </div>

      <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-5 text-xs">
        <h3 className="font-serif text-lg font-bold text-river border-b border-sand-border pb-3">
          Companion Bio & Specializations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Professional Designation</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Native Locality & City</label>
            <input
              type="text"
              required
              value={nativeOf}
              onChange={(e) => setNativeOf(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Fluent Languages</label>
            <input
              type="text"
              required
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-river block">Biography & Heritage Credentials</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-river border-b border-sand-border pb-3 pt-3">
          Honorarium Base Rates (₹)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Hourly Rate (₹)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Half Day (4 hrs) (₹)</label>
            <input
              type="number"
              value={halfDayRate}
              onChange={(e) => setHalfDayRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Full Day (8 hrs) (₹)</label>
            <input
              type="number"
              value={fullDayRate}
              onChange={(e) => setFullDayRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sand-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Pricing</span>
          </button>
        </div>
      </form>
    </div>
  );
};
