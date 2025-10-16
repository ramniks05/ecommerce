import { useState } from 'react';
import { orders as mockOrders } from '../../data/mockData';
import { FiEye, FiPackage } from 'react-icons/fi';

const OrdersManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    // In real app: await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600">{filteredOrders.length} orders found</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Order #{order.id}
                </h3>
                <p className="text-gray-600">
                  {order.date} • {order.items.length} items • ₹{order.total.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)} border-none cursor-pointer`}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="btn-primary flex items-center gap-2">
                <FiEye size={18} />
                View Details
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <FiPackage size={18} />
                Generate Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;

