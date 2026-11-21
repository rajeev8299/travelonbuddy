import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  RefreshCw,
  Clock,
  ShieldCheck,
  Radio,
  Archive,
  History,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TravelEvent, EventCategory, EventDateStatus } from '../../types';
import { getKolkataDateString } from '../../services/eventSyncService';

export const AdminEventsPage: React.FC = () => {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    language,
    showToast,
    triggerEventSync,
    syncMetadata,
    syncSources,
    toggleSourceStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'archive' | 'sources' | 'logs'>('listings');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Varanasi' | 'Jaipur'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Published' | 'Draft'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form Fields
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [city, setCity] = useState<'Varanasi' | 'Jaipur'>('Varanasi');
  const [category, setCategory] = useState<EventCategory>('Religious Festivals');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateStatus, setDateStatus] = useState<EventDateStatus>('Confirmed');
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published');
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelledReason, setCancelledReason] = useState('');
  const [venueEn, setVenueEn] = useState('');
  const [venueHi, setVenueHi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('');
  const [isNearCity, setIsNearCity] = useState(false);
  const [nearCityDetails, setNearCityDetails] = useState('');

  const kolkataToday = getKolkataDateString();

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      triggerEventSync('ADMIN_MANUAL');
      setIsSyncing(false);
    }, 600);
  };

  const openAddModal = () => {
    setEditingEventId(null);
    setTitleEn('');
    setTitleHi('');
    setCity('Varanasi');
    setCategory('Religious Festivals');
    setStartDate(kolkataToday);
    setEndDate('');
    setDateStatus('Confirmed');
    setStatus('Published');
    setIsCancelled(false);
    setCancelledReason('');
    setVenueEn('');
    setVenueHi('');
    setDescriptionEn('');
    setDescriptionHi('');
    setCoverImage('https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=85');
    setOrganizer('Department of Tourism');
    setOfficialSourceUrl('https://uptourism.gov.in');
    setIsNearCity(false);
    setNearCityDetails('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: TravelEvent) => {
    setEditingEventId(evt.id);
    setTitleEn(evt.titleEn);
    setTitleHi(evt.titleHi);
    setCity(evt.city);
    setCategory(evt.category);
    setStartDate(evt.startDate);
    setEndDate(evt.endDate || '');
    setDateStatus(evt.dateStatus);
    setStatus(evt.status);
    setIsCancelled(!!evt.isCancelled);
    setCancelledReason(evt.cancelledReason || '');
    setVenueEn(evt.venueEn);
    setVenueHi(evt.venueHi);
    setDescriptionEn(evt.descriptionEn);
    setDescriptionHi(evt.descriptionHi);
    setCoverImage(evt.coverImage);
    setOrganizer(evt.organizer);
    setOfficialSourceUrl(evt.officialSourceUrl);
    setIsNearCity(!!evt.isNearCity);
    setNearCityDetails(evt.nearCityDetails || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn || !startDate || !venueEn) {
      showToast('Please fill all mandatory fields (Title, Date, Venue).');
      return;
    }

    const payload = {
      slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      titleEn,
      titleHi: titleHi || titleEn,
      city,
      isNearCity,
      nearCityDetails: isNearCity ? nearCityDetails : undefined,
      category,
      startDate,
      endDate: endDate || undefined,
      dateStatus,
      status,
      isCancelled,
      cancelledReason: isCancelled ? cancelledReason : undefined,
      venueEn,
      venueHi: venueHi || venueEn,
      descriptionEn,
      descriptionHi: descriptionHi || descriptionEn,
      longDescriptionEn: descriptionEn,
      longDescriptionHi: descriptionHi || descriptionEn,
      culturalSignificanceEn: descriptionEn,
      culturalSignificanceHi: descriptionHi || descriptionEn,
      visitorExperienceEn: ['Guided immersion with verified local buddy', 'Photography and heritage appreciation'],
      visitorExperienceHi: ['सत्यापित स्थानीय बडी के साथ भ्रमण', 'फोटोग्राफी एवं सांस्कृतिक दर्शन'],
      coverImage,
      imageAltText: titleEn,
      organizer,
      officialSourceUrl,
      lastVerifiedAt: kolkataToday,
    };

    if (editingEventId) {
      updateEvent(editingEventId, payload);
    } else {
      addEvent(payload);
    }

    setIsModalOpen(false);
  };

  // Filter listings (Upcoming / Ongoing tab vs Archived tab)
  const filteredEvents = events.filter((evt) => {
    if (activeTab === 'listings') {
      if (evt.status === 'Archived' || evt.lifecycleStatus === 'COMPLETED') return false;
      if (selectedStatus !== 'All' && evt.status !== selectedStatus) return false;
    } else if (activeTab === 'archive') {
      if (evt.status !== 'Archived' && evt.lifecycleStatus !== 'COMPLETED') return false;
    }

    if (selectedCity !== 'All' && evt.city !== selectedCity) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.titleEn.toLowerCase().includes(q) ||
        evt.venueEn.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Sync Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5F1F] block">
              Automated Cultural Registry & Sync Engine
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Asia/Kolkata (IST) Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[#1D1D1F] tracking-tight mt-1">
            {language === 'HI' ? 'स्वचालित उत्सव एवं पर्यटन सिंक्रोनाइज़ेशन' : 'Upcoming Festivals & Automated Event System'}
          </h1>
          <p className="text-xs text-[#6E6E73] mt-1">
            Continuous discovery, date verification, automatic expiration archiving, and city-wise separation for Varanasi & Jaipur.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl border border-[#E8E8E6] bg-white text-[#1D1D1F] text-xs font-semibold hover:bg-[#F5F5F3] transition flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF5F1F] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Checking Official Feeds...' : 'Run Sync Now'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'HI' ? 'नया उत्सव जोड़ें' : 'Add Event'}</span>
          </button>
        </div>
      </div>

      {/* Sync Engine Status Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Last Sync (IST)</span>
          <span className="text-sm font-bold text-[#1D1D1F] block mt-1">
            {syncMetadata.lastSyncAt ? new Date(syncMetadata.lastSyncAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Never'}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Automatic hourly schedule</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Official Sources</span>
          <span className="text-sm font-bold text-[#1D1D1F] block mt-1">
            {syncMetadata.activeSourcesCount} Verified
          </span>
          <span className="text-[10px] text-[#6E6E73] font-medium">UP & Rajasthan Tourism</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Upcoming</span>
          <span className="text-sm font-bold text-emerald-600 block mt-1">
            {events.filter((e) => e.lifecycleStatus === 'UPCOMING' && e.status === 'Published').length}
          </span>
          <span className="text-[10px] text-[#6E6E73] font-medium">Published on site</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Ongoing Today</span>
          <span className="text-sm font-bold text-rose-600 block mt-1">
            {events.filter((e) => e.lifecycleStatus === 'ONGOING').length}
          </span>
          <span className="text-[10px] text-rose-500 font-medium">Active celebration</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Past Archived</span>
          <span className="text-sm font-bold text-zinc-600 block mt-1">
            {events.filter((e) => e.lifecycleStatus === 'COMPLETED' || e.status === 'Archived').length}
          </span>
          <span className="text-[10px] text-[#6E6E73] font-medium">Auto-moved to archive</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#86868B] block">Cancelled</span>
          <span className="text-sm font-bold text-amber-600 block mt-1">
            {events.filter((e) => e.isCancelled).length}
          </span>
          <span className="text-[10px] text-[#6E6E73] font-medium">Flagged by organizers</span>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8E6] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-white text-[#FF5F1F] border-b-2 border-[#FF5F1F] shadow-2xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Active Upcoming & Ongoing ({events.filter((e) => e.status !== 'Archived' && e.lifecycleStatus !== 'COMPLETED').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'archive'
              ? 'bg-white text-[#FF5F1F] border-b-2 border-[#FF5F1F] shadow-2xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Past Events Archive ({events.filter((e) => e.status === 'Archived' || e.lifecycleStatus === 'COMPLETED').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sources'
              ? 'bg-white text-[#FF5F1F] border-b-2 border-[#FF5F1F] shadow-2xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Sync Sources ({syncSources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'bg-white text-[#FF5F1F] border-b-2 border-[#FF5F1F] shadow-2xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit History ({syncMetadata.recentLogs.length})</span>
        </button>
      </div>

      {/* Main Tab Content: Active Listings OR Past Archive */}
      {(activeTab === 'listings' || activeTab === 'archive') && (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E8E6] flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-[#E8E8E6] text-xs font-medium text-[#1D1D1F] bg-[#FAFAF8] cursor-pointer"
              >
                <option value="All">All Cities (Varanasi & Jaipur)</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>

              {activeTab === 'listings' && (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E8E6] text-xs font-medium text-[#1D1D1F] bg-[#FAFAF8] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event, venue, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E8E8E6] text-xs text-[#1D1D1F] bg-[#FAFAF8] focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1D1D1F]">
                <thead className="bg-[#FAFAF8] border-b border-[#E8E8E6] text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Event & City</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Dates & Lifecycle</th>
                    <th className="p-4">Venue</th>
                    <th className="p-4">Official Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E6]">
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-[#FAFAF8]/80 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.coverImage}
                            alt={evt.titleEn}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-sm text-[#1D1D1F] block">{evt.titleEn}</span>
                            <span className="text-[11px] text-[#6E6E73] block">{evt.titleHi}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF5F1F] text-[10px] font-bold">
                                {evt.city}
                              </span>
                              {evt.isNearCity && (
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-semibold">
                                  {evt.nearCityDetails}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-[#48484A]">{evt.category}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold block">
                          {evt.startDate} {evt.endDate ? `to ${evt.endDate}` : ''}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {evt.isCancelled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                              CANCELLED
                            </span>
                          ) : evt.lifecycleStatus === 'ONGOING' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                              ONGOING
                            </span>
                          ) : evt.lifecycleStatus === 'COMPLETED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-600 text-white">
                              COMPLETED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              UPCOMING
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              evt.dateStatus === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {evt.dateStatus}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 max-w-xs truncate">
                        <span className="text-[#6E6E73] line-clamp-1">{evt.venueEn}</span>
                      </td>

                      <td className="p-4">
                        <a
                          href={evt.officialSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF5F1F] hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span className="truncate max-w-[120px]">{evt.organizer}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <span className="text-[10px] text-[#86868B] block mt-0.5">
                          Verified: {evt.lastVerifiedAt}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(evt)}
                            className="p-1.5 rounded-lg border border-[#E8E8E6] text-[#1D1D1F] hover:bg-[#F5F5F3]"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#86868B]">
                        No festivals found matching current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">Configured Official Registry Sources</h3>
              <p className="text-xs text-[#6E6E73]">
                Monitored by the automated engine to detect date revisions, new schedules, and cancellations.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {syncSources.filter((s) => s.status === 'Active').length} Active Feeds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syncSources.map((src) => (
              <div key={src.id} className="p-4 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#FF5F1F]">
                      {src.city}
                    </span>
                    <button
                      onClick={() => toggleSourceStatus(src.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        src.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {src.status === 'Active' ? 'Active' : 'Paused'}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-[#1D1D1F]">{src.name}</h4>
                  <p className="text-xs text-[#6E6E73]">{src.authority}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E8E8E6]/60">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF5F1F] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>{src.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-[#86868B]">{src.eventsFoundCount || 0} events tracked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-bold text-[#1D1D1F]">Automation & Verification Audit History</h3>
          <p className="text-xs text-[#6E6E73]">
            Complete record of automated scheduled runs, manual sync triggers, date updates, and expired event archives.
          </p>

          <div className="space-y-3 pt-2">
            {syncMetadata.recentLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1D1D1F] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{log.triggeredBy}</span>
                  </span>
                  <span className="text-[10px] text-[#86868B]">
                    {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>
                <p className="text-xs text-[#48484A] leading-relaxed">{log.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8E8E6] overflow-hidden my-8">
            <div className="p-6 border-b border-[#E8E8E6] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1D1D1F]">
                {editingEventId ? 'Edit Event Details' : 'Add New Festival or Event'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  >
                    <option value="Varanasi">Varanasi</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  >
                    <option value="Religious Festivals">Religious Festivals</option>
                    <option value="Cultural Events">Cultural Events</option>
                    <option value="Music and Dance">Music and Dance</option>
                    <option value="Art and Literature">Art and Literature</option>
                    <option value="Local Fairs">Local Fairs</option>
                    <option value="Heritage Events">Heritage Events</option>
                    <option value="Seasonal Celebrations">Seasonal Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Archived">Archived (Past)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Start Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Date Confidence</label>
                  <select
                    value={dateStatus}
                    onChange={(e) => setDateStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Tentative">Tentative</option>
                    <option value="Dates To Be Announced">Dates To Be Announced</option>
                  </select>
                </div>
              </div>

              {/* Cancellation Checkbox */}
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-900">
                  <input
                    type="checkbox"
                    checked={isCancelled}
                    onChange={(e) => setIsCancelled(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Mark Event as Cancelled</span>
                </label>
                {isCancelled && (
                  <input
                    type="text"
                    placeholder="Reason for cancellation (e.g. Rescheduled or Postponed by Authority)"
                    value={cancelledReason}
                    onChange={(e) => setCancelledReason(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Venue (English) *</label>
                  <input
                    type="text"
                    required
                    value={venueEn}
                    onChange={(e) => setVenueEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Venue (Hindi)</label>
                  <input
                    type="text"
                    value={venueHi}
                    onChange={(e) => setVenueHi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1D1D1F] block mb-1">Short Description (English)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1D1D1F] block mb-1">Official Verification URL</label>
                  <input
                    type="url"
                    value={officialSourceUrl}
                    onChange={(e) => setOfficialSourceUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              {/* Near City Option */}
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8E8E6] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1D1D1F]">
                  <input
                    type="checkbox"
                    checked={isNearCity}
                    onChange={(e) => setIsNearCity(e.target.checked)}
                    className="rounded text-[#FF5F1F]"
                  />
                  <span>Event is in a Nearby Location (e.g. Pushkar near Jaipur, Sarnath near Varanasi)</span>
                </label>
                {isNearCity && (
                  <input
                    type="text"
                    placeholder="e.g. Near Jaipur (Pushkar, 145km)"
                    value={nearCityDetails}
                    onChange={(e) => setNearCityDetails(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E8E8E6] bg-white text-xs"
                  />
                )}
              </div>

              <div className="pt-4 border-t border-[#E8E8E6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8E8E6] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition"
                >
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
