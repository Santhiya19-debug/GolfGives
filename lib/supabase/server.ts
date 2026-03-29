import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js'; // 👈 Important: New Import
import { cookies } from 'next/headers';

/**
 * STANDARD CLIENT
 * Used for Auth checks and regular user data. 
 * Respects Row Level Security (RLS).
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can be ignored if called from a Server Component
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // This can be ignored if called from a Server Component
          }
        },
      },
    }
  );
}

/**
 * ADMIN CLIENT (THE MASTER KEY)
 * Bypasses RLS to see ALL users (Noah, Ana, Victor, etc.)
 * Uses the Service Role Key.
 */
export function createAdminClient() {
  // We use the raw createClient here because we don't want 
  // to be restricted by the current user's session/cookies.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}