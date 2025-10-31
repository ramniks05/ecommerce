import { supabase } from '../lib/supabase';

// Auth Service for Supabase Authentication
export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || userData.firstName,
            last_name: userData.last_name || userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (authError) throw authError;

      // Ensure we have a session (email confirmation may be enabled)
      let { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        // Try to sign in immediately to obtain a session (if confirmations are disabled)
        try {
          await supabase.auth.signInWithPassword({ email, password });
          ({ data: sessionData } = await supabase.auth.getSession());
        } catch (_) {}
      }

      // Create user profile in database (only if we have a valid session so RLS passes)
      if (sessionData?.session?.user) {
        const authedUser = sessionData.session.user;
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert([
            {
              id: authedUser.id,
              first_name: userData.first_name || userData.firstName,
              last_name: userData.last_name || userData.lastName,
              phone: userData.phone,
              phone_verified: userData.phone_verified || false,
              is_active: true,
            },
          ], { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      } else {
        // No session yet; profile will be upserted on first successful login
        console.log('No session after signup; will create profile on first login');
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch or create user profile
      if (data.user) {
        const { data: profile, error: profErr } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profErr) {
          const { data: created } = await supabase
            .from('user_profiles')
            .upsert([
              {
                id: data.user.id,
                first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
                last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
                is_active: true,
              }
            ], { onConflict: 'id' })
            .select()
            .single();

          return { data: { ...data, profile: created }, error: null };
        }

        return { data: { ...data, profile }, error: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  // Sign in with Google OAuth
  async signInWithGoogle() {
    try {
      const siteUrl = (typeof window !== 'undefined' && window.location && window.location.origin)
        ? window.location.origin
        : '';
      const envSiteUrl = (typeof import.meta !== 'undefined' && import.meta.env)
        ? (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_SITE_URL || '')
        : '';
      const redirectBase = envSiteUrl || siteUrl;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  },

  // Sign in with Phone (OTP) - Supabase Native
  async signInWithPhone(phone) {
    try {
      console.log('📱 Sending OTP via Supabase Phone Auth to:', phone);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms', // Send via SMS
        },
      });

      if (error) {
        console.error('Supabase Phone Auth error:', error);
        throw error;
      }
      
      console.log('✅ Supabase OTP sent successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Phone sign in error:', error);
      return { data: null, error };
    }
  },

  // Verify OTP - Supabase Native
  async verifyOTP(phone, token) {
    try {
      console.log('🔍 Verifying OTP via Supabase Phone Auth');
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        throw error;
      }

      console.log('✅ OTP verified successfully via Supabase');

      // Create or update user profile
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (!existingProfile) {
          await supabase.from('user_profiles').insert([
            {
              user_id: data.user.id,
              phone: data.user.phone,
              phone_verified: true,
            },
          ]);
          console.log('✅ User profile created');
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { data: null, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // Suppress "Auth session missing" error - this is normal when not configured
        if (error.message && error.message.includes('Auth session missing')) {
          return { data: null, error: null };
        }
        throw error;
      }

      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return { 
          data: { 
            user, 
            profile 
          }, 
          error: null 
        };
      }

      return { data: null, error: null };
    } catch (error) {
      // Only log actual errors, not session missing
      if (!error.message || !error.message.includes('Auth session missing')) {
        console.error('Get current user error:', error);
      }
      return { data: null, error };
    }
  },

  // Get session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      return { data: session, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error };
    }
  },

  // Update profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;

