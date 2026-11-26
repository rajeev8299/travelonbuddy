import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from '../context/AppContext';

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

/**
 * Authentication Service integrating Supabase Auth with RLS-backed profile management.
 */
export const authService = {
  /**
   * Register a new user with email, password, full name, and selected role.
   */
  async register(
    email: string,
    password: string,
    name: string,
    role: 'traveler' | 'buddy' = 'traveler'
  ): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            role,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Registration failed. Please try again.' };
      }

      // Upsert profile record in public.profiles table
      const profile: AuthUser = {
        id: data.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        title: role === 'buddy' ? 'Travel Companion Candidate' : 'Heritage Traveler',
      };

      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          title: profile.title,
          updated_at: new Date().toISOString(),
        },
      ]);

      return {
        success: true,
        user: profile,
        message: 'Registration successful. If email confirmation is enabled, please check your inbox.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  },

  /**
   * Log in an existing user with email and password via Supabase Auth.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials are not configured in environment.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Login failed. Invalid user record.' };
      }

      // Fetch user profile from database to ensure trusted role assignment
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileErr || !profileData) {
        // Fallback to auth metadata if profile query hasn't synced
        const fallbackRole = (data.user.user_metadata?.role as 'traveler' | 'buddy' | 'admin') || 'traveler';
        const user: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || email,
          role: fallbackRole,
          title: fallbackRole === 'admin' ? 'Operations Director' : 'Traveler',
        };
        return { success: true, user };
      }

      const user: AuthUser = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        title: profileData.title,
        avatar: profileData.avatar_url,
      };

      return { success: true, user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  },

  /**
   * Sign out the currently active session.
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out of Supabase:', err);
      }
    }
  },

  /**
   * Send a password reset email via Supabase Auth.
   */
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials are not configured in environment.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });

      if (error) {
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: 'Password reset link dispatched. Please check your inbox.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  },

  /**
   * Get current active authenticated session from Supabase.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          title: profile.title,
          avatar: profile.avatar_url,
        };
      }

      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: user.user_metadata?.role || 'traveler',
      };
    } catch (err) {
      console.error('Error getting current user:', err);
      return null;
    }
  },
};
