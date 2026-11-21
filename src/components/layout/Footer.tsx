import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-[#FAFAF8] text-[#6E6E73] border-t border-[#E8E8E6] pt-16 pb-12">
      <div className="layout-container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#E8E8E6]">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="TravelOnBuddy" className="h-7 w-auto object-contain" />
              <span className="font-sans text-base font-semibold text-[#1D1D1F] tracking-tight">
                TravelOn<span className="text-[#FF5F1F]">Buddies</span>
              </span>
            </Link>
            <p className="text-xs text-[#6E6E73] max-w-sm leading-relaxed font-light">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">{t.footer.exploreTitle}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/destinations" className="hover:text-[#1D1D1F] transition">Famous Ghats</Link></li>
              <li><Link to="/destinations/kashi-vishwanath-temple" className="hover:text-[#1D1D1F] transition">Ancient Temples</Link></li>
              <li><Link to="/destinations/sarnath" className="hover:text-[#1D1D1F] transition">Sarnath Deer Park</Link></li>
              <li><Link to="/experiences" className="hover:text-[#1D1D1F] transition">{t.navbar.experiences}</Link></li>
            </ul>
          </div>

          {/* TravelOnBuddy */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">{t.footer.platformTitle}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/buddies" className="hover:text-[#1D1D1F] transition">{t.navbar.findBuddy}</Link></li>
              <li><Link to="/about" className="hover:text-[#1D1D1F] transition">{t.navbar.about}</Link></li>
              <li><Link to="/safety" className="hover:text-[#1D1D1F] transition">{t.footer.safetyTrust}</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition">{t.navbar.contact}</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">{t.footer.connectTitle}</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#1D1D1F] transition">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#1D1D1F] transition">X (Twitter)</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#1D1D1F] transition">YouTube</a></li>
              <li><Link to="/admin/dashboard" className="text-[#F28C28] hover:underline">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868B]">
          <div>
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#1D1D1F] transition">{t.footer.privacy}</Link>
            <Link to="/terms-conditions" className="hover:text-[#1D1D1F] transition">{t.footer.terms}</Link>
            <Link to="/cancellation-policy" className="hover:text-[#1D1D1F] transition">{t.footer.cancellation}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
