import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdminCredentials } from '../../utils/adminUsers';
import { jsonStorage, safeStorage } from '../../utils/safeStorage';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import authService from '../../services/authService';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Admin login attempt:', formData.email);
      console.log('🔧 Supabase configured:', isSupabaseConfigured);

      // Try Supabase Auth + admin_users role/permissions when configured
      if (isSupabaseConfigured) {
        console.log('📡 Attempting Supabase auth...');
        // Timeout guard in case auth stalls on some networks/browsers
        const withTimeout = (p, ms = 10000) => Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('Authentication timeout after 10s')), ms))
        ]);
        let data, authError;
        try {
          const res = await withTimeout(authService.signIn(formData.email, formData.password));
          data = res.data; 
          authError = res.error;
          console.log('📡 Supabase auth response:', { hasData: !!data, hasError: !!authError });
        } catch (e) {
          authError = e;
          console.error('❌ Supabase auth error:', e);
        }
        
        if (!authError && data && data.user) {
          console.log('✅ Supabase auth successful, checking admin role...');
          // Authenticated: verify admin role
          const { data: adminRow, error: dbError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', formData.email)
            .single();

          console.log('👤 Admin users query:', { hasData: !!adminRow, error: dbError });

          if (!dbError && adminRow) {
            // Ensure a user_profiles row exists and mark as admin for RLS policies
            try {
              await supabase
                .from('user_profiles')
                .upsert({
                  id: data.user.id, // matches auth.users.id per schema
                  first_name: adminRow.name?.split(' ')[0] || null,
                  last_name: adminRow.name?.split(' ').slice(1).join(' ') || null,
                  is_admin: true,
                  is_active: true,
                  updated_at: new Date().toISOString()
                });
              console.log('✅ Admin profile updated');
            } catch (e) {
              // non-fatal; continue login even if profile upsert fails
              console.warn('⚠️ Admin profile upsert warning:', e?.message || e);
            }
            const adminUser = {
              id: adminRow.id,
              email: adminRow.email,
              name: adminRow.name || data.user.email,
              role: adminRow.role || 'admin',
              permissions: adminRow.permissions || ['products', 'orders', 'brands'],
            };
            jsonStorage.set('adminUser', adminUser);
            safeStorage.setItem('isAdmin', 'true');
            console.log('✅ Admin login successful, redirecting...');
            navigate('/admin');
            return;
          }

          console.warn('⚠️ User authenticated but not in admin_users table, falling back to local...');
          // Continue to local fallback
        } else {
          console.warn('⚠️ Supabase auth failed:', authError?.message || authError);
          // Continue to local fallback
        }
      }

      // Fallback to local admin list
      console.log('🔄 Trying local admin credentials...');
      const result = verifyAdminCredentials(formData.email, formData.password);
      console.log('🔄 Local admin result:', result);
      
      if (result.success) {
        jsonStorage.set('adminUser', result.user);
        safeStorage.setItem('isAdmin', 'true');
        console.log('✅ Local admin login successful, redirecting...');
        navigate('/admin');
      } else {
        setError(result.error || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      console.error('❌ Login exception:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the admin panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="admin@catalix.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Super Admin:</p>
                <p>Email: admin@catalix.com</p>
                <p>Password: admin123</p>
                <button
                  onClick={() => {
                    setFormData({ email: 'admin@catalix.com', password: 'admin123' });
                  }}
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 underline"
                >
                  Fill credentials
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Demo Admin:</p>
                <p>Email: demo@example.com</p>
                <p>Password: demo123</p>
                <button
                  onClick={() => {
                    setFormData({ email: 'demo@example.com', password: 'demo123' });
                  }}
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 underline"
                >
                  Fill credentials
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
