'use client';

import { useState, useEffect } from 'react'; // 👈 Added useEffect here
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy, Heart, Calendar, Target, TrendingUp, Plus,
  CheckCircle, AlertCircle, LogOut, Trash2, ChevronRight, Star
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatScoreDate } from '@/lib/scoreUtils';
import type { Score, DrawResult, Draw, UserProfile, Charity } from '@/types/database';

interface Props {
  profile: UserProfile & { charities: Charity | null };
  scores: Score[];
  results: (DrawResult & { draws: Draw })[];
  totalWon: number;
  pendingPayout: number;
  latestDraw: Draw | null;
  isWelcome: boolean;
}

export default function DashboardClient({
  profile,
  scores: initialScores,
  results,
  totalWon,
  pendingPayout,
  latestDraw,
  isWelcome,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [scores, setScores] = useState(initialScores);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState('');
  const [scoreSuccess, setScoreSuccess] = useState('');
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  // 🛑 THE CRITICAL FIX: 
  // This tells React to update the screen whenever router.refresh() fetches new data!
  useEffect(() => {
    setScores(initialScores);
  }, [initialScores]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setScoreLoading(true);
    setScoreError('');
    setScoreSuccess('');

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: Number(newScore), date: newDate }),
      });
      const data = await res.json();

      if (!res.ok) {
        setScoreError(data.error || 'Failed to add score');
        return;
      }

      setScoreSuccess('Score added successfully!');
      setNewScore('');
      router.refresh();
    } catch {
      setScoreError('Something went wrong.');
    } finally {
      setScoreLoading(false);
    }
  };

  const handleDeleteScore = async (id: string) => {
    await fetch('/api/scores', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    // This removes it instantly from the screen without waiting for the server
    setScores(scores.filter(s => s.id !== id));
    router.refresh(); // Tell the server to refresh just in case
  };

  const isActive = profile.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-mist-100 flex-col flex-shrink-0 hidden md:flex">
          {/* Logo */}
          <div className="p-6 border-b border-mist-100">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-navy-800">GolfGives</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-5 border-b border-mist-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center font-bold text-brand-600">
                {profile.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-sm text-navy-800 truncate max-w-[130px]">
                  {profile.full_name || 'Golfer'}
                </div>
                <div className={`badge mt-0.5 ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {profile.subscription_status}
                </div>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { icon: TrendingUp, label: 'Overview',     href: '#overview' },
              { icon: Target,     label: 'My Scores',    href: '#scores' },
              { icon: Trophy,     label: 'Draw Results', href: '#draws' },
              { icon: Heart,      label: 'My Charity',   href: '#charity' },
              { icon: Calendar,   label: 'Subscription', href: '#subscription' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-600
                           hover:bg-mist-50 hover:text-brand-700 transition-colors text-sm font-medium"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-mist-100">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-400
                         hover:bg-red-50 hover:text-red-500 transition-colors text-sm font-medium w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

            {/* Welcome banner */}
            {isWelcome && !welcomeDismissed && (
              <div className="bg-brand-500 text-white rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">
                      Welcome to GolfGives, {profile.full_name?.split(' ')[0]}! 🎉
                    </div>
                    <div className="text-brand-100 text-sm">
                      Your account is active. Start entering your scores.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setWelcomeDismissed(true)}
                  className="text-brand-200 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
            )}

            {/* Page header */}
            <div id="overview">
              <h1 className="font-display text-2xl font-bold text-navy-800">My Dashboard</h1>
              <p className="text-brand-500 text-sm mt-1">Track your scores, draws, and impact.</p>
            </div>

            {/* Inactive subscription alert */}
            {!isActive && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <div className="font-semibold text-amber-800 text-sm">No active subscription</div>
                  <div className="text-amber-700 text-xs">
                    Subscribe to enter scores and participate in draws.
                  </div>
                </div>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">Subscribe</Link>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="stat-value">£{totalWon.toFixed(0)}</div>
                <div className="stat-label">Total won</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">£{pendingPayout.toFixed(0)}</div>
                <div className="stat-label">Pending payout</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{scores.length}/5</div>
                <div className="stat-label">Scores entered</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{results.length}</div>
                <div className="stat-label">Draws entered</div>
              </div>
            </div>

            {/* Score Entry + History */}
            <div id="scores" className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-semibold text-navy-800 text-lg">My Scores</h2>
                  <p className="text-xs text-brand-400 mt-0.5">
                    Rolling last 5 scores — Stableford format (1–45)
                  </p>
                </div>
                <div className="badge badge-active">{scores.length}/5 stored</div>
              </div>

              {/* Add score form — only shown to active subscribers */}
              {isActive && (
                <form onSubmit={handleAddScore} className="flex gap-3 mb-5 p-4 bg-mist-50 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-navy-700 mb-1">
                      Score (1–45)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      className="input-field py-2 text-sm"
                      placeholder="e.g. 32"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-navy-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="input-field py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={scoreLoading}
                      className="btn-primary py-2 px-4 text-sm disabled:opacity-60"
                    >
                      <Plus className="w-4 h-4" />
                      {scoreLoading ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </form>
              )}

              {/* Feedback messages */}
              {scoreError && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-3 p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-4 h-4" /> {scoreError}
                </div>
              )}
              {scoreSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm mb-3 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-4 h-4" /> {scoreSuccess}
                </div>
              )}

              {/* Score list */}
              {scores.length === 0 ? (
                <div className="text-center py-10 text-brand-400 text-sm">
                  No scores yet. Add your first Stableford score above.
                </div>
              ) : (
                <div className="space-y-2">
                  {scores.map((score, i) => (
                    <div
                      key={score.id}
                      className="flex items-center justify-between py-3 px-4 bg-mist-50 rounded-xl
                                 hover:bg-mist-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-brand-400 font-medium w-4">#{i + 1}</div>
                        <div className="text-sm font-semibold text-navy-800">
                          {formatScoreDate(score.date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center font-bold text-base">
                          {score.score}
                        </div>
                        <button
                          onClick={() => handleDeleteScore(score.id)}
                          className="text-brand-300 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Draw Results */}
            <div id="draws" className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-navy-800 text-lg">Draw Results</h2>
                {latestDraw && (
                  <div className="flex gap-1.5">
                    {latestDraw.numbers.map((n) => (
                      <div
                        key={n}
                        className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center text-xs font-bold"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10 text-brand-400 text-sm">
                  No draw results yet. Results appear after each monthly draw.
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 border border-mist-100 rounded-xl"
                    >
                      <div>
                        <div className="text-sm font-semibold text-navy-800">
                          {result.draws?.result_date
                            ? formatScoreDate(result.draws.result_date)
                            : 'Draw'}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {result.draws?.numbers?.map((n: number) => (
                            <span
                              key={n}
                              className="text-xs bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-navy-800">{result.matches} matches</div>
                        <div className="text-sm text-brand-500">
                          £{result.prize_amount.toFixed(2)}
                        </div>
                        <div className={`badge mt-1 ${
                          result.payment_status === 'paid' ? 'badge-active' : 'badge-pending'
                        }`}>
                          {result.payment_status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Charity */}
            <div id="charity" className="card">
              <h2 className="font-display font-semibold text-navy-800 text-lg mb-4">My Charity</h2>
              {profile.charities ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy-800">{profile.charities.name}</div>
                    <div className="text-sm text-brand-500 mt-1">
                      {profile.charities.description}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-brand-400">Contribution: </span>
                        <span className="font-bold text-brand-600">
                          {profile.contribution_percentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-400">Total raised: </span>
                        <span className="font-bold text-emerald-600">
                          £{profile.charities.total_raised?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-brand-400 text-sm">
                  No charity selected.{' '}
                  <Link href="/signup" className="text-brand-500 font-semibold">
                    Update profile
                  </Link>
                </div>
              )}
            </div>

            {/* Subscription */}
            <div id="subscription" className="card">
              <h2 className="font-display font-semibold text-navy-800 text-lg mb-4">
                Subscription
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card-mist">
                  <div className="text-xs text-brand-400 mb-1">Status</div>
                  <div className={`badge ${isActive ? 'badge-active' : 'badge-inactive'} text-sm`}>
                    {profile.subscription_status}
                  </div>
                </div>
                <div className="card-mist">
                  <div className="text-xs text-brand-400 mb-1">Plan</div>
                  <div className="font-semibold text-navy-800 capitalize">
                    {profile.plan_type || '—'}
                  </div>
                </div>
                <div className="card-mist">
                  <div className="text-xs text-brand-400 mb-1">Renews</div>
                  <div className="font-semibold text-navy-800">
                    {profile.renewal_date ? formatScoreDate(profile.renewal_date) : '—'}
                  </div>
                </div>
              </div>
              {!isActive && (
                <Link href="/signup" className="btn-primary mt-4 inline-flex">
                  Reactivate Subscription <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}