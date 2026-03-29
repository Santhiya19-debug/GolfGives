import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import AdminClient from '@/components/admin/AdminClient';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/dashboard');

  // Fetch all users
  const { data: users } = await adminSupabase
    .from('user_profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false });

  // Fetch all draws
  const { data: draws } = await adminSupabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch all draw results with user info
  const { data: results } = await adminSupabase
    .from('draw_results')
    .select('*, user_profiles(full_name, email), draws(result_date, numbers)')
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch charities
  const { data: charities } = await adminSupabase
    .from('charities')
    .select('*')
    .order('name');

  // Aggregate stats
  const { data: activeSubsData } = await adminSupabase
    .from('subscriptions')
    .select('prize_pool_contribution, charity_contribution')
    .eq('status', 'active');

  const totalPool = (activeSubsData || []).reduce((s, r) => s + r.prize_pool_contribution, 0);
  const totalCharity = (activeSubsData || []).reduce((s, r) => s + r.charity_contribution, 0);
  const activeUsers = (users || []).filter(u => u.subscription_status === 'active').length;

  return (
    <AdminClient
      adminName={profile.full_name}
      users={users || []}
      draws={draws || []}
      results={results || []}
      charities={charities || []}
      stats={{ totalPool, totalCharity, activeUsers, totalUsers: users?.length || 0 }}
    />
  );
}