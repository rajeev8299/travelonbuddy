import React from 'react';
import { Shield } from 'lucide-react';

export const LegalPages: React.FC<{ type: 'privacy' | 'terms' | 'cancellation' }> = ({ type }) => {
  if (type === 'privacy') {
    return (
      <div className="layout-container py-12 space-y-6">
        <h1 className="font-serif text-3xl font-bold text-river">Privacy Policy</h1>
        <p className="text-xs text-charcoal-muted">Last updated: November 2026</p>
        <div className="bg-white p-8 rounded-3xl border border-sand-border space-y-4 text-xs text-charcoal-light leading-relaxed">
          <p>
            TravelOnBuddy is committed to protecting your privacy. We collect basic contact details (name, email, WhatsApp number) and travel preferences strictly to coordinate your local Varanasi companion booking.
          </p>
          <h3 className="font-serif text-sm font-bold text-river">Data Security & Storage</h3>
          <p>
            We never sell, rent, or trade your personal information with third-party advertisers. Information is only shared with your assigned, verified Travel Buddy for meet-up coordination.
          </p>
          <h3 className="font-serif text-sm font-bold text-river">Cookie & Tracking Standards</h3>
          <p>
            We use minimal functional cookies to preserve your language selection and session preferences.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'terms') {
    return (
      <div className="layout-container py-12 space-y-6">
        <h1 className="font-serif text-3xl font-bold text-river">Terms & Conditions</h1>
        <p className="text-xs text-charcoal-muted">Last updated: November 2026</p>
        <div className="bg-white p-8 rounded-3xl border border-sand-border space-y-4 text-xs text-charcoal-light leading-relaxed">
          <p>
            Welcome to TravelOnBuddy. By submitting a travel companion request, you agree to these Terms and Conditions.
          </p>
          <h3 className="font-serif text-sm font-bold text-river">Role of TravelOnBuddy</h3>
          <p>
            TravelOnBuddy acts as a curated companion coordination platform connecting independent travelers with cultured local companions. Travel Buddies provide local knowledge, navigational assistance, and cultural translation.
          </p>
          <h3 className="font-serif text-sm font-bold text-river">Code of Mutual Respect</h3>
          <p>
            Travelers and companions are required to treat each other with utmost dignity and respect. Any harassment or unlawful conduct will result in immediate termination of the trip and reporting to authorities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container py-12 space-y-6">
      <h1 className="font-serif text-3xl font-bold text-river">Cancellation & Refund Policy</h1>
      <p className="text-xs text-charcoal-muted">Last updated: November 2026</p>
      <div className="bg-white p-8 rounded-3xl border border-sand-border space-y-4 text-xs text-charcoal-light leading-relaxed">
        <p>
          We know travel schedules in holy cities can be unpredictable due to train delays, flights, or family circumstances.
        </p>
        <h3 className="font-serif text-sm font-bold text-river">Cancellation Timeline</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong>More than 24 hours prior to meet-up:</strong> Free cancellation or rescheduling with zero penalty.</li>
          <li><strong>Within 12 to 24 hours:</strong> Small nominal honorarium reserved for the buddy who held their schedule.</li>
          <li><strong>Under 12 hours / No-Show:</strong> Full companion half-day reservation fee applies.</li>
        </ul>
        <h3 className="font-serif text-sm font-bold text-river">How to Cancel</h3>
        <p>
          You can initiate a cancellation directly from your Traveler Dashboard under "My Travel Requests" or by messaging our Varanasi support desk.
        </p>
      </div>
    </div>
  );
};
