import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, Sun, CheckCircle2, ArrowRight, ShieldCheck, Share2 } from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { destinations, showToast, language } = useApp();

  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'HI' ? 'स्थान लिंक कॉपी किया गया!' : 'Destination link copied to clipboard!');
    }
  };

  const displayName = language === 'HI' && destination.hindiName ? destination.hindiName : destination.name;

  return (
    <div className="layout-container py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-charcoal-muted">
        <Link to="/" className="hover:text-river">{language === 'HI' ? 'होम' : 'Home'}</Link>
        <span>/</span>
        <Link to="/destinations" className="hover:text-river">{language === 'HI' ? 'गंतव्य' : 'Destinations'}</Link>
        <span>/</span>
        <span className="text-river font-semibold">{displayName}</span>
      </div>

      {/* Main Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-sand-border">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-light-orange text-deep-orange text-xs font-bold uppercase tracking-wider border border-saffron/20">
              {destination.category}
            </span>
            {destination.hindiName && language === 'EN' && (
              <span className="font-serif text-sm font-semibold text-saffron">
                {destination.hindiName}
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-river">
            {displayName}
          </h1>
          <p className="text-base text-charcoal-light leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            onClick={handleShare}
            className="p-3 rounded-xl border border-sand-border text-charcoal hover:bg-sand transition"
            title="Share Destination"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            to={`/book?destination=${encodeURIComponent(destination.name)}`}
            className="px-6 py-3 rounded-xl bg-saffron text-white font-semibold text-sm hover:bg-saffron-light shadow transition flex items-center gap-2"
          >
            <span>{language === 'HI' ? 'इस स्थान के लिए बडी बुक करें' : 'Book Buddy for This Site'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl overflow-hidden max-h-[500px]">
        <div className="lg:col-span-2 h-[320px] lg:h-[500px] overflow-hidden bg-sand">
          <img
            src={destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
          {destination.gallery.slice(1, 3).map((img, idx) => (
            <div key={idx} className="h-[150px] lg:h-[242px] overflow-hidden bg-sand rounded-xl lg:rounded-none">
              <img
                src={img}
                alt={`${destination.name} gallery ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Description & Key Planning Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-7 rounded-2xl border border-sand-border space-y-4">
            <h2 className="font-serif text-2xl font-bold text-river">
              {language === 'HI' ? 'ऐतिहासिक एवं सांस्कृतिक महत्व' : 'Historical & Cultural Significance'}
            </h2>
            <p className="text-sm text-charcoal-light leading-relaxed">
              {destination.longDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-white p-7 rounded-2xl border border-sand-border space-y-4">
            <h3 className="font-serif text-xl font-bold text-river">
              {language === 'HI' ? 'अपने बडी के साथ आप क्या अनुभव करेंगे' : 'What You Will Experience With Your Buddy'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-charcoal-light">
                  <CheckCircle2 className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Highlights & Activities */}
          <div className="bg-white p-7 rounded-2xl border border-sand-border space-y-4">
            <h3 className="font-serif text-xl font-bold text-river">
              {language === 'HI' ? 'उपलब्ध स्थानीय गतिविधियाँ' : 'Available Local Activities'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {destination.availableExperiences.map((exp, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-ivory text-river text-xs font-semibold border border-sand-border"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-border shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-river border-b border-sand-border pb-3">
              {language === 'HI' ? 'यात्री जानकारी' : 'Visitor Information'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">{language === 'HI' ? 'स्थान' : 'Location'}</span>
                  <span className="text-charcoal-muted">{destination.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">{language === 'HI' ? 'सुझाई गई अवधि' : 'Suggested Duration'}</span>
                  <span className="text-charcoal-muted">{destination.suggestedDuration}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sun className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">{language === 'HI' ? 'उत्तम समय' : 'Recommended Time'}</span>
                  <span className="text-charcoal-muted">{destination.bestTimeToVisit}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">{language === 'HI' ? 'साथी उपलब्धता' : 'Companion Readiness'}</span>
                  <span className="text-charcoal-muted">
                    {language === 'HI'
                      ? 'पैदल यात्रा और मार्गदर्शन के लिए सत्यापित स्थानीय साथी उपलब्ध हैं।'
                      : 'Verified local companions available for walking & assistance.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-border">
              <Link
                to={`/book?destination=${encodeURIComponent(destination.name)}`}
                className="w-full py-3 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-deep-orange transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>{language === 'HI' ? `${displayName} के लिए बडी का अनुरोध करें` : `Request Buddy for ${destination.name}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
