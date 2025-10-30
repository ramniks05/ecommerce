import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiEye, FiEyeOff, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiShield } from 'react-icons/fi';
import { adminService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: [],
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load admin users
      const { data: adminData, error: adminError } = await adminService.getAdminUsers();
      if (adminError) throw adminError;
      setAdminUsers(adminData || []);

      // Load customers from user_profiles
      const { data: customers, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (usersError) throw usersError;
      setUsers(Array.isArray(customers) ? customers : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = (`${user.first_name || ''} ${user.last_name || ''}`).trim().toLowerCase();
    const email = (user.email || '').toLowerCase();
    const search = (searchQuery || '').toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });
  const toggleUserActive = async (u) => {
    const prev = users;
    setUsers(users.map(x => x.id === u.id ? { ...x, is_active: !u.is_active } : x));
    try {
      await supabase.from('user_profiles').update({ is_active: !u.is_active }).eq('id', u.id);
    } catch (e) {
      setUsers(prev);
    }
  };

  const filteredAdmins = adminUsers.filter(admin => {
    const name = (admin.name || '').toLowerCase();
    const email = (admin.email || '').toLowerCase();
    const search = (searchQuery || '').toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await adminService.updateAdminUser(editingAdmin.id, adminFormData);
      } else {
        await adminService.createAdminUser(adminFormData);
      }
      
      setShowAdminModal(false);
      setEditingAdmin(null);
      resetAdminForm();
      loadData();
    } catch (error) {
      console.error('Error saving admin user:', error);
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'admin',
      permissions: admin.permissions || [],
      is_active: admin.is_active
    });
    setShowAdminModal(true);
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        await adminService.deleteAdminUser(id);
        loadData();
      } catch (error) {
        console.error('Error deleting admin user:', error);
      }
    }
  };

  const resetAdminForm = () => {
    setAdminFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      permissions: [],
      is_active: true
    });
  };

  const togglePermission = (permission) => {
    setAdminFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const availablePermissions = [
    'products',
    'orders',
    'brands',
    'categories',
    'banners',
    'users',
    'settings',
    'analytics'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage customers and admin users</p>
        </div>
        {activeTab === 'admins' && (
          <button
            onClick={() => {
              resetAdminForm();
              setEditingAdmin(null);
              setShowAdminModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiUser size={20} />
            Add Admin User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Customers ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'admins'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Admin Users ({adminUsers.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <FiMail size={14} className="text-gray-400" />
                        {user.email || '(no email)'}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <FiPhone size={14} className="text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.addresses && user.addresses.length > 0 ? (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1 mb-1">
                            <FiMapPin size={12} className="text-gray-400" />
                            {user.addresses[0].city}, {user.addresses[0].state}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.addresses[0].pincode}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No address</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={12} className="text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <FiEye size={16} />
                        </button>
                        <button onClick={() => toggleUserActive(user)} className="text-gray-600 hover:text-gray-900">
                          {user.is_active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <FiShield className="text-yellow-600" size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.slice(0, 3).map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                        {admin.permissions.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            +{admin.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.last_login ? (
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} className="text-gray-400" />
                          {new Date(admin.last_login).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAdmin ? 'Edit Admin User' : 'Add New Admin User'}
                </h3>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminFormData.name}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {!editingAdmin && '*'}
                    </label>
                    <input
                      type="password"
                      required={!editingAdmin}
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={editingAdmin ? "Leave blank to keep current" : "Enter password"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      required
                      value={adminFormData.role}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={adminFormData.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {permission.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={adminFormData.is_active}
                    onChange={(e) => setAdminFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {editingAdmin ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
