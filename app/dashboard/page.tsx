import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  const supabase = createServerSupabaseClient();
  const adminSupabase = createAdminClient(); 

  const { data: { user } } = await supabase.auth.getUser();

  // If there is no user token at all, it's safe to go to login
  if (!user) redirect('/login');

  // Fetch user profile (Notice we grab the error object too!)
  const { data: profile, error: profileError } = await adminSupabase
    .from('user_profiles') // CHANGE THIS TO 'profiles' IF YOUR TABLE IS NAMED DIFFERENTLY
    .select('*, charities(*)')
    .eq('id', user.id)
    .single();

  // 🛑 THE LOOP BREAKER 🛑
  // Instead of redirecting to login, we render an error message on the dashboard.
  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h2 className="text-red-800 font-bold text-xl mb-2">Profile Missing or Database Error</h2>
          <p className="text-red-600 mb-4">We found your auth session, but couldn't load your profile data.</p>
          <pre className="text-left bg-white p-4 rounded text-xs text-gray-700 overflow-auto border border-red-100">
            {JSON.stringify(profileError || "Profile returned null", null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Redirect admins to their panel
  if (profile.is_admin) redirect('/admin');

  // 4. Fetch scores newest first
  const { data: scores } = await adminSupabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  // 5. Fetch latest draw results for this user
  const { data: results } = await adminSupabase
    .from('draw_results')
    .select('*, draws(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // 6. Calculate total winnings and pending payout
  const { data: winningsData } = await adminSupabase
    .from('draw_results')
    .select('prize_amount, payment_status')
    .eq('user_id', user.id);

  const totalWon = (winningsData || []).reduce((sum, r) => sum + (r.prize_amount || 0), 0);
  const pendingPayout = (winningsData || [])
    .filter(r => r.payment_status === 'pending')
    .reduce((sum, r) => sum + (r.prize_amount || 0), 0);

  // 7. Fetch latest published draw
  const { data: latestDraw } = await adminSupabase
    .from('draws')
    .select('*')
    .eq('published', true)
    .order('result_date', { ascending: false })
    .limit(1)
    .single();

  // 8. Pass it all to your client component
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