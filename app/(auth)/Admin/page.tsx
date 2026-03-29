import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import AdminClient from '@/components/admin/AdminClient';

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const adminSupabase = createAdminClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/dashboard');

  // Fetch data
  const { data: users } = await adminSupabase.from('user_profiles').select('*, charities(name)').order('created_at', { ascending: false });
  const { data: draws } = await adminSupabase.from('draws').select('*').order('created_at', { ascending: false }).limit(20);
  const { data: results } = await adminSupabase.from('draw_results').select('*, user_profiles(full_name, email), draws(result_date, numbers)').limit(50);
  const { data: charities } = await adminSupabase.from('charities').select('*').order('name');
  
  const { data: activeSubsData } = await adminSupabase.from('subscriptions').select('prize_pool_contribution, charity_contribution').eq('status', 'active');

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