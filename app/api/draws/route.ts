import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  generateRandomDraw,
  generateAlgorithmDraw,
  calculateMatches,
  calculatePrizes,
} from '@/lib/drawEngine';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: fetch latest published draw
export async function GET() {
  const { data: draws } = await adminSupabase
    .from('draws')
    .select('*')
    .eq('published', true)
    .order('result_date', { ascending: false })
    .limit(5);

  return NextResponse.json({ draws: draws || [] });
}

// POST: admin triggers a draw
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify admin
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { drawType, resultDate, simulate } = await request.json();

  // Fetch all active user scores for algorithm draw
  const { data: allScores } = await adminSupabase
    .from('scores')
    .select('*, user_profiles!inner(subscription_status)')
    .eq('user_profiles.subscription_status', 'active');

  // Generate draw numbers based on type
  const numbers = drawType === 'algorithm'
    ? generateAlgorithmDraw(allScores || [])
    : generateRandomDraw();

  // If simulation mode, just return the numbers without saving
  if (simulate) {
    return NextResponse.json({ numbers, simulated: true });
  }

  // Get last draw to check for rollover jackpot
  const { data: lastDraw } = await adminSupabase
    .from('draws')
    .select('jackpot_amount')
    .eq('published', true)
    .order('result_date', { ascending: false })
    .limit(1)
    .single();

  const rolloverAmount = lastDraw?.jackpot_amount || 0;

  // Calculate total prize pool from active subscriptions
  const { data: activeSubs } = await adminSupabase
    .from('subscriptions')
    .select('prize_pool_contribution')
    .eq('status', 'active');

  const totalPool = (activeSubs || []).reduce(
    (sum, sub) => sum + (sub.prize_pool_contribution || 0), 0
  );

  // Save the draw
  const { data: draw, error: drawError } = await adminSupabase
    .from('draws')
    .insert({
      numbers,
      type: drawType,
      result_date: resultDate || new Date().toISOString().split('T')[0],
      published: false,
      total_pool: totalPool,
      rollover_amount: rolloverAmount,
    })
    .select()
    .single();

  if (drawError) return NextResponse.json({ error: drawError.message }, { status: 400 });

  // Compare draw numbers against all active subscribers' scores
  const { data: userScores } = await adminSupabase
    .from('scores')
    .select('user_id, score')
    .in('user_id',
      (activeSubs || []).map((_, i) => i) // placeholder; refined below
    );

  // Get all unique active user IDs
  const { data: activeUsers } = await adminSupabase
    .from('user_profiles')
    .select('id')
    .eq('subscription_status', 'active');

  const activeUserIds = (activeUsers || []).map(u => u.id);

  // Fetch scores for active users
  const { data: scores } = await adminSupabase
    .from('scores')
    .select('user_id, score')
    .in('user_id', activeUserIds);

  // Group scores by user
  const scoresByUser: Record<string, number[]> = {};
  (scores || []).forEach(({ user_id, score }) => {
    if (!scoresByUser[user_id]) scoresByUser[user_id] = [];
    scoresByUser[user_id].push(score);
  });

  // Find winners (3+ matches)
  const winnersByMatch: { userId: string; matches: number }[] = [];
  for (const [userId, userScoreArr] of Object.entries(scoresByUser)) {
    const matches = calculateMatches(userScoreArr, numbers);
    if (matches >= 3) {
      winnersByMatch.push({ userId, matches });
    }
  }

  // Calculate prizes
  const prizes = calculatePrizes(totalPool, rolloverAmount, winnersByMatch);

  // Insert draw results for winners
  if (winnersByMatch.length > 0) {
    const resultRows = winnersByMatch.map(({ userId, matches }) => ({
      draw_id: draw.id,
      user_id: userId,
      matches,
      prize_amount: prizes.prizePerWinner[userId] || 0,
      payment_status: 'pending',
    }));
    await adminSupabase.from('draw_results').insert(resultRows);
  }

  // Update jackpot amount for rollover (if no 5-match winner)
  const newJackpot = prizes.jackpotWinners.length === 0 ? prizes.jackpotPool : 0;
  await adminSupabase.from('draws').update({ jackpot_amount: newJackpot }).eq('id', draw.id);

  return NextResponse.json({
    draw,
    numbers,
    winners: winnersByMatch.length,
    prizes,
    jackpotRolledOver: prizes.jackpotWinners.length === 0,
  });
}

// PATCH: publish a draw
export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { drawId } = await request.json();

  const { error } = await adminSupabase
    .from('draws')
    .update({ published: true })
    .eq('id', drawId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}