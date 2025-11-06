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

        // Profile error is handled silently - profile will be created on first login if needed
      }

      return { data: authData, error: null };
    } catch (error) {
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
      return { data: null, error };
    }
  },

<<<<<<< HEAD
  // (Removed: Google OAuth and Phone OTP methods)
=======
  // (Removed: Google OAuth and Phone OTP methods)
>>>>>>> ed5bf4b (feat(b2b): add B2B/B2C product types, request-price flow, admin enquiries\n\n- DB: add product_type column, create price_enquiries table (SQL files)\n- Admin: product_type in form; new /admin/enquiries page\n- Storefront: hide price and replace cart with Request Price for B2B\n- Modal: stable portal-based RequestPriceModal\n- Filters: add product type filter on Products page\n- Auth: simplify to email/password; remove Google OAuth and SMS/OTP flows\n- Cleanup: delete OTP/SMS services and OAuth callback; remove LoginOptions/PhoneVerification)

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
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
        // Fetch user profile (fail silently if RLS blocks access)
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Ignore profile errors (403/406) - profile may not exist or RLS may block access
        if (profileError) {
          // Return user without profile if profile fetch fails
          return { 
            data: { 
              user, 
              profile: null 
            }, 
            error: null 
          };
        }

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
      // Suppress "Auth session missing" error - this is normal when not configured
      if (error.message && error.message.includes('Auth session missing')) {
        return { data: null, error: null };
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
      return { data: null, error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;

