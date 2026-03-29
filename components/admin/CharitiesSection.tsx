'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, TrendingUp, AlertCircle, Plus, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CharitiesSection() {
  const supabase = createClient();
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharitiesData();
  }, []);

  const fetchCharitiesData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all charities
      const { data: charitiesData, error: cError } = await supabase
        .from('charities')
        .select('*')
        .order('name');

      if (cError) throw cError;

      // 2. Fetch user counts per charity from user_profiles
      const { data: profileData, error: pError } = await supabase
        .from('user_profiles')
        .select('charity_id');

      if (pError) throw pError;

      // 3. Map the counts to the charities
      const formattedCharities = (charitiesData || []).map((charity) => {
        const userCount = (profileData || []).filter(
          (p) => p.charity_id === charity.id
        ).length;
        
        return {
          ...charity,
          userCount: userCount || 0,
          // Total contribution can be calculated here if linked to subscriptions
          totalContribution: charity.total_raised || 0, 
        };
      });

      setCharities(formattedCharities);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Syncing Charity Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-3 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm font-bold">Error loading charities: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Impact Partners</h2>
          <p className="text-slate-500 text-sm font-medium">Managing linked charities and distribution</p>
        </div>
        <button className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Add New Charity
        </button>
      </div>

      {charities.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-20 text-center">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-slate-800 font-bold text-lg">No charities available</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
            Add charities to start tracking contributions and allowing members to select their impact.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <div 
              key={charity.id} 
              className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all group relative overflow-hidden"
            >
              {/* Top Row: Icon & Status */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-rose-50 rounded-[20px] flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 fill-rose-500/10" />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                     Active
                   </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">
                  {charity?.name || 'Untitled Charity'}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-3">
                  {charity?.description || 'No description provided for this organization.'}
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Members</span>
                  </div>
                  <div className="text-xl font-black text-slate-800">{charity?.userCount ?? 0}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Raised</span>
                  </div>
                  <div className="text-xl font-black text-brand-600">
                    £{charity?.totalContribution?.toLocaleString() ?? '0'}
                  </div>
                </div>
              </div>

              {/* Delete Overlay (Only on hover) */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}