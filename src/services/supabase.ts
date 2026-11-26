import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials safely from Vite environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Validates if the configured credentials are valid non-placeholder strings.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-anon-key')) return false;
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Centralized Supabase Client instance.
 * If credentials are not yet configured, creates a dummy/fallback client to avoid throwing on import.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  }
);

/**
 * Health check utility to test the live Supabase database connection.
 */
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  latencyMs?: number;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in environment (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing or placeholders).',
    };
  }

  const start = performance.now();
  try {
    // Attempt a light query to verify database and anon key access
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== 'PGRST116') {
      // If error is table not found, connection to Supabase was still established
      if (error.code === '42P01' || error.message.includes('relation "public.profiles" does not exist')) {
        return {
          connected: true,
          message: `Connected to Supabase project (${latencyMs}ms), but database migrations have not been run yet.`,
          latencyMs,
        };
      }
      return {
        connected: false,
        message: `Supabase error: ${error.message} (code: ${error.code})`,
        latencyMs,
      };
    }

    return {
      connected: true,
      message: `Successfully connected to Supabase database (${latencyMs}ms).`,
      latencyMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${errorMsg}`,
    };
  }
};
