import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, fileService } from '../services/supabaseService';
import Breadcrumb from '../components/Breadcrumb';
import { FiPackage } from 'react-icons/fi';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    let active = true;
    (async () => {
      try {
        const { data, error } = await orderService.getUserOrders(user.id);
        if (!active) return;
        if (error) {
          setUserOrders([]);
        } else {
          setUserOrders(Array.isArray(data) ? data : []);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user, navigate]);

  if (!user) return null;

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

  if (!loading && userOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: 'My Orders' }]} />
        <div className="text-center py-16">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet.
          </p>
          <Link to="/products" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'My Orders' }]} />

      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
        {userOrders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Order #{order.order_number || order.id}
                </h3>
                <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status || 'processing')}`}>
                  {(order.status || 'processing').replace(/^./, c => c.toUpperCase())}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{Number(order.total_amount || order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {(order.order_items || []).map((item) => (
                <div key={item.id} className="flex gap-4">
                  {(() => {
                    const img = item.product_image || (item.products?.images?.[0]) || '';
                    if (!img) return <div className="w-20 h-20 rounded-lg bg-gray-100" />;
                    const src = (String(img).startsWith('http') || String(img).includes('/storage/v1/object/public/'))
                      ? img
                      : fileService.getPublicUrl('product-images', img);
                    return (
                      <img
                        src={src}
                        alt={item.products?.name || item.product_name || ''}
                        className="w-20 h-20 object-cover rounded-lg bg-white"
                      />
                    );
                  })()}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.products?.name || item.product_name || ''}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ₹{Number((item.price ?? item.unit_price) || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  className="btn-primary flex-1"
                  onClick={() => navigate(`/orders/${order.order_number || order.id}`)}
                >
                  Track Order
                </button>
                <button
                  className="btn-secondary flex-1"
                  onClick={() => navigate(`/orders/${order.order_number || order.id}`)}
                >
                  View Details
                </button>
                {(order.status || '') === 'delivered' && (
                  <button className="btn-outline flex-1">Buy Again</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default Orders;

