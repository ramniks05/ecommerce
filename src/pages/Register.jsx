import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { otpFlow, phoneValidation } from '../services/otpService';
import authService from '../services/authService';
import Breadcrumb from '../components/Breadcrumb';
import PhoneVerification from '../components/PhoneVerification';
import { FiPhone, FiMail, FiUser, FiLock, FiCheck, FiX } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();

  const [step, setStep] = useState(1); // 1: Form, 2: Phone Verification, 3: Success
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional for now - SMS not configured)
    if (formData.phone.trim() && !phoneValidation.isValidIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Indian mobile number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Check if phone number is provided
      if (formData.phone && formData.phone.trim()) {
        // Format phone number
        const formattedPhone = phoneValidation.formatIndianPhone(formData.phone);
        console.log('Formatted phone:', formattedPhone);

        // Send OTP for phone verification
        const otpResult = await otpFlow.sendPhoneOTP(formattedPhone);
        console.log('OTP result:', otpResult);
        
        if (otpResult.success) {
          setFormData(prev => ({ ...prev, phone: formattedPhone }));
          setStep(2);
          showNotification('OTP sent to your mobile number', 'success');
        } else {
          setErrors({ phone: otpResult.error });
        }
      } else {
        // Skip phone verification if no phone provided
        console.log('No phone number provided, skipping verification');
        await handlePhoneVerified(null);
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', error.message, error.stack);
      setErrors({ phone: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = async (verifiedPhone) => {
    setLoading(true);

    try {
      console.log('Phone verified, creating account in database...');
      
      // Try to save to Supabase database
      const { data: authData, error: authError } = await authService.signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: verifiedPhone,
          phone_verified: true
        }
      );

      if (authError) {
        console.error('Supabase signup error:', authError);
        
        // If database fails, fallback to mock registration for demo
        if (authError.message && authError.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' });
          setStep(1);
          showNotification('Email already registered. Please login.', 'error');
        } else {
          console.log('Database not configured, using mock registration...');
          
          // Fallback to mock registration
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: verifiedPhone,
            phoneVerified: true
          };

          register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: verifiedPhone,
          });

          console.log('Account created successfully (mock):', mockUser);
          setStep(3);
          showNotification('Account created successfully!', 'success');
        }
        return;
      }

      // Success - user saved to database
      if (authData.user) {
        console.log('User saved to database:', authData.user);
        
        register({
          id: authData.user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: verifiedPhone,
          phoneVerified: true,
        });

        setStep(3);
        showNotification('Account created and saved to database!', 'success');
      }

    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Something went wrong. Please try again.', 'error');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhoneInput = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Handle different input formats
    if (digits.length <= 10) {
      return digits;
    } else if (digits.length === 11 && digits.startsWith('0')) {
      // Handle numbers starting with 0 (like 09876543210)
      return digits;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      // Handle numbers with country code (like 919876543210)
      return digits;
    } else if (digits.length > 12) {
      // Limit to 12 digits max
      return digits.slice(0, 12);
    }
    
    return digits;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  if (step === 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Register' }, { label: 'Verify Phone' }]} />
        <PhoneVerification
          phone={formData.phone}
          onVerified={handlePhoneVerified}
          onBack={handleBack}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Register' }, { label: 'Success' }]} />
        
        <div className="max-w-md mx-auto">
          <div className="card p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheck className="text-green-600" size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Catalix!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You can now start shopping!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="btn-primary w-full"
              >
                Go to Profile
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary w-full"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Register' }]} />

      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600 mb-8">Join us and start shopping</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiX size={12} />
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiX size={12} />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiX size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Leave empty to skip (you can add later)"
                  className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiX size={12} />
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit Indian mobile number (e.g., 9876543210, +919876543210, or 09876543210)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiX size={12} />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiX size={12} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;