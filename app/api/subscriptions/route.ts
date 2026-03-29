import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planType, charityId, contributionPercentage } = body;

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('user_profiles') // Ensure this is the exact name of your table
      .update({
        plan_type: planType,
        charity_id: charityId,
        contribution_percentage: contributionPercentage,
        subscription_status: 'active',
      })
      .eq('id', userId);

    // 🛑 THIS IS THE MAGIC FIX: We are now exposing the EXACT error
    if (error) {
      console.error('Supabase exact error:', error);
      return NextResponse.json(
        { error: `DB Error: ${error.message} (Code: ${error.code})` }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: `Server Error: ${error.message}` }, 
      { status: 500 }
    );
  }
}