import { useState } from 'react';
import { FiMail, FiPhone, FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { otpFlow, phoneValidation } from '../services/otpService';

const LoginOptions = ({ onEmailLogin, onMobileLogin, onGoogleLogin, onBack }) => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'mobile', 'google'
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [mobileForm, setMobileForm] = useState({ phone: '', otp: ['', '', '', '', '', ''] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // Timer for OTP
  useState(() => {
    if (otpSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onEmailLogin(emailForm.email, emailForm.password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneValidation.isValidIndianPhone(mobileForm.phone)) {
      setError('Please enter a valid Indian mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = phoneValidation.formatIndianPhone(mobileForm.phone);
      const result = await otpFlow.sendPhoneOTP(formattedPhone);
      
      if (result.success) {
        setOtpSent(true);
        setTimeLeft(300);
        setSuccess('OTP sent to your mobile number');
        setMobileForm(prev => ({ ...prev, phone: formattedPhone }));
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...mobileForm.otp];
    newOtp[index] = value;
    setMobileForm(prev => ({ ...prev, otp: newOtp }));

    if (value && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleMobileLogin(newOtp.join(''));
    }
  };

  const handleMobileLogin = async (otpCode = null) => {
    const otpToVerify = otpCode || mobileForm.otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await otpFlow.verifyPhoneOTP(mobileForm.phone, otpToVerify);
      
      if (result.success) {
        const loginResult = await onMobileLogin(mobileForm.phone);
        if (!loginResult.success) {
          setError(loginResult.error);
        }
      } else {
        setError(result.error);
        setMobileForm(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
        document.getElementById('login-otp-0')?.focus();
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await onGoogleLogin();
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneInput = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 10);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Method Tabs - Mobile login temporarily disabled */}
        <div className="mb-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-center">
            <p className="text-sm text-primary-900 font-medium">
              <FiMail className="inline mr-2" size={16} />
              Email Login
            </p>
          </div>
          {/* Mobile login temporarily disabled - requires SMS provider setup
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiMail className="inline mr-2" size={16} />
              Email
            </button>
            <button
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiPhone className="inline mr-2" size={16} />
              Mobile
            </button>
          </div>
          */}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <FiX className="text-red-600 flex-shrink-0" size={16} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <FiCheck className="text-green-600 flex-shrink-0" size={16} />
            <span className="text-green-600 text-sm">{success}</span>
          </div>
        )}

        {/* Email Login */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiEye className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Mobile Login */}
        {loginMethod === 'mobile' && (
          <div className="space-y-4">
            {!otpSent ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={mobileForm.phone}
                    onChange={(e) => setMobileForm(prev => ({ 
                      ...prev, 
                      phone: formatPhoneInput(e.target.value) 
                    }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="9876543210"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter 10-digit Indian mobile number
                </p>

                <button
                  onClick={handleSendOTP}
                  disabled={loading || !phoneValidation.isValidIndianPhone(mobileForm.phone)}
                  className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    OTP sent to {phoneValidation.getDisplayFormat(mobileForm.phone)}
                  </p>
                  {timeLeft > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expires in <span className="font-semibold text-primary-600">{formatTime(timeLeft)}</span>
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Enter verification code
                  </label>
                  <div className="flex justify-center gap-3">
                    {mobileForm.otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`login-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleMobileLogin()}
                  disabled={loading || mobileForm.otp.join('').length !== 6}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setMobileForm(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
                      setSuccess('');
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Google Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 mx-auto"
          >
            <FiArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
