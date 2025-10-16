import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';
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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false); // Start as false for immediate render

  // Check for Supabase session AFTER initial render
  useEffect(() => {
    // Skip Supabase check for now - just use localStorage
    // This prevents blocking on startup
    console.log('Auth initialized with localStorage user');
    
    // Optional: Check Supabase in background (non-blocking)
    const checkSessionInBackground = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        if (data && data.user && data.profile) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            firstName: data.profile.first_name,
            lastName: data.profile.last_name,
            phone: data.profile.phone,
            avatar: data.profile.avatar_url,
          });
        }
      } catch (error) {
        // Silently fail - no Supabase session
        console.log('No Supabase session found');
      }
    };

    // Run in background without blocking
    checkSessionInBackground();

    // Listen to auth state changes (non-blocking)
    let subscription = null;
    try {
      const result = authService.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          try {
            const { data } = await authService.getCurrentUser();
            if (data && data.profile) {
              setUser({
                id: data.user.id,
                email: data.user.email,
                firstName: data.profile.first_name,
                lastName: data.profile.last_name,
                phone: data.profile.phone,
                avatar: data.profile.avatar_url,
              });
            }
          } catch (error) {
            console.log('Error fetching user profile:', error);
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
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    // Handle mobile login (phone number as email)
    if (email.includes('@mobile.catalix.com')) {
      const mockUser = {
        id: 'mobile-user-' + Date.now(),
        email: email,
        firstName: 'Mobile',
        lastName: 'User',
        phone: email.replace('@mobile.catalix.com', ''),
        phoneVerified: true,
        addresses: []
      };
      setUser(mockUser);
      return { success: true };
    }

    // Handle Google login
    if (email === 'user@gmail.com' && password === 'google-login') {
      const mockUser = {
        id: 'google-user-' + Date.now(),
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        phone: '',
        phoneVerified: false,
        addresses: []
      };
      setUser(mockUser);
      return { success: true };
    }

    // Handle regular email/password login
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    // Mock registration - in real app, this would call an API
    const newUser = {
      id: users.length + 1,
      ...userData,
      addresses: []
    };
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
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

