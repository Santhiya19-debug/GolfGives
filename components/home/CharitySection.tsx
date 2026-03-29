import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

const charities = [
  {
    name: "Children's Golf Foundation",
    description: 'Bringing golf to underprivileged youth across the UK. Every subscription helps fund coaching sessions and equipment.',
    raised: '£14,200',
    members: 312,
    featured: true,
  },
  {
    name: 'Green Hearts Cancer Trust',
    description: 'Funding research and patient support through golf charity events. Making a difference one round at a time.',
    raised: '£9,800',
    members: 198,
    featured: false,
  },
  {
    name: 'Veterans on the Fairway',
    description: 'Golf therapy programmes supporting military veterans with recovery and community reintegration.',
    raised: '£7,450',
    members: 145,
    featured: false,
  },
  {
    name: 'Girls in Golf Initiative',
    description: 'Empowering young women to take up golf and build confidence through sport and leadership.',
    raised: '£6,100',
    members: 121,
    featured: false,
  },
];

export default function CharitySection() {
  return (
    <section id="charities" className="py-24 bg-mist-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="md:flex md:items-end md:justify-between mb-14">
          <div>
            <p className="section-label">Give back</p>
            <h2 className="section-title">Charities we support</h2>
            <p className="mt-4 text-brand-500 max-w-lg">
              Choose a cause you're passionate about. A portion of every subscription goes directly to your chosen charity each month.
            </p>
          </div>
          <Link href="/signup" className="btn-primary mt-6 md:mt-0 whitespace-nowrap">
            Choose Your Charity <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {charities.map((charity) => (
            <div
              key={charity.name}
              className={`card hover:shadow-card-hover transition-shadow duration-200 flex flex-col ${
                charity.featured ? 'ring-2 ring-brand-400 ring-offset-2' : ''
              }`}
            >
              {charity.featured && (
                <div className="flex items-center gap-1 text-brand-500 text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 bg-brand-400 rounded-full" />
                  Featured Charity
                </div>
              )}
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-display font-semibold text-navy-800 text-base mb-2">{charity.name}</h3>
              <p className="text-sm text-brand-500 leading-relaxed flex-1">{charity.description}</p>
              <div className="mt-5 pt-4 border-t border-mist-100 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-base font-bold text-navy-800">{charity.raised}</div>
                  <div className="text-xs text-brand-400">Total raised</div>
                </div>
                <div>
                  <div className="text-base font-bold text-navy-800">{charity.members}</div>
                  <div className="text-xs text-brand-400">Supporters</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}