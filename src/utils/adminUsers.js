// Admin users configuration
// In production, this should be stored in Supabase database

export const ADMIN_USERS = [
  {
    id: 'admin-1',
    email: 'admin@catalix.com',
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User',
    role: 'super_admin',
    permissions: ['all'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-2', 
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo Admin',
    role: 'admin',
    permissions: ['products', 'orders', 'brands'],
    createdAt: new Date().toISOString()
  }
];

// Check if user is admin
export const isAdminUser = (email) => {
  return ADMIN_USERS.some(user => user.email === email);
};

// Get admin user by email
export const getAdminUser = (email) => {
  return ADMIN_USERS.find(user => user.email === email);
};

// Verify admin credentials
export const verifyAdminCredentials = (email, password) => {
  const user = getAdminUser(email);
  if (user && user.password === password) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    };
  }
  return {
    success: false,
    error: 'Invalid credentials'
  };
};

// Get all admin users (for admin management)
export const getAllAdminUsers = () => {
  return ADMIN_USERS.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
    createdAt: user.createdAt
  }));
};
