import { UserPlus, ClipboardList, Shuffle, Trophy, Heart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Subscribe & Choose',
    description: 'Pick a monthly or yearly plan. Select a charity to receive a portion of your subscription — minimum 10%, you choose how much.',
  },
  {
    icon: ClipboardList,
    number: '02',
    title: 'Enter Your Scores',
    description: 'Log your last 5 Stableford scores (1–45). The system keeps your rolling history automatically — newest in, oldest out.',
  },
  {
    icon: Shuffle,
    number: '03',
    title: 'Monthly Draw',
    description: 'Every month, 5 numbers are drawn — randomly or by algorithm. Your scores are compared against the draw automatically.',
  },
  {
    icon: Trophy,
    number: '04',
    title: 'Win Prizes',
    description: 'Match 3, 4, or 5 numbers to win a share of the prize pool. The jackpot rolls over if no 5-match winner is found.',
  },
  {
    icon: Heart,
    number: '05',
    title: 'Fund a Cause',
    description: 'A guaranteed portion of every subscription goes directly to your chosen charity — every round, every month.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="section-label">Simple by design</p>
          <h2 className="section-title">How GolfGives works</h2>
          <p className="mt-4 text-brand-500 text-lg max-w-xl mx-auto">
            Five easy steps. One platform. Real impact.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-full h-px bg-mist-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center text-center group">
                  {/* Step circle */}
                  <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center mb-5
                                  group-hover:bg-brand-600 transition-colors duration-200 shadow-soft">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-bold text-brand-300 mb-2 tracking-widest">{step.number}</span>
                  <h3 className="font-display font-semibold text-navy-800 text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-brand-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}