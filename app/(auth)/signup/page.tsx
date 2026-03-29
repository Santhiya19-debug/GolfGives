'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy, Eye, EyeOff, AlertCircle, CheckCircle, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Charity } from '@/types/database';
import { SUBSCRIPTION_PRICES, MIN_CHARITY_PERCENTAGE } from '@/lib/scoreUtils';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState(1); // 1=account, 2=plan, 3=charity
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    planType: searchParams.get('plan') || 'monthly',
    charityId: '',
    contributionPercentage: MIN_CHARITY_PERCENTAGE,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  console.log("charities:", charities)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchCharities = async () => {
    const { data, error } = await supabase
      .from('charities')
      .select('*');

    if (error) {
      console.error("Supabase error:", error.message);
      setError("Failed to load charities");
      return;
    }

    console.log("Fetched charities:", data);
    setCharities(data || []);
  };

  fetchCharities();
}, []);

  const update = (field: string, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignup = async () => {
    if (!formData.charityId) { setError('Please select a charity.'); return; }
    setLoading(true);
    setError('');
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } },
      });
      if (authError) { setError(authError.message); return; }

      // 2. Create subscription record via API route
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authData.user!.id,
          planType: formData.planType,
          charityId: formData.charityId,
          contributionPercentage: formData.contributionPercentage,
        }),
      });

      router.push('/dashboard?welcome=1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-navy-800">GolfGives</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-navy-800">Create your account</h1>
          <p className="text-brand-500 mt-2">Join the platform in 3 simple steps</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-brand-500 text-white' : 'bg-mist-200 text-brand-400'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-px ${step > s ? 'bg-brand-500' : 'bg-mist-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 text-xs text-brand-400 mb-8">
          <span className={step === 1 ? 'text-brand-600 font-semibold' : ''}>Account</span>
          <span className={step === 2 ? 'text-brand-600 font-semibold' : ''}>Plan</span>
          <span className={step === 3 ? 'text-brand-600 font-semibold' : ''}>Charity</span>
        </div>

        <div className="card shadow-card">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-navy-800 mb-4">Your details</h2>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className="input-field"
                  placeholder="James Anderson"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="input-field pr-10"
                    placeholder="Min 8 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
                Continue to Plan →
              </button>
            </form>
          )}

          {/* Step 2: Plan Selection */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-navy-800 mb-5">Choose your plan</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(['monthly', 'yearly'] as const).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => update('planType', plan)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      formData.planType === plan
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-mist-200 bg-white hover:border-brand-200'
                    }`}
                  >
                    {plan === 'yearly' && (
                      <div className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                        SAVE 17%
                      </div>
                    )}
                    <div className="capitalize font-semibold text-navy-800 text-sm mb-1">{plan}</div>
                    <div className="font-display font-bold text-navy-800 text-xl">
                      £{SUBSCRIPTION_PRICES[plan]}
                      <span className="text-xs font-normal text-brand-400">/{plan === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <div className="text-xs text-brand-400 mt-1">
                      {plan === 'monthly' ? 'Cancel anytime' : 'Best value'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Contribution info */}
              <div className="card-mist mb-5 text-sm text-brand-600">
                <div className="font-semibold text-navy-800 mb-1">Where your money goes:</div>
                <div className="flex justify-between"><span>Charity contribution (10%+)</span><span className="font-semibold">£{(SUBSCRIPTION_PRICES[formData.planType as 'monthly' | 'yearly'] * 0.1).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Prize pool</span><span className="font-semibold">£{(SUBSCRIPTION_PRICES[formData.planType as 'monthly' | 'yearly'] * 0.9).toFixed(2)}</span></div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continue to Charity →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Charity Selection */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-navy-800 mb-2">Choose your charity</h2>
              <p className="text-sm text-brand-500 mb-5">
                Minimum 10% of your subscription goes here each month.
              </p>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {charities.map((charity) => (
                  <button
                    key={charity.id}
                    onClick={() => update('charityId', charity.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      formData.charityId === charity.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-mist-200 bg-white hover:border-brand-200'
                    }`}
                  >
                    <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-navy-800">{charity.name}</div>
                      <div className="text-xs text-brand-400 line-clamp-1">{charity.description}</div>
                    </div>
                    {formData.charityId === charity.id && (
                      <CheckCircle className="w-5 h-5 text-brand-500 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Contribution slider */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Contribution percentage: <span className="text-brand-500 font-bold">{formData.contributionPercentage}%</span>
                </label>
                <input
                  type="range"
                  min={MIN_CHARITY_PERCENTAGE}
                  max={50}
                  value={formData.contributionPercentage}
                  onChange={(e) => update('contributionPercentage', Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-brand-400 mt-1">
                  <span>10% (min)</span>
                  <span>50% (max)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1">← Back</button>
                <button
                  onClick={handleSignup}
                  disabled={loading || !formData.charityId}
                  className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Complete Signup'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-brand-400 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}