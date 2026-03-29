import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import DashboardClient from '@/components/dashboard/layout';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch user profile
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('*, charities(*)')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  // Redirect admins
  if (profile.is_admin) redirect('/admin');

  // Fetch scores (newest first)
  const { data: scores } = await adminSupabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  // Fetch latest draw results for this user
  const { data: results } = await adminSupabase
    .from('draw_results')
    .select('*, draws(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch total winnings
  const { data: winningsData } = await adminSupabase
    .from('draw_results')
    .select('prize_amount, payment_status')
    .eq('user_id', user.id);

  const totalWon = (winningsData || []).reduce((sum, r) => sum + (r.prize_amount || 0), 0);
  const pendingPayout = (winningsData || [])
    .filter(r => r.payment_status === 'pending')
    .reduce((sum, r) => sum + (r.prize_amount || 0), 0);

  // Fetch latest published draw
  const { data: latestDraw } = await adminSupabase
    .from('draws')
    .select('*')
    .eq('published', true)
    .order('result_date', { ascending: false })
    .limit(1)
    .single();

  return (
    <DashboardClient
      profile={profile}
      scores={scores || []}
      results={results || []}
      totalWon={totalWon}
      pendingPayout={pendingPayout}
      latestDraw={latestDraw}
      isWelcome={searchParams.welcome === '1'}
    />
  );
}