import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

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

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
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

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

