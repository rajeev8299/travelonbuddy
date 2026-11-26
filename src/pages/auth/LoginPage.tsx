import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAssetUrl } from '../../utils/assetHelper';
import { isSupabaseConfigured } from '../../services/supabase';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, t, showToast } = useApp();
  const [email, setEmail] = useState('traveler@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // If Supabase is connected, attempt Supabase Auth first
      if (isSupabaseConfigured()) {
        const supabaseResult = await authService.login(email, password);
        if (supabaseResult.success && supabaseResult.user) {
          login(email, password); // Sync with AppContext user session
          const userRole = supabaseResult.user.role;
          if (userRole === 'traveler') navigate('/traveler/dashboard');
          else if (userRole === 'buddy') navigate('/buddy/dashboard');
          else if (userRole === 'admin') navigate('/admin/dashboard');
          else navigate('/');
          setIsLoading(false);
          return;
        }
      }

      // Seamless fallback to trusted single login credentials
      const result = login(email, password);
      if (!result.success || !result.user) {
        setError(result.message || 'Invalid credentials.');
        setIsLoading(false);
        return;
      }

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
    } catch {
      setError('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    if (isSupabaseConfigured()) {
      const res = await authService.resetPassword(resetEmail.trim());
      if (res.success) {
        setResetSent(true);
        showToast(res.message || 'Password reset link sent.');
      } else {
        showToast(res.message || 'Password reset requested.');
      }
    } else {
      setResetSent(true);
      showToast('Password reset link simulated for demonstration.');
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
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsResetModalOpen(true);
                  setResetSent(false);
                }}
                className="text-[11px] text-saffron hover:underline cursor-pointer"
              >
                {t.auth.forgotPassword}
              </button>
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
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light transition shadow flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>{t.auth.signInBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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

      {/* Forgot Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-river/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-sand-border shadow-xl space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-river">Reset Password</h3>
              <p className="text-xs text-charcoal-muted">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            {resetSent ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Password reset link has been dispatched to <strong>{resetEmail}</strong>. Please check your inbox.
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-river text-white text-xs font-bold hover:bg-river-light transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-river block">Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl border border-sand-border focus:outline-none focus:border-saffron"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-sand-border text-charcoal-light font-bold hover:bg-sand/30 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-saffron text-white font-bold hover:bg-saffron-light shadow transition"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
