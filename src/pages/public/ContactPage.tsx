import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addEnquiry } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addEnquiry({
      name,
      email,
      phone,
      subject: subject || 'General Travel Enquiry',
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="layout-container py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron">
          Varanasi Helpdesk & Operations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-river">
          Connect With Us
        </h1>
        <p className="text-sm text-charcoal-light leading-relaxed">
          Have special travel requirements, elderly assistance questions, or want to partner with TravelOnBuddy in Kashi? Our Varanasi on-ground team is here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white p-7 rounded-2xl border border-sand-border space-y-6">
            <h3 className="font-serif text-xl font-bold text-river">
              Varanasi Regional Office
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">Address</span>
                  <span className="text-charcoal-muted leading-relaxed">
                    Assi Ghat Road, Near Tulsi Mandir, Bhelupur, Varanasi, Uttar Pradesh 221005
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">Email</span>
                  <span className="text-charcoal-muted">kashi@travelonbuddy.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-river block">Direct Line</span>
                  <span className="text-charcoal-muted">+91 542 227 8901 (8 AM – 8 PM)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sand/60 p-6 rounded-2xl border border-sand-border space-y-2 text-xs">
            <h4 className="font-bold text-river">Emergency / Immediate Assistance</h4>
            <p className="text-charcoal-muted leading-relaxed">
              If your scheduled trip is within the next 24 hours, our companion coordination desk can be reached directly via WhatsApp upon assignment.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-sand-border shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-saffron-muted text-saffron-light flex items-center justify-center mx-auto border border-saffron/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-river">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-charcoal-light max-w-md mx-auto">
                  Thank you for reaching out. Your enquiry has been routed to our Varanasi operations queue.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-deep-orange transition shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-river mb-2">
                  Send an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-river block">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shalini Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-sand-border text-xs focus:outline-none focus:border-saffron"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-river block">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-sand-border text-xs focus:outline-none focus:border-saffron"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-river block">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-sand-border text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-river block">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior citizen tour inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-sand-border text-xs focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-river block">Message Details</label>
                    <textarea
                      rows={5}
                      placeholder="Please let us know how we can assist with your Varanasi journey..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-sand-border text-xs focus:outline-none focus:border-saffron"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-deep-orange flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
