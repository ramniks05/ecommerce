import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Fetch or create user profile
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Handle missing profile (PGRST116) or RLS errors (403/406)
          if (profileError && (profileError.code === 'PGRST116' || profileError.code === 'PGRST301' || profileError.status === 403 || profileError.status === 406)) {
            // Profile doesn't exist, create it
            const { data: newProfile } = await supabase
              .from('user_profiles')
              .insert([
                {
                  id: session.user.id,
                  first_name: session.user.user_metadata?.full_name?.split(' ')[0] || 'User',
                  last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
                  avatar_url: session.user.user_metadata?.avatar_url,
                },
              ])
              .select()
              .single();

            if (newProfile) {
              // Update auth context
              if (setUser) {
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  firstName: newProfile.first_name,
                  lastName: newProfile.last_name,
                  phone: newProfile.phone,
                  avatar: newProfile.avatar_url,
                });
              }
            }
          } else if (profile) {
            // Update auth context with existing profile
            if (setUser) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                phone: profile.phone,
                avatar: profile.avatar_url,
              });
            }
          }

          showNotification('Successfully signed in!', 'success');
          navigate('/');
        } else {
          showNotification('Authentication failed', 'error');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        showNotification('Authentication failed', 'error');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser, showNotification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

