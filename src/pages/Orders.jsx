import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders } from '../data/mockData';
import Breadcrumb from '../components/Breadcrumb';
import { FiPackage } from 'react-icons/fi';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter(order => order.userId === user.id);

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

  if (userOrders.length === 0) {
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

      <div className="space-y-6">
        {userOrders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Order #{order.id}
                </h3>
                <p className="text-gray-600">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <button className="btn-primary flex-1">Track Order</button>
                <button className="btn-secondary flex-1">View Details</button>
                {order.status === 'delivered' && (
                  <button className="btn-outline flex-1">Buy Again</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

