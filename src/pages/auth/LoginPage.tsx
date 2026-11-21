import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAssetUrl } from '../../utils/assetHelper';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, t } = useApp();
  const [email, setEmail] = useState('traveler@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Call trusted single login authentication
    const result = login(email, password);

    if (!result.success || !result.user) {
      setError(result.message || 'Invalid credentials.');
      return;
    }

    // Automatic role-based redirection from trusted user metadata
    const userRole = result.user.role;
    if (userRole === 'traveler') {
      navigate('/traveler/dashboard');
    } else if (userRole === 'buddy') {
      navigate('/buddy/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-sand-border shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-3">
            <img
              src={getAssetUrl('logo.png')}
              alt="TravelOnBuddy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-river">
            {t.auth.welcome}
          </h1>
          <p className="text-xs text-charcoal-muted">
            {t.auth.loginDesc}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-river block">{t.auth.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-river">{t.auth.passwordLabel}</label>
              <span className="text-[11px] text-saffron hover:underline cursor-pointer">
                {t.auth.forgotPassword}
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light transition shadow flex items-center justify-center gap-2"
            >
              <span>{t.auth.signInBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
          <span>
            {t.auth.demoNote}
          </span>
        </div>

        <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-sand-border">
          {t.auth.noAccount}{' '}
          <Link to="/register" className="font-bold text-river hover:text-saffron">
            {t.auth.registerHere}
          </Link>
        </div>
      </div>
    </div>
  );
};
