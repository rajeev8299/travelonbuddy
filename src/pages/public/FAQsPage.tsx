import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/mockData';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0].id);
  const [query, setQuery] = useState('');

  const categories = ['All', 'General', 'Booking & Buddies', 'Safety', 'Pricing & Cancellation'];

  const filtered = FAQS_DATA.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 sm:py-24">
      <div className="layout-container space-y-12 sm:space-y-16">
        
        {/* Editorial Apple-style Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F] block">
            Questions & Answers
          </span>
          <h1 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F]">
            Frequently Asked Questions.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed">
            Everything you need to know about our companion discovery, verified safety standards, transparent pricing, and effortless booking.
          </p>
        </div>

        {/* Minimalist Apple-Style Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1D1D1F] text-white shadow-sm'
                    : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E8E8E6] hover:border-[#1D1D1F]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Minimalist Hairline Accordions */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E6] divide-y divide-[#E8E8E6]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#6E6E73] text-sm">
              No matching questions found.
            </div>
          ) : (
            filtered.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="py-5 sm:py-6 first:pt-0 last:pb-0 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left flex items-center justify-between gap-6 group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-lg font-medium transition-colors ${
                        isOpen ? 'text-[#FF5F1F]' : 'text-[#1D1D1F] group-hover:text-[#FF5F1F]'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 border ${
                        isOpen
                          ? 'rotate-180 bg-[#FF5F1F] text-white border-[#FF5F1F]'
                          : 'bg-[#F5F5F3] text-[#1D1D1F] border-[#E8E8E6] group-hover:border-[#FF5F1F]/40'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 pt-3'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm sm:text-base text-[#6E6E73] font-light leading-relaxed pr-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Minimalist Support Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E8E6] text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#1D1D1F]">
            Still have questions?
          </h3>
          <p className="text-sm text-[#6E6E73] font-light max-w-md mx-auto leading-relaxed">
            Our team is always available to help design custom walking routes, temple visits, or address unique travel requirements.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5F1F] text-white text-xs font-semibold hover:bg-[#EC5800] transition-all shadow-sm active:scale-95"
            >
              <span>Speak with Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
