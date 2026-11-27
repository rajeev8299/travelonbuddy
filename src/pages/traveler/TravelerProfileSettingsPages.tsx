import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Bookmark,
  Star,
  CreditCard,
  Download,
  ExternalLink,
  Trash2,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TravelerProfileSettingsPages: React.FC<{
  type: 'profile' | 'notifications' | 'history' | 'support' | 'settings' | 'saved' | 'payments' | 'trips';
}> = ({ type }) => {
  const {
    currentUser,
    updateCurrentUserProfile,
    showToast,
    language,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    savedItems,
    toggleSavedItem,
    buddies,
    destinations,
    packages,
    reviews,
    addReview,
    supportTickets,
    createSupportTicket,
    requests,
  } = useApp();

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || 'Shalini Verma');
  const [email, setEmail] = useState(currentUser?.email || 'traveler@example.com');
  const [phone, setPhone] = useState('+91 98112 45091');
  const [city, setCity] = useState('New Delhi, India');
  const [bio, setBio] = useState('Passionate cultural explorer with deep love for ancient Indian spiritual traditions.');

  // Password / Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Support Ticket Form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<any>('Booking Issue');
  const [ticketPriority, setTicketPriority] = useState<any>('Medium');
  const [ticketMsg, setTicketMsg] = useState('');

  // Review Submission Modal / Form
  const [reviewBookingRef, setReviewBookingRef] = useState('TOB-KSH-5120');
  const [reviewBuddyName, setReviewBuddyName] = useState('Rohit Varma');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ name, email });
    showToast(language === 'HI' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter current and new password.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password updated securely.');
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) {
      showToast('Please provide subject and details.');
      return;
    }
    createSupportTicket({
      userId: currentUser?.id || 'user-traveler-1',
      userName: currentUser?.name || 'Shalini Verma',
      userRole: 'traveler',
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMsg,
    });
    setTicketSubject('');
    setTicketMsg('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write your review comment.');
      return;
    }
    addReview({
      bookingRef: reviewBookingRef,
      travelerName: currentUser?.name || 'Shalini Verma',
      buddyName: reviewBuddyName,
      city: 'Varanasi',
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewComment('');
  };

  // 1. NOTIFICATIONS
  if (type === 'notifications') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-river">
              {language === 'HI' ? 'सूचनाएं' : 'Notifications & Travel Alerts'}
            </h1>
            <p className="text-xs text-charcoal-muted">
              Booking updates, companion assignments, and local safety announcements.
            </p>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 rounded-xl border border-sand-border bg-white text-xs font-semibold text-river hover:bg-sand transition"
          >
            {language === 'HI' ? 'सभी को पढ़ा हुआ चिन्हित करें' : 'Mark All as Read'}
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-white border-sand-border opacity-85'
                  : 'bg-white border-saffron/40 shadow-xs ring-1 ring-saffron/20'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                <span className={n.read ? 'text-charcoal-muted' : 'text-saffron'}>
                  {n.type} • {new Date(n.createdAt).toLocaleDateString()}
                </span>
                {!n.read && (
                  <span className="px-2 py-0.5 rounded-full bg-saffron text-white text-[9px] font-bold">
                    NEW
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-river">
                {language === 'HI' ? n.titleHi : n.titleEn}
              </h4>
              <p className="text-xs text-charcoal-light mt-1">
                {language === 'HI' ? n.messageHi : n.messageEn}
              </p>
              {n.link && (
                <Link
                  to={n.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-saffron hover:underline mt-2.5"
                >
                  <span>{language === 'HI' ? 'विवरण देखें' : 'View Details'} &rarr;</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. SAVED ITEMS
  if (type === 'saved') {
    const savedBuddiesList = buddies.filter((b) => savedItems.buddyIds?.includes(b.id));
    const savedDestsList = destinations.filter((d) => savedItems.destinationIds?.includes(d.id));
    const savedPackagesList = packages.filter((p) => savedItems.packageIds?.includes(p.id));

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'मेरी सहेजी गई सूची' : 'My Saved Collection'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Quickly access your favorite companions, temples, ghats, and curated packages.
          </p>
        </div>

        {/* Saved Buddies */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-saffron" />
            <span>Saved Travel Buddies ({savedBuddiesList.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBuddiesList.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img src={b.avatar} alt={b.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-river">{b.name}</h4>
                    <span className="text-[11px] text-charcoal-muted block">{b.title}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-sand-border">
                  <span className="font-bold text-saffron">₹{b.hourlyRate}/hr</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSavedItem('buddyIds', b.id)}
                      className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-500 hover:bg-red-50"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/book?buddy=${b.id}`}
                      className="px-3 py-1 rounded-lg bg-saffron text-white font-bold text-xs hover:bg-saffron-light"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Destinations */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron" />
            <span>Saved Destinations ({savedDestsList.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedDestsList.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase text-saffron">{d.category}</span>
                <h4 className="font-serif text-base font-bold text-river">{d.name}</h4>
                <p className="text-xs text-charcoal-muted line-clamp-2">{d.description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-sand-border text-xs">
                  <Link to={`/destinations/${d.id}`} className="font-bold text-river hover:text-saffron">
                    View Destination &rarr;
                  </Link>
                  <button
                    onClick={() => toggleSavedItem('destinationIds', d.id)}
                    className="p-1 text-charcoal-muted hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. MY TRIPS
  if (type === 'trips') {
    const upcoming = requests.filter((r) => r.status.includes('Confirmed') || r.status.includes('Accepted'));
    const pending = requests.filter((r) => r.status.includes('Submitted') || r.status.includes('Review') || r.status.includes('Proposed'));
    const completed = requests.filter((r) => r.status === 'Trip Completed');

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'मेरी यात्राएं एवं कार्यक्रम' : 'My Trips & Itineraries'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Upcoming schedules, pickup milestones, and assigned companion coordination.
          </p>
        </div>

        {/* Upcoming Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Confirmed Upcoming Journeys ({upcoming.length})</span>
          </h3>

          {upcoming.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-border pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-saffron">{req.bookingRef}</span>
                  <h4 className="font-serif text-lg font-bold text-river">{req.destination} Immersion</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-charcoal-muted block">Travel Dates</span>
                  <span className="font-bold text-river">{req.startDate} {req.endDate ? `to ${req.endDate}` : ''}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Assigned Companion</span>
                  <span className="font-bold text-river">{req.assignedBuddyName || 'Coordination in progress'}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Pickup Landmark</span>
                  <span className="font-bold text-river">{req.pickupLocation}</span>
                </div>
              </div>

              <div className="p-3 bg-ivory rounded-xl border border-sand-border text-xs flex items-center justify-between">
                <span>Total Package: <strong>{req.estimatedPriceDisplay}</strong> ({req.travelerCount} Travelers)</span>
                <Link to={`/traveler/requests/${req.id}`} className="font-bold text-saffron hover:underline">
                  Full Details &rarr;
                </Link>
              </div>
            </div>
          ))}

          {upcoming.length === 0 && (
            <div className="p-8 bg-white rounded-2xl border border-sand-border text-center text-xs text-charcoal-muted">
              No confirmed upcoming trips right now. Plan your next visit below!
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. PAYMENTS & RECEIPTS
  if (type === 'payments') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'भुगतान एवं रसीदें' : 'Payments & Transaction Receipts'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Transparent breakdown of companion honorariums, platform coordination fees, and invoices.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand-border text-charcoal-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Service</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-border/60">
              <tr className="hover:bg-sand/20">
                <td className="p-4 font-mono font-bold text-saffron">TXN-894102</td>
                <td className="p-4 text-charcoal-muted">15 Nov 2026</td>
                <td className="p-4 font-bold text-river">Subah-e-Banaras Ghat Companion</td>
                <td className="p-4 font-bold text-river">₹1,850</td>
                <td className="p-4 text-charcoal-light">UPI / Razorpay</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Paid
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => showToast('Downloading PDF Tax Receipt (Demo)...')}
                    className="p-1.5 rounded-lg border border-sand-border text-river hover:text-saffron hover:bg-sand inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[10px]">PDF</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. TRIP HISTORY & REVIEWS
  if (type === 'history') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'यात्रा इतिहास व साथी समीक्षाएं' : 'Trip History & Feedback'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Share ratings and reviews for completed journeys with your verified companions.
          </p>
        </div>

        {/* Write a Review Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <Star className="w-5 h-5 text-saffron fill-saffron" />
            <span>Rate & Review Your Companion</span>
          </h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-river block mb-1">Booking Reference</label>
                <input
                  type="text"
                  value={reviewBookingRef}
                  onChange={(e) => setReviewBookingRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                />
              </div>
              <div>
                <label className="font-bold text-river block mb-1">Companion Name</label>
                <input
                  type="text"
                  value={reviewBuddyName}
                  onChange={(e) => setReviewBuddyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                />
              </div>
              <div>
                <label className="font-bold text-river block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                >
                  <option value={5}>★★★★★ (5 - Excellent)</option>
                  <option value={4}>★★★★☆ (4 - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 - Good)</option>
                  <option value={2}>★★☆☆☆ (2 - Fair)</option>
                  <option value={1}>★☆☆☆☆ (1 - Poor)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-river block mb-1">Your Travel Experience Review</label>
              <textarea
                rows={3}
                required
                placeholder="Describe your companion's storytelling, respectfulness, local guidance, and punctuality..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold text-xs hover:bg-saffron-light"
            >
              Submit Verified Review
            </button>
          </form>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river">Previously Submitted Reviews</h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-river">{r.buddyName} ({r.city})</span>
                  <span className="text-saffron font-bold">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-charcoal-light italic">"{r.comment}"</p>
                <span className="text-[10px] text-charcoal-muted block">Ref: {r.bookingRef} • {r.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 6. SUPPORT & HELP
  if (type === 'support') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {language === 'HI' ? 'सहायता एवं संपर्क केंद्र' : 'Traveler Support & Assistance'}
          </h1>
          <p className="text-xs text-charcoal-muted">
            Direct coordination for special elder assistance, wheelchair accessibility, or itinerary questions.
          </p>
        </div>

        {/* Create Ticket */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-river flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-saffron" />
            <span>Open Support Request</span>
          </h3>
          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-river block mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                >
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Safety Concern">Safety Concern</option>
                  <option value="Payment & Refund">Payment & Refund</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-river block mb-1">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent Visit)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-river block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule modification"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-border"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-river block mb-1">Message</label>
              <textarea
                rows={3}
                required
                placeholder="Explain what you need assistance with..."
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full p-3 rounded-xl border border-sand-border focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold text-xs hover:bg-saffron-light"
            >
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Existing Tickets */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-river">Your Active Tickets ({supportTickets.length})</h3>
          {supportTickets.map((tkt) => (
            <div key={tkt.id} className="bg-white p-5 rounded-2xl border border-sand-border shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-sand-border pb-2.5">
                <div>
                  <span className="font-mono text-xs font-bold text-saffron">{tkt.ticketRef}</span>
                  <h4 className="font-bold text-sm text-river mt-0.5">{tkt.subject}</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {tkt.status}
                </span>
              </div>
              <p className="text-charcoal-light leading-relaxed">{tkt.message}</p>
              {tkt.responses?.map((r, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-ivory border border-sand-border space-y-1">
                  <span className="font-bold text-river text-[10px] uppercase">Official Operations Response</span>
                  <p className="text-charcoal-light">{r.message}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. PROFILE & SETTINGS (Unified)
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-river">
          {type === 'settings' ? 'Account Preferences & Security' : 'My Traveler Profile'}
        </h1>
        <p className="text-xs text-charcoal-muted">
          Update personal contact coordinates, language preferences, and manage account credentials.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-5 text-xs">
        <h3 className="font-serif text-lg font-bold text-river border-b border-sand-border pb-3">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Mobile / WhatsApp Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">Home Country & City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-river block">About You & Travel Interests</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sand-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Password Management */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-xs space-y-5 text-xs">
        <h3 className="font-serif text-lg font-bold text-river border-b border-sand-border pb-3">
          Security & Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sand-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-river text-ivory font-bold hover:bg-river-light flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
};
