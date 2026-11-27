import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAssetUrl } from '../../utils/assetHelper';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: t.navbar.home, path: '/' },
    { label: t.navbar.explore, path: '/destinations' },
    { label: t.navbar.findBuddy, path: '/buddies' },
    { label: t.navbar.experiences, path: '/experiences' },
    { label: t.navbar.events || 'Festivals & Events', path: '/events' },
    { label: t.navbar.packages, path: '/#packages' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? 'bg-white/80 dark:bg-white/80 backdrop-blur-2xl border-b border-[#E8E8E6] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          : 'bg-white/95 backdrop-blur-md border-b border-black/[0.04]'
      }`}
    >
      <div className="layout-container-wide h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Minimalist TravelOnBuddies Logo & Typography */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5F1F]/50 rounded-lg p-0.5"
        >
          <img
            src={getAssetUrl('logo.png')}
            alt="TravelOnBuddy Logo"
            className="h-7 sm:h-8.5 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105 shrink-0"
          />
          <span className="font-sans text-[14px] sm:text-base font-semibold tracking-tight text-[#1D1D1F] select-none truncate">
            TravelOn<span className="text-[#FF5F1F]">Buddy</span>
          </span>
        </Link>

        {/* Center: Apple-style Centered Navigation (Strictly xl+ to prevent overlap on 768-1279px desktop-mode viewports) */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8 h-full shrink-0">
          {navLinks.map((link) => {
            const isAnchor = link.path.startsWith('/#');
            return isAnchor ? (
              <a
                key={link.label}
                href={link.path}
                className="text-[13px] font-medium tracking-normal text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200 py-1 whitespace-nowrap"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-medium tracking-normal transition-all duration-200 relative py-1 whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-[#1D1D1F] font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#FF5F1F]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions with Language Switcher and CTA Button */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E8E6] bg-[#FAFAF8] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F3] hover:border-[#D2D2D7] transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={language === 'EN' ? 'हिंदी में बदलें' : 'Switch to English'}
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>{language === 'EN' ? 'हिंदी' : 'English'}</span>
          </button>

          <Link
            to="/login"
            className="text-[13px] font-medium text-[#1D1D1F] hover:text-[#FF5F1F] transition-colors duration-200 px-2 py-1 whitespace-nowrap shrink-0"
          >
            {t.common.login}
          </Link>
          <Link
            to="/book"
            className="text-[13px] font-medium bg-[#FF5F1F] hover:bg-[#EC5800] active:scale-[0.98] text-white px-4 py-1.5 rounded-full transition-all duration-200 shadow-[0_2px_8px_rgba(255,95,31,0.25)] hover:shadow-[0_4px_14px_rgba(255,95,31,0.35)] whitespace-nowrap shrink-0"
          >
            {t.common.bookBuddy}
          </Link>
        </div>

        {/* Mobile / Tablet / Mobile-Desktop-Site Menu Trigger (Displayed when viewport < xl: 1280px) */}
        <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Compact Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="px-2.5 py-1 rounded-full border border-[#E8E8E6] bg-[#FAFAF8] text-[11px] font-semibold text-[#1D1D1F] active:scale-95 transition shrink-0"
            aria-label="Switch Language"
          >
            {language === 'EN' ? 'हिंदी' : 'EN'}
          </button>

          <Link
            to="/book"
            className="text-xs font-medium bg-[#FF5F1F] text-white px-3 py-1.5 rounded-full shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
          >
            {t.common.book}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#1D1D1F] hover:text-[#FF5F1F] transition-colors focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Floating Navigation Menu & Subtle Backdrop */}
      {mobileMenuOpen && (
        <div className="xl:hidden">
          {/* Subtle backdrop overlay: clicking outside closes the menu */}
          <div
            className="fixed inset-0 top-[56px] sm:top-[64px] bg-black/20 backdrop-blur-[2px] transition-opacity z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Compact floating menu panel */}
          <div className="fixed top-[62px] sm:top-[70px] right-3 sm:right-6 left-auto w-[90vw] max-w-[340px] max-h-[calc(100vh-84px)] overflow-y-auto bg-white/95 backdrop-blur-xl border border-[#E8E8E6] rounded-2xl shadow-xl z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isAnchor = link.path.startsWith('/#');
                return isAnchor ? (
                  <a
                    key={link.label}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-[#1D1D1F] py-2 px-3 rounded-xl hover:bg-black/5 hover:text-[#FF5F1F] transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium py-2 px-3 rounded-xl transition ${
                      isActive(link.path)
                        ? 'text-[#FF5F1F] bg-[#FF5F1F]/10 font-semibold'
                        : 'text-[#1D1D1F] hover:bg-black/5 hover:text-[#FF5F1F]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#E8E8E6] flex items-center justify-between gap-3">
              <button
                onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E8E6] bg-[#FAFAF8] text-xs font-semibold text-[#1D1D1F]"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF5F1F]" />
                <span>{language === 'EN' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
              </button>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#1D1D1F] hover:text-[#FF5F1F] px-3 py-2 rounded-xl transition-colors"
              >
                {t.common.login}
              </Link>
            </div>
            <div className="pt-1">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block text-xs font-semibold bg-[#FF5F1F] hover:bg-[#EC5800] text-white px-4 py-2.5 rounded-full shadow-[0_2px_8px_rgba(255,95,31,0.25)] transition-all"
              >
                {t.common.bookBuddy}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
