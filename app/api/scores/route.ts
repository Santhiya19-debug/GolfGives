import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { validateScore, MAX_SCORES } from '@/lib/scoreUtils';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { score, date } = await request.json();

  // Validate score range
  if (!validateScore(Number(score))) {
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 });
  }

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  // Check subscription status
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_status !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
  }

  // ROLLING 5-SCORE LOGIC:
  // Fetch current scores sorted by date ascending (oldest first).
  // If user already has MAX_SCORES (5), delete the oldest before inserting new one.
  const { data: existingScores } = await adminSupabase
    .from('scores')
    .select('id, date')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (existingScores && existingScores.length >= MAX_SCORES) {
    // Delete the oldest score to maintain rolling window of 5
    const oldestScoreId = existingScores[0].id;
    await adminSupabase.from('scores').delete().eq('id', oldestScoreId);
  }

  // Insert new score
  const { data: newScore, error } = await adminSupabase.from('scores').insert({
    user_id: user.id,
    score: Number(score),
    date,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ score: newScore });
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();

  const { error } = await adminSupabase
    .from('scores')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // ensure ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}