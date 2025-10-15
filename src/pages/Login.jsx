import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Breadcrumb from '../components/Breadcrumb';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'demo123',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);
    
    if (result.success) {
      showNotification('Login successful!');
      navigate('/profile');
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Login' }]} />

      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Login to your account</p>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-800">Email: demo@example.com</p>
            <p className="text-sm text-blue-800">Password: demo123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

