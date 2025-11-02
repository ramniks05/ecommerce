import { createContext, useContext, useState, useEffect } from 'react';
import { jsonStorage, safeStorage } from '../utils/safeStorage';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => jsonStorage.get('user', null));
  const [loading, setLoading] = useState(false); // Start as false for immediate render

  // Check for Supabase session AFTER initial render
  useEffect(() => {
    // Initialize from localStorage first, then check Supabase in background
    const checkSessionInBackground = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        if (data && data.user && data.profile) {
          const newUser = {
            id: data.user.id,
            email: data.user.email,
            firstName: data.profile.first_name,
            lastName: data.profile.last_name,
            phone: data.profile.phone,
            avatar: data.profile.avatar_url,
          };
          
          // Only update if user data actually changed to prevent unnecessary re-renders
          setUser(prev => {
            if (prev && prev.id === newUser.id && 
                prev.email === newUser.email && 
                prev.firstName === newUser.firstName &&
                prev.lastName === newUser.lastName) {
              return prev; // No change, return previous state
            }
            return newUser;
          });
        }
      } catch (error) {
        // Silently fail - no Supabase session
      }
    };

    // Run in background without blocking
    checkSessionInBackground();

    // Listen to auth state changes (non-blocking)
    // IMPORTANT: Filter out TOKEN_REFRESHED events to prevent unnecessary refreshes
    let subscription = null;
    try {
      const result = authService.onAuthStateChange(async (event, session) => {
        // Ignore TOKEN_REFRESHED events - they happen automatically and don't indicate a real auth change
        if (event === 'TOKEN_REFRESHED') {
          return;
        }

        if (session && session.user) {
          // Only fetch profile on meaningful events (SIGNED_IN, USER_UPDATED, etc.)
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
            try {
              const { data } = await authService.getCurrentUser();
              if (data && data.profile) {
                // Only update if user data actually changed to prevent unnecessary re-renders
                setUser(prev => {
                  const newUser = {
                    id: data.user.id,
                    email: data.user.email,
                    firstName: data.profile.first_name,
                    lastName: data.profile.last_name,
                    phone: data.profile.phone,
                    avatar: data.profile.avatar_url,
                  };
                  // Compare to prevent unnecessary updates
                  if (prev && prev.id === newUser.id && 
                      prev.email === newUser.email && 
                      prev.firstName === newUser.firstName &&
                      prev.lastName === newUser.lastName) {
                    return prev; // No change, return previous state
                  }
                  return newUser;
                });
              }
            } catch (error) {
              console.log('Error fetching user profile:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      
      if (result && result.data) {
        subscription = result.data.subscription;
      }
    } catch (error) {
      // Auth state listener failed - Supabase not configured
      console.log('Supabase not configured');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      jsonStorage.set('user', user);
    } else {
      safeStorage.removeItem('user');
    }
  }, [user]);

  const login = () => ({ success: false, error: 'Use Supabase login' });

  const register = (userData) => {
    setUser(userData);
    return { success: true };
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  // Don't render children until initial auth check is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

