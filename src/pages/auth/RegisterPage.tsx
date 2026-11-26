import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAssetUrl } from '../../utils/assetHelper';
import { isSupabaseConfigured } from '../../services/supabase';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, login, t, language } = useApp();
  const [accountType, setAccountType] = useState<'traveler' | 'buddy'>('traveler');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [expertise, setExpertise] = useState('Ghat Lore & Morning Boat Rides');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const regRes = await authService.register(
          email,
          password || 'TravelOnBuddy@2026',
          fullName,
          accountType
        );

        if (!regRes.success) {
          setError(regRes.message || 'Registration could not be completed.');
          setIsLoading(false);
          return;
        }

        showToast(
          accountType === 'traveler'
            ? 'Account created successfully! Welcome to TravelOnBuddy.'
            : 'Application submitted! Operations team will review your profile.'
        );

        // Auto authenticate locally as well
        login(email, password || 'TravelOnBuddy@2026');
        if (accountType === 'traveler') {
          navigate('/traveler/dashboard');
        } else {
          navigate('/buddy/dashboard');
        }
        setIsLoading(false);
        return;
      }

      // Seamless local demonstration mode fallback
      if (accountType === 'traveler') {
        showToast('Traveler account registered! Welcome to Kashi.');
        login(email || 'traveler@example.com', 'password123');
        navigate('/traveler/dashboard');
      } else {
        showToast('Buddy application submitted for Varanasi operations review!');
        login(email || 'anand.shukla@buddy.com', 'password123');
        navigate('/buddy/dashboard');
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-sand-border shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-river flex items-center justify-center mx-auto mb-3 p-2.5 shadow-sm">
            <img
              src={getAssetUrl('logo.png')}
              alt="TravelOnBuddy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {t.auth.joinTitle}
          </h1>
          <p className="text-xs text-charcoal-muted">
            {t.auth.joinDesc}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType('traveler')}
            className={`p-4 rounded-2xl text-left border-2 transition ${
              accountType === 'traveler' ? 'border-saffron bg-amber-50/50' : 'border-sand-border hover:bg-sand/30'
            }`}
          >
            <span className="font-serif text-sm font-bold text-river block">{t.auth.iAmTraveler}</span>
            <span className="text-[11px] text-charcoal-muted block mt-0.5">{t.auth.iAmTravelerDesc}</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('buddy')}
            className={`p-4 rounded-2xl text-left border-2 transition ${
              accountType === 'buddy' ? 'border-saffron bg-amber-50/50' : 'border-sand-border hover:bg-sand/30'
            }`}
          >
            <span className="font-serif text-sm font-bold text-river block">{t.auth.becomeBuddy}</span>
            <span className="text-[11px] text-charcoal-muted block mt-0.5">{t.auth.becomeBuddyDesc}</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">{t.auth.fullName}</label>
            <input
              type="text"
              placeholder={language === 'HI' ? 'जैसे शालिनी वर्मा' : 'e.g. Shalini Verma'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">{t.auth.emailLabel}</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">{t.auth.passwordLabel}</label>
            <input
              type="password"
              placeholder="Create a strong password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-river block">{t.auth.phoneLabel}</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              required
            />
          </div>

          {accountType === 'buddy' && (
            <div className="space-y-1.5">
              <label className="font-bold text-river block">
                {language === 'HI' ? 'सांस्कृतिक विशेषता / क्षेत्र' : 'Primary Cultural Specialty / Neighborhood'}
              </label>
              <input
                type="text"
                placeholder={language === 'HI' ? 'जैसे अस्सी घाट, मंदिर स्थापत्य, रेशमी साड़ियाँ' : 'e.g. Assi Ghat, Temple Architecture, Saree Weaving'}
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
                required
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light transition shadow flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {accountType === 'traveler'
                      ? (language === 'HI' ? 'यात्री खाता बनाएं' : 'Create Traveler Account')
                      : (language === 'HI' ? 'बडी आवेदन जमा करें' : 'Submit Buddy Application')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-sand-border">
          {t.auth.haveAccount}{' '}
          <Link to="/login" className="font-bold text-river hover:text-saffron">
            {t.common.login}
          </Link>
        </div>
      </div>
    </div>
  );
};
