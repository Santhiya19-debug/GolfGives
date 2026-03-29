import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import AdminClient from '@/components/admin/AdminClient';

// Forces Next.js to bypass the cache and talk to the DB live
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const adminSupabase = createAdminClient(); // 👈 THIS IS THE KEY. It bypasses RLS.
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check if current user is admin
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/dashboard');

  // FETCH EVERYTHING USING THE ADMIN CLIENT
  const [users, subs, scores] = await Promise.all([
    adminSupabase.from('user_profiles').select('*'),
    adminSupabase.from('subscriptions').select('*'),
    adminSupabase.from('scores').select('*')
  ]);

  // Calculations for the cards
  const stats = {
    totalUsers: users.data?.length || 0,
    activeUsers: users.data?.filter(u => u.subscription_status === 'active').length || 0,
    // Summing the real money from the subscriptions table
    totalPool: (subs.data || []).reduce((acc, s) => acc + (s.prize_pool_contribution || 0), 0),
    totalCharity: (subs.data || []).reduce((acc, s) => acc + (s.charity_contribution || 0), 0),
    drawEntries: scores.data?.length || 0
  };

  return (
    <AdminClient 
      adminName={profile.full_name}
      initialData={{
        users: users.data || [],
        stats
      }} 
    />
  );
}