'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CharitiesSection from './CharitiesSection'; // Ensure this file exists in the same folder
import { 
  Users, Trophy, Heart, Activity, Search, 
  ExternalLink, Shield, LayoutDashboard,
  LogOut, RefreshCw, CreditCard, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminClient({ adminName, initialData }: any) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 REAL-TIME ENGINE
  useEffect(() => {
    const channel = supabase
      .channel('admin-live-sync')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'user_profiles' }, 
        () => {
          router.refresh(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredUsers = initialData.users.filter((u: any) => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      
      {/* PROFESSIONAL SIDEBAR */}
      <aside className="w-72 bg-[#0F172A] flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">GolfGives</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'users', icon: Users, label: 'Members' },
            { id: 'charities', icon: Heart, label: 'Charities' },
            { id: 'winners', icon: Trophy, label: 'Winners' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-[#10B981] text-white shadow-xl shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="truncate">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest leading-none mb-1">Authenticated</p>
              <p className="text-xs font-bold text-white truncate">{adminName || 'System Admin'}</p>
            </div>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="flex items-center gap-3 w-full px-4 text-slate-400 hover:text-red-400 text-sm font-semibold transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD INTERFACE */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
             <span className="h-4 w-px bg-slate-200"></span>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Live DB Connection
             </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-10">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-4 gap-6">
                <StatCard label="Total Users" value={initialData.stats.totalUsers} detail={`${initialData.stats.activeUsers} Active`} color="text-slate-900" />
                <StatCard label="Active Pool" value={`£${initialData.stats.totalPool}`} detail="Real-time contribution" color="text-[#10B981]" />
                <StatCard label="Charity Impact" value={`£${initialData.stats.totalCharity}`} detail="Total generated" color="text-rose-600" />
                <StatCard label="Draw Entries" value={initialData.stats.drawEntries} detail="Validated scores" color="text-orange-500" />
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg text-slate-800 font-display">Global Member Feed</h3>
                  <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-[#10B981] hover:underline uppercase tracking-widest">View All Members</button>
                </div>
                <div className="space-y-3">
                  {initialData.users.slice(0, 5).map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${u.subscription_status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none mb-1">{u.full_name || u.email}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {u.id.slice(0,8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Status</p>
                          <p className={`text-xs font-bold uppercase ${u.subscription_status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>{u.subscription_status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEMBERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 ring-emerald-500/10 outline-none transition-all" 
                    placeholder="Search by name, email or UID..." 
                  />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing {filteredUsers.length} Members
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 bg-slate-50/50">
                      <th className="px-10 py-5">Member Identity</th>
                      <th className="px-10 py-5">Status</th>
                      <th className="px-10 py-5 text-center">Plan</th>
                      <th className="px-10 py-5 text-right">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6 text-slate-800">
                          <div className="font-bold text-base mb-0.5">{u.full_name || 'Incomplete Profile'}</div>
                          <div className="text-xs text-slate-400 font-semibold">{u.email}</div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            u.subscription_status === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}>
                            {u.subscription_status}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex flex-col items-center">
                            <CreditCard className={`w-4 h-4 mb-1 ${u.plan_type ? 'text-slate-400' : 'text-slate-200'}`} />
                            <span className="text-[10px] font-bold uppercase text-slate-500">{u.plan_type || 'None'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="text-sm text-slate-700 font-bold">{new Date(u.created_at).toLocaleDateString('en-GB')}</div>
                          <div className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter text-right">Initial Signup</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CHARITIES */}
          {activeTab === 'charities' && (
            <CharitiesSection />
          )}

          {/* TAB: WINNERS */}
          {activeTab === 'winners' && (
            <div className="text-center py-20 bg-white rounded-[32px] border border-slate-200 border-dashed">
                <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-slate-800 font-bold text-lg">Winner Tracking Coming Soon</h3>
                <p className="text-slate-400 text-sm">Winner data will appear here after the next monthly draw.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative group hover:border-[#10B981] transition-all duration-300">
      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{label}</p>
      <div className={`text-4xl font-black ${color} tracking-tight mb-2`}>{value}</div>
      <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1.5 rounded-xl inline-block uppercase tracking-tight">
        {detail}
      </div>
    </div>
  );
}