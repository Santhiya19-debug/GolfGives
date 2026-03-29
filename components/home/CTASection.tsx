import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'Monthly & yearly subscription plans',
  'Stableford score tracking (rolling 5)',
  'Algorithm or random monthly draws',
  'Choose your charity & set contribution %',
  'Win 3, 4, or 5 number match prizes',
  'Jackpot rolls over if unclaimed',
];

export default function CTASection() {
  return (
    <section className="py-24 bg-navy-800 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Get started today</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Ready to play for a purpose?
            </h2>
            <p className="text-brand-200 text-lg leading-relaxed mb-8">
              Join thousands of golfers who are turning their hobby into a force for good. Subscribe, score, and support a charity — all from one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="btn-primary text-base px-8 py-4">
                Subscribe Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors duration-150 font-medium text-base">
                Learn More
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly plan */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-brand-400 transition-colors">
              <div className="text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">Monthly</div>
              <div className="text-3xl font-display font-bold text-white mb-1">£9.99<span className="text-base font-normal text-brand-300">/mo</span></div>
              <p className="text-brand-300 text-sm mb-4">Billed monthly. Cancel anytime.</p>
              <Link href="/signup?plan=monthly" className="btn-ghost border-white/20 text-white hover:bg-white/10 w-full text-sm text-center block">
                Get Monthly
              </Link>
            </div>

            {/* Yearly plan */}
            <div className="bg-brand-500 rounded-2xl p-6 border border-brand-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="text-brand-100 text-xs font-semibold uppercase tracking-wider mb-3">Yearly</div>
              <div className="text-3xl font-display font-bold text-white mb-1">£99.99<span className="text-base font-normal text-brand-100">/yr</span></div>
              <p className="text-brand-100 text-sm mb-4">Save ~17% vs monthly.</p>
              <Link href="/signup?plan=yearly" className="inline-flex w-full text-center justify-center items-center px-4 py-2.5 bg-white text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors text-sm">
                Get Yearly
              </Link>
            </div>

            {/* Benefits list */}
            <div className="sm:col-span-2">
              <ul className="space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-brand-200">
                    <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}