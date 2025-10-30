import { useEffect, useState } from 'react';
import { FiEye, FiPackage } from 'react-icons/fi';
import { orderService, fileService } from '../../services/supabaseService';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await orderService.getAllOrders();
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredOrders = orders.filter(o => {
    const byStatus = statusFilter === 'all' || (o.status || 'processing') === statusFilter;
    const byPayment = paymentFilter === 'all' || (o.payment_status || 'pending') === paymentFilter;
    return byStatus && byPayment;
  });

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

  const updateOrderStatus = async (orderId, newStatus) => {
    const previous = orders;
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (_) {
      setOrders(previous);
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    const previous = orders;
    setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o));
    try {
      await orderService.updatePaymentStatus(orderId, newStatus);
    } catch (_) {
      setOrders(previous);
    }
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
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
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
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm text-gray-600">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          </div>
        ) : filteredOrders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Order #{order.order_number || order.id}
                </h3>
                <p className="text-gray-600">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : ''} • ₹{Number(order.total_amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status || 'processing'}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status || 'processing')} border-none cursor-pointer`}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={order.payment_status || 'pending'}
                  onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border-none cursor-pointer"
                >
                  <option value="pending">Payment Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {(order.order_items || []).map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={(() => {
                      const img = (item.products?.images?.[0]) || '';
                      if (!img) return '';
                      return (String(img).startsWith('http') || String(img).includes('/storage/v1/object/public/'))
                        ? img
                        : fileService.getPublicUrl('product-images', img);
                    })()}
                    alt={item.products?.name || ''}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.products?.name || ''}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">₹{Number(item.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-700">
                {order.shipping_address?.address}, {order.shipping_address?.city}<br />
                {order.shipping_address?.state} {order.shipping_address?.zipCode}, {order.shipping_address?.country}
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

