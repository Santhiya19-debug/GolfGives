'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [newsletter, setNewsletter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterDone(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero header — reference style */}
        <section className="bg-mist-100 py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 text-brand-200 text-4xl font-bold opacity-30 rotate-12">››</div>
            <div className="absolute top-4 right-8 text-brand-200 text-4xl font-bold opacity-30 -rotate-12">‹‹</div>
            <div className="absolute bottom-4 left-16 text-brand-200 text-4xl font-bold opacity-30 rotate-6">›</div>
            <div className="absolute bottom-4 right-16 text-brand-200 text-4xl font-bold opacity-30 -rotate-6">‹</div>
          </div>
          <div className="relative max-w-2xl mx-auto px-4">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-navy-800 mb-4">Contact Us</h1>
            <div className="w-16 h-1 bg-brand-400 mx-auto mb-5 rounded-full" />
            <p className="text-brand-500 text-lg leading-relaxed">
              Got a question about subscriptions, draws, or charities? We'd love to hear from you. Reach out and our team will respond within one business day.
            </p>
          </div>
        </section>

        {/* Trust logos strip — reference style */}
        <section className="border-y border-mist-200 py-6 bg-white">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-10">
            {['Golf Weekly', 'Charity Times', 'GolfDigest', 'SportsGiving'].map((name) => (
              <div key={name} className="text-navy-700 font-display font-bold text-lg opacity-40 hover:opacity-70 transition-opacity">
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Main contact section — matches reference layout */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-10">

              {/* Left: Contact form */}
              <div>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <CheckCircle className="w-14 h-14 text-brand-500 mb-4" />
                    <h3 className="font-display font-bold text-2xl text-navy-800 mb-2">Message sent!</h3>
                    <p className="text-brand-500">We'll get back to you within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                    <textarea
                      placeholder="Message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field resize-none"
                      rows={6}
                      required
                    />
                    <button type="submit" className="btn-primary gap-2">
                      <Send className="w-4 h-4" />
                      Submit Message
                    </button>
                  </form>
                )}
              </div>

              {/* Right: Newsletter card — reference style dark card */}
              <div>
                <div className="bg-navy-800 text-white rounded-2xl p-8 h-full flex flex-col">
                  <h3 className="font-display font-bold text-2xl mb-3">Our Newsletters</h3>
                  <p className="text-brand-200 text-sm leading-relaxed mb-6 flex-1">
                    Stay up to date with draw results, charity highlights, platform updates, and golf news. Delivered monthly — no spam, ever.
                  </p>

                  {newsletterDone ? (
                    <div className="flex items-center gap-2 text-brand-400 text-sm">
                      <CheckCircle className="w-5 h-5" />
                      You're subscribed! Check your inbox.
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletter} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email"
                        value={newsletter}
                        onChange={(e) => setNewsletter(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
                      >
                        Subscribe to Newsletter
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact info cards — reference style 3-card row */}
        <section className="pb-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Phone,
                  title: '(+876) 765 665',
                  desc: 'Mon–Fri 9am–6pm GMT. We aim to respond to all calls and voicemails within 4 hours.',
                },
                {
                  icon: Mail,
                  title: 'hello@golfgives.com',
                  desc: 'Email us for any enquiry. Response time is within one working day for all messages.',
                },
                {
                  icon: MapPin,
                  title: 'London Eye, London',
                  desc: 'GolfGives HQ, Riverside Building, County Hall, London SE1 7PB, United Kingdom.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-mist flex items-start gap-4 hover:shadow-card transition-shadow">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-800 mb-1">{title}</h4>
                    <p className="text-sm text-brand-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map placeholder — reference style */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl overflow-hidden border border-mist-200 h-72 bg-mist-100 flex items-center justify-center relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.7597846665095!2d-0.12139268422958637!3d51.50326797963498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLondon%20Eye!5e0!3m2!1sen!2suk!4v1648551228764!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GolfGives location"
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}