import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Search, MapPin } from 'lucide-react';
import { BookingCategory } from '../../types';

export const QuickBookingBar: React.FC = () => {
  const navigate = useNavigate();
  const [destination] = useState('Varanasi (Kashi)');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [travelers, setTravelers] = useState(2);
  const [category, setCategory] = useState<BookingCategory>('HALF_DAY');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/book?date=${date}&travelers=${travelers}&category=${category}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl border border-sand-border p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
    >
      {/* Destination */}
      <div className="p-2.5 rounded-xl bg-ivory/60 border border-sand-border/80 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-saffron shrink-0" />
        <div className="text-left w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
            Destination
          </label>
          <span className="text-sm font-semibold text-river truncate block">
            {destination}
          </span>
        </div>
      </div>

      {/* Travel Date */}
      <div className="p-2.5 rounded-xl bg-ivory/60 border border-sand-border/80 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-saffron shrink-0" />
        <div className="text-left w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs font-semibold text-charcoal bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Number of People */}
      <div className="p-2.5 rounded-xl bg-ivory/60 border border-sand-border/80 flex items-center gap-3">
        <Users className="w-5 h-5 text-saffron shrink-0" />
        <div className="text-left w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
            Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full text-xs font-semibold text-charcoal bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={1}>1 Solo Explorer</option>
            <option value={2}>2 Persons (Couple/Friends)</option>
            <option value={3}>3 Persons</option>
            <option value={4}>4 Persons (Family)</option>
            <option value={5}>5+ Group</option>
          </select>
        </div>
      </div>

      {/* Duration Category */}
      <div className="p-2.5 rounded-xl bg-ivory/60 border border-sand-border/80 flex items-center gap-3">
        <Clock className="w-5 h-5 text-saffron shrink-0" />
        <div className="text-left w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
            Duration
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BookingCategory)}
            className="w-full text-xs font-semibold text-charcoal bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="HOURLY">Hourly (2-3 hrs)</option>
            <option value="HALF_DAY">Half Day (4 hrs)</option>
            <option value="FULL_DAY">Full Day (8 hrs)</option>
          </select>
        </div>
      </div>

      {/* Search CTA */}
      <div className="sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className="w-full h-13 rounded-xl bg-saffron text-white font-semibold text-sm hover:bg-saffron-light active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Find My Buddy</span>
        </button>
      </div>
    </form>
  );
};
