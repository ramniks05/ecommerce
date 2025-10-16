import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoginOptions from '../components/LoginOptions';
import Breadcrumb from '../components/Breadcrumb';
import authService from '../services/authService';

const Login = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleEmailLogin = async (email, password) => {
    try {
      console.log('Attempting email login with Supabase...');
      
      // Try Supabase authentication first
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        console.log('Supabase login failed, trying mock login...', error);
        
        // Fallback to mock login
        const result = login(email, password);
        
        if (result.success) {
          showNotification('Login successful!', 'success');
          navigate('/');
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      }
      
      // Success with Supabase
      if (data && data.user) {
        console.log('Supabase login successful:', data);
        
        // Update auth context
        login(email, password);
        
        showNotification('Login successful!', 'success');
        navigate('/');
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const handleMobileLogin = async (phone) => {
    try {
      // For demo purposes, create a mock user for mobile login
      // In production, you would verify the phone number and find/create the user
      const mockUser = {
        id: 'mobile-user-' + Date.now(),
        email: phone + '@mobile.catalix.com',
        firstName: 'Mobile',
        lastName: 'User',
        phone: phone,
        phoneVerified: true
      };

      // Update auth context
      login(phone + '@mobile.catalix.com', 'mobile-login'); // Using phone as email for demo
      
      showNotification('Mobile login successful!', 'success');
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Mobile login failed. Please try again.' };
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google OAuth login...');
      
      // Use Supabase Google OAuth
      const { data, error } = await authService.signInWithGoogle();
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { success: false, error: 'Google login failed. Please try again.' };
      }
      
      // Google OAuth will redirect to auth callback page
      // No need to navigate here
      console.log('Google OAuth initiated successfully');
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Login' }]} />

      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">Login Options:</p>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Email:</strong> demo@example.com / demo123</p>
            <p><strong>Google:</strong> Click "Continue with Google" below</p>
          </div>
        </div>

        <LoginOptions
          onEmailLogin={handleEmailLogin}
          onMobileLogin={handleMobileLogin}
          onGoogleLogin={handleGoogleLogin}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default Login;