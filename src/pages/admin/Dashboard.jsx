import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 19,
    totalOrders: 2,
    totalUsers: 1,
    totalRevenue: 580.46,
    recentOrders: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <FiTrendingUp size={16} />
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
          </div>

          {/* Total Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiShoppingBag className="text-blue-600" size={24} />
              </div>
              <span className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                <FiTrendingUp size={16} />
                +8.2%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          {/* Total Products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiPackage className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          {/* Total Users */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FiUsers className="text-orange-600" size={24} />
              </div>
              <span className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                <FiTrendingUp size={16} />
                +15.3%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/products/new"
            className="card p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
                <FiPackage className="text-primary-600 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Product</h3>
                <p className="text-sm text-gray-600">Create new product</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/brands"
            className="card p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
                <svg className="text-primary-600 group-hover:text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Brands</h3>
                <p className="text-sm text-gray-600">View all brands</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="card p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
                <FiShoppingBag className="text-primary-600 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Manage orders</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="card p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-600 transition-colors">
                <svg className="text-primary-600 group-hover:text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Site configuration</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders & Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Order #ORD-2024-002</p>
                  <p className="text-sm text-gray-600">2 items • ₹240.97</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  Shipped
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Order #ORD-2024-001</p>
                  <p className="text-sm text-gray-600">1 item • ₹339.49</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Delivered
                </span>
              </div>
            </div>
            <Link
              to="/admin/orders"
              className="block text-center mt-6 text-primary-600 font-semibold hover:text-primary-700"
            >
              View All Orders →
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Products in Stock</p>
                  <p className="text-2xl font-bold text-gray-900">19</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Active Brands</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <div className="text-primary-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <div className="text-orange-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

