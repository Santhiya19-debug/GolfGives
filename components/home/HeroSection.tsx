'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Trophy, Target } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-mist-50 overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-brand-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-50 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-600 rounded-full text-sm font-medium mb-6">
              <Heart className="w-3.5 h-3.5" />
              Play Golf. Give Back. Win Prizes.
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-navy-800 leading-[1.1] mb-6">
              Golf that gives
              <span className="block text-brand-500">back to the world.</span>
            </h1>

            <p className="text-lg text-brand-600 leading-relaxed mb-8 max-w-lg">
              Subscribe, enter your Stableford scores, support a charity you love, and compete in monthly prize draws — all in one platform built for the modern golfer.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="btn-primary text-base px-8 py-4">
                Start Playing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#how-it-works" className="btn-ghost text-base px-8 py-4">
                How It Works
              </Link>
            </div>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-mist-200">
              {[
                { value: '£48K+', label: 'Raised for charity' },
                { value: '2,400+', label: 'Active golfers' },
                { value: '£12K', label: 'Current jackpot' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-display font-bold text-navy-800">{stat.value}</div>
                  <div className="text-sm text-brand-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card stack */}
          <div className="hidden md:block relative">
            <div className="relative h-[480px]">
              {/* Background card */}
              <div className="absolute top-8 right-8 w-64 h-40 bg-brand-200 rounded-3xl rotate-6 opacity-60" />

              {/* Main score card */}
              <div className="absolute top-0 right-0 w-72 card shadow-card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="section-label text-xs mb-0">Latest Scores</span>
                  <Trophy className="w-4 h-4 text-brand-400" />
                </div>
                <div className="space-y-2">
                  {[
                    { score: 34, date: '24 Mar' },
                    { score: 28, date: '17 Mar' },
                    { score: 31, date: '10 Mar' },
                    { score: 36, date: '3 Mar' },
                    { score: 29, date: '24 Feb' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-mist-100 last:border-0">
                      <span className="text-sm text-brand-600">{s.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-sm font-bold text-brand-600">
                          {s.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draw card */}
              <div className="absolute bottom-0 left-0 w-64 card shadow-card-hover">
                <div className="section-label text-xs">Monthly Draw</div>
                <div className="flex gap-2 mt-2 mb-4">
                  {[7, 14, 28, 31, 36].map((n) => (
                    <div
                      key={n}
                      className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center text-sm font-bold"
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-brand-600">Next draw: 1 April</span>
                </div>
              </div>

              {/* Charity badge */}
              <div className="absolute bottom-36 right-0 card shadow-soft py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-navy-700">Children's Golf Foundation</div>
                    <div className="text-xs text-brand-400">Your chosen charity</div>
                  </div>
                </div>
              </div>

              {/* Win badge */}
              <div className="absolute top-32 left-0 card shadow-soft py-3 px-4 bg-brand-500 text-white">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <div>
                    <div className="text-xs font-bold">4 Matches!</div>
                    <div className="text-xs opacity-80">£240 prize</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}