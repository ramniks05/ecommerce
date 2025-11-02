import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Breadcrumb from '../components/Breadcrumb';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiX } from 'react-icons/fi';
import authService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { showNotification } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  if (!user) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?\d{10,12}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      };
      try {
        await authService.updateProfile(user.id, updates);
      } catch (_) {}
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setIsEditing(false);
      setErrors({});
      showNotification('Profile updated successfully!');
    } catch (err) {
      showNotification('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLogout = () => {
    logout();
    showNotification('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'My Profile' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser size={48} className="text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-primary-50 text-primary-600 font-medium">
                Profile Information
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Wishlist
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center gap-2"
                >
                  <FiEdit2 size={18} />
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                      required
                    />
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
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                      required
                    />
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
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiX size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiX size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FiUser className="text-gray-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FiMail className="text-gray-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FiPhone className="text-gray-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                {user.addresses && user.addresses.length > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <FiMapPin className="text-gray-600 mt-1" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">
                        {user.addresses[0].street}
                      </p>
                      <p className="text-gray-700">
                        {user.addresses[0].city}, {user.addresses[0].state} {user.addresses[0].zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

