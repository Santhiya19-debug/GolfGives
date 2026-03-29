'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy, Users, BarChart3, Heart, Settings, LogOut,
  Shuffle, Cpu, Play, Eye, CheckCircle, X, Plus, Pencil, Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatScoreDate } from '@/lib/scoreUtils';
import type { Charity } from '@/types/database';

type Tab = 'overview' | 'users' | 'draws' | 'charities' | 'winners';

export default function AdminClient({ adminName, users, draws, results, charities: initialCharities, stats }: any) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [drawType, setDrawType] = useState<'random' | 'algorithm'>('random');
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawResult, setDrawResult] = useState<any>(null);
  const [simResult, setSimResult] = useState<any>(null);
  const [charities, setCharities] = useState<Charity[]>(initialCharities);
  const [newCharity, setNewCharity] = useState({ name: '', description: '' });
  const [charityLoading, setCharityLoading] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSimulate = async () => {
    setDrawLoading(true);
    setSimResult(null);
    try {
      const res = await fetch('/api/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawType, simulate: true }),
      });
      const data = await res.json();
      setSimResult(data);
    } finally {
      setDrawLoading(false);
    }
  };

  const handleRunDraw = async () => {
    setDrawLoading(true);
    setDrawResult(null);
    try {
      const res = await fetch('/api/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawType,
          resultDate: new Date().toISOString().split('T')[0],
          simulate: false,
        }),
      });
      const data = await res.json();
      setDrawResult(data);
      router.refresh();
    } finally {
      setDrawLoading(false);
    }
  };

  const handlePublishDraw = async (drawId: string) => {
    await fetch('/api/draws', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawId }),
    });
    router.refresh();
  };

  const handleVerifyWinner = async (resultId: string, verified: boolean) => {
    await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId, verified }),
    });
    router.refresh();
  };

  const handleMarkPaid = async (resultId: string) => {
    await fetch('/api/admin/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId }),
    });
    router.refresh();
  };

  const handleAddCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCharityLoading(true);
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCharity),
      });
      const data = await res.json();
      if (data.charity) {
        setCharities([...charities, data.charity]);
        setNewCharity({ name: '', description: '' });
      }
    } finally {
      setCharityLoading(false);
    }
  };

  const handleDeleteCharity = async (id: string) => {
    await fetch('/api/admin/charities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setCharities(charities.filter((c: Charity) => c.id !== id));
  };

  const navItems: { id: Tab; icon: any; label: string }[] = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'draws', icon: Shuffle, label: 'Draw Engine' },
    { id: 'winners', icon: Trophy, label: 'Winners' },
    { id: 'charities', icon: Heart, label: 'Charities' },
  ];

  return (
    <div className="min-h-screen bg-mist-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold">GolfGives</span>
          </Link>
          <div className="mt-3 text-xs text-brand-300 flex items-center gap-1.5">
            <Settings className="w-3 h-3" /> Admin Panel
          </div>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="text-sm font-semibold text-white">{adminName || 'Admin'}</div>
          <div className="badge badge-active text-xs mt-1">Administrator</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-brand-500 text-white'
                  : 'text-brand-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-navy-800">Dashboard Overview</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, color: 'text-navy-800' },
                  { label: 'Active Subscribers', value: stats.activeUsers, color: 'text-emerald-600' },
                  { label: 'Prize Pool', value: `£${stats.totalPool.toFixed(0)}`, color: 'text-brand-600' },
                  { label: 'Charity Raised', value: `£${stats.totalCharity.toFixed(0)}`, color: 'text-rose-600' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`stat-value ${s.color}`}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent users */}
              <div className="card">
                <h2 className="font-display font-semibold text-navy-800 mb-4">Recent Signups</h2>
                <div className="space-y-2">
                  {users.slice(0, 5).map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between py-2 border-b border-mist-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-navy-800">{u.full_name || 'No name'}</div>
                        <div className="text-xs text-brand-400">{u.email}</div>
                      </div>
                      <div className={`badge ${u.subscription_status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {u.subscription_status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-5 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-navy-800">User Management</h1>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-mist-100">
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Name</th>
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Email</th>
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Plan</th>
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Charity</th>
                      <th className="text-left py-3 px-2 text-brand-400 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-mist-50 hover:bg-mist-50 transition-colors">
                        <td className="py-3 px-2 font-medium text-navy-800">{u.full_name || '—'}</td>
                        <td className="py-3 px-2 text-brand-500">{u.email}</td>
                        <td className="py-3 px-2 capitalize">{u.plan_type || '—'}</td>
                        <td className="py-3 px-2">
                          <span className={`badge ${u.subscription_status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                            {u.subscription_status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-brand-500 text-xs">{u.charities?.name || '—'}</td>
                        <td className="py-3 px-2 text-brand-400 text-xs">{formatScoreDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Draw Engine */}
          {activeTab === 'draws' && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-navy-800">Draw Engine</h1>

              {/* Draw config */}
              <div className="card">
                <h2 className="font-semibold text-navy-800 mb-4">Configure Draw</h2>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <button
                    onClick={() => setDrawType('random')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      drawType === 'random' ? 'border-brand-500 bg-brand-50' : 'border-mist-200 hover:border-brand-200'
                    }`}
                  >
                    <Shuffle className="w-5 h-5 text-brand-500 mb-2" />
                    <div className="font-semibold text-navy-800 text-sm">Random Draw</div>
                    <div className="text-xs text-brand-400 mt-1">5 random numbers, 1–45</div>
                  </button>
                  <button
                    onClick={() => setDrawType('algorithm')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      drawType === 'algorithm' ? 'border-brand-500 bg-brand-50' : 'border-mist-200 hover:border-brand-200'
                    }`}
                  >
                    <Cpu className="w-5 h-5 text-brand-500 mb-2" />
                    <div className="font-semibold text-navy-800 text-sm">Algorithm Draw</div>
                    <div className="text-xs text-brand-400 mt-1">Weighted by score frequency</div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSimulate}
                    disabled={drawLoading}
                    className="btn-ghost flex items-center gap-2 disabled:opacity-60"
                  >
                    <Eye className="w-4 h-4" />
                    Simulate (Preview)
                  </button>
                  <button
                    onClick={handleRunDraw}
                    disabled={drawLoading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    <Play className="w-4 h-4" />
                    {drawLoading ? 'Running...' : 'Run Official Draw'}
                  </button>
                </div>

                {/* Simulation result */}
                {simResult && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Simulation Preview</div>
                    <div className="flex gap-2">
                      {simResult.numbers?.map((n: number) => (
                        <div key={n} className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official draw result */}
                {drawResult && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-xs font-bold text-emerald-700 uppercase mb-2">Draw Complete</div>
                    <div className="flex gap-2 mb-3">
                      {drawResult.numbers?.map((n: number) => (
                        <div key={n} className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center font-bold">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-brand-400">Winners:</span> <strong>{drawResult.winners}</strong></div>
                      <div><span className="text-brand-400">Jackpot rolled:</span> <strong>{drawResult.jackpotRolledOver ? 'Yes' : 'No'}</strong></div>
                      <div><span className="text-brand-400">Total pool:</span> <strong>£{drawResult.draw?.total_pool?.toFixed(2) || '0'}</strong></div>
                    </div>
                    {drawResult.draw && !drawResult.draw.published && (
                      <button
                        onClick={() => handlePublishDraw(drawResult.draw.id)}
                        className="btn-primary mt-3 text-sm py-2"
                      >
                        Publish Results
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Draws history */}
              <div className="card">
                <h2 className="font-semibold text-navy-800 mb-4">Draw History</h2>
                {draws.length === 0 ? (
                  <div className="text-center py-8 text-brand-400 text-sm">No draws yet.</div>
                ) : (
                  <div className="space-y-3">
                    {draws.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between p-4 bg-mist-50 rounded-xl">
                        <div>
                          <div className="text-sm font-semibold text-navy-800 flex items-center gap-2">
                            {formatScoreDate(d.result_date)}
                            <span className={`badge ${d.published ? 'badge-active' : 'badge-pending'}`}>
                              {d.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div className="flex gap-1.5 mt-1">
                            {d.numbers?.map((n: number) => (
                              <span key={n} className="text-xs bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded font-semibold">{n}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-xs text-brand-400">
                          <div>{d.type}</div>
                          <div>£{d.total_pool?.toFixed(2)}</div>
                          {!d.published && (
                            <button
                              onClick={() => handlePublishDraw(d.id)}
                              className="text-brand-500 hover:text-brand-600 font-semibold mt-1"
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Winners */}
          {activeTab === 'winners' && (
            <div className="space-y-5 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-navy-800">Winner Verification & Payouts</h1>
              <div className="card overflow-x-auto">
                {results.length === 0 ? (
                  <div className="text-center py-10 text-brand-400 text-sm">No winners yet.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mist-100">
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">User</th>
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">Draw</th>
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">Matches</th>
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">Prize</th>
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-brand-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r: any) => (
                        <tr key={r.id} className="border-b border-mist-50 hover:bg-mist-50">
                          <td className="py-3 px-2">
                            <div className="font-medium text-navy-800">{r.user_profiles?.full_name}</div>
                            <div className="text-xs text-brand-400">{r.user_profiles?.email}</div>
                          </td>
                          <td className="py-3 px-2 text-xs text-brand-500">
                            {r.draws?.result_date ? formatScoreDate(r.draws.result_date) : '—'}
                          </td>
                          <td className="py-3 px-2 font-bold text-navy-800">{r.matches}</td>
                          <td className="py-3 px-2 font-bold text-brand-600">£{r.prize_amount?.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span className={`badge ${
                              r.payment_status === 'paid' ? 'badge-active' :
                              r.payment_status === 'rejected' ? 'badge-inactive' : 'badge-pending'
                            }`}>
                              {r.payment_status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              {!r.verified && r.payment_status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleVerifyWinner(r.id, true)}
                                    className="text-emerald-500 hover:text-emerald-600 p-1"
                                    title="Verify"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleVerifyWinner(r.id, false)}
                                    className="text-red-400 hover:text-red-500 p-1"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {r.verified && r.payment_status === 'pending' && (
                                <button
                                  onClick={() => handleMarkPaid(r.id)}
                                  className="text-xs bg-brand-500 text-white px-2 py-1 rounded-lg hover:bg-brand-600"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Charities */}
          {activeTab === 'charities' && (
            <div className="space-y-5 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-navy-800">Charity Management</h1>

              {/* Add new charity */}
              <div className="card">
                <h2 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Charity
                </h2>
                <form onSubmit={handleAddCharity} className="space-y-3">
                  <input
                    type="text"
                    value={newCharity.name}
                    onChange={(e) => setNewCharity({ ...newCharity, name: e.target.value })}
                    className="input-field"
                    placeholder="Charity name"
                    required
                  />
                  <textarea
                    value={newCharity.description}
                    onChange={(e) => setNewCharity({ ...newCharity, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Description"
                    required
                  />
                  <button type="submit" disabled={charityLoading} className="btn-primary text-sm disabled:opacity-60">
                    {charityLoading ? 'Adding...' : 'Add Charity'}
                  </button>
                </form>
              </div>

              {/* Charity list */}
              <div className="card">
                <h2 className="font-semibold text-navy-800 mb-4">All Charities ({charities.length})</h2>
                <div className="space-y-3">
                  {charities.map((c: Charity) => (
                    <div key={c.id} className="flex items-start justify-between p-4 bg-mist-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-navy-800">{c.name}</div>
                          <div className="text-xs text-brand-400 mt-0.5">{c.description}</div>
                          <div className="text-xs text-emerald-600 font-semibold mt-1">£{c.total_raised?.toFixed(2)} raised</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCharity(c.id)}
                        className="text-brand-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}