import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Breadcrumb from '../components/Breadcrumb';
import authService from '../services/authService';

const Login = () => {
  const { login, setUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (email, password) => {
    try {
      console.log('Attempting email login with Supabase...');
      // Hard timeout to avoid infinite waiting on slow/blocked networks
      const withTimeout = (p, ms = 8000) =>
        Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
        ]);

      // Try Supabase authentication first
      let data, error;
      try {
        const res = await withTimeout(authService.signIn(email, password));
        data = res.data; error = res.error;
      } catch (e) {
        error = e;
      }
      
      if (error) {
        console.log('Supabase login failed, trying mock login...', error);
        
        // Fallback to mock login
        const result = login(email, password);
        
        if (result.success) {
          showNotification('Login successful!', 'success');
          navigate(redirectTo);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      }
      
      // Success with Supabase
      if (data && data.user) {
        console.log('Supabase login successful:', data);
        
        // Fetch profile and set auth context directly
        try {
          const { data: current } = await authService.getCurrentUser();
          if (current && current.user) {
            setUser({
              id: current.user.id,
              email: current.user.email,
              firstName: current.profile?.first_name || '',
              lastName: current.profile?.last_name || '',
              phone: current.profile?.phone || '',
              avatar: current.profile?.avatar_url || '',
            });
          } else {
            // Fallback minimal user
            setUser({ id: data.user.id, email: data.user.email });
          }
        } catch (e) {
          setUser({ id: data.user.id, email: data.user.email });
        }
        
        showNotification('Login successful!', 'success');
        navigate(redirectTo);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
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

        <div className="card p-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              await handleEmailLogin(email, password);
              setSubmitting(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={handleBack} className="text-sm text-gray-600 hover:text-gray-900">Back</button>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Logging in...' : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;