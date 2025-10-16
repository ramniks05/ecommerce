import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiTag, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check for admin session
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
  }, []);

  // Check if user is admin
  const isAdmin = adminUser || user?.email === 'demo@example.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin' },
    { icon: FiPackage, label: 'Products', path: '/admin/products' },
    { icon: FiTag, label: 'Brands', path: '/admin/brands' },
    { icon: FiTag, label: 'Categories', path: '/admin/categories' },
    { icon: FiShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: FiUsers, label: 'Users', path: '/admin/users' },
    { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isAdmin');
    setAdminUser(null);
    
    // Also logout regular user if logged in
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-gray-900 text-white min-h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <svg className="w-8 h-8 text-primary-400" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="currentColor"/>
              <path d="M12 20C12 15.58 15.58 12 20 12C24.42 12 28 15.58 28 20C28 24.42 24.42 28 20 28C15.58 28 12 24.42 12 20Z" fill="white"/>
              <path d="M20 16L24 20L20 24L16 20L20 16Z" fill="currentColor"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold">Catalix</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsSidebarOpen(false)}>
          <aside className="w-64 bg-gray-900 text-white min-h-screen" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-primary-400" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="currentColor"/>
                    <path d="M12 20C12 15.58 15.58 12 20 12C24.42 12 28 15.58 28 20C28 24.42 24.42 28 20 28C15.58 28 12 24.42 12 20Z" fill="white"/>
                    <path d="M20 16L24 20L20 24L16 20L20 16Z" fill="currentColor"/>
                  </svg>
                  <div>
                    <h1 className="text-xl font-bold">Catalix</h1>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                  </div>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
                >
                  <FiLogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <FiMenu size={24} />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
                View Store →
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {user?.firstName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {adminUser?.name || user?.firstName || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

