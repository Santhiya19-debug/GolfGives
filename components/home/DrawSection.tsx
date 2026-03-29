import Link from 'next/link';
import { Shuffle, Cpu, Trophy, TrendingUp } from 'lucide-react';

export default function DrawSection() {
  return (
    <section id="draws" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Explanation */}
          <div>
            <p className="section-label">Monthly prize draw</p>
            <h2 className="section-title mb-6">Two ways to draw. One big chance to win.</h2>
            <p className="text-brand-500 leading-relaxed mb-8">
              Every month, 5 numbers are generated and compared to each subscriber's Stableford scores. Match 3 or more numbers to win a share of that month's prize pool.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 card-mist">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shuffle className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-800 mb-1">Random Draw</h4>
                  <p className="text-sm text-brand-500">Standard lottery-style. 5 unique numbers generated from 1–45 at random. Fair for all subscribers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 card-mist">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-800 mb-1">Algorithm Draw</h4>
                  <p className="text-sm text-brand-500">Weighted by platform-wide score frequency. Numbers that appear most across all players have higher draw probability — rewarding active participation.</p>
                </div>
              </div>
            </div>

            <Link href="/signup" className="btn-primary">Join the Next Draw</Link>
          </div>

          {/* Right: Prize pool visualisation */}
          <div>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="section-label text-xs mb-1">April 2026</p>
                  <h3 className="font-display font-bold text-navy-800 text-xl">Prize Pool Breakdown</h3>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="text-center mb-6 py-4 bg-mist-50 rounded-xl">
                <div className="text-4xl font-display font-bold text-navy-800">£12,400</div>
                <div className="text-brand-400 text-sm mt-1">Total prize pool this month</div>
              </div>

              <div className="space-y-4">
                {[
                  { match: '5 Numbers', pool: '40%', amount: '£4,960', rollover: true, color: 'bg-brand-500' },
                  { match: '4 Numbers', pool: '35%', amount: '£4,340', rollover: false, color: 'bg-brand-400' },
                  { match: '3 Numbers', pool: '25%', amount: '£3,100', rollover: false, color: 'bg-brand-300' },
                ].map((tier) => (
                  <div key={tier.match}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy-800">{tier.match}</span>
                        {tier.rollover && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Jackpot Rollover
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-navy-800">{tier.amount}</span>
                        <span className="text-xs text-brand-400 ml-1.5">({tier.pool})</span>
                      </div>
                    </div>
                    <div className="w-full bg-mist-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${tier.color}`}
                        style={{ width: tier.pool }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-mist-100 flex items-center gap-2 text-sm text-brand-500">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Prizes split equally among winners in each tier
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}