import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { showNotification } = useNotification();

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + shipping + tax;

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    showNotification(`${productName} removed from cart`, 'info');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
        <div className="text-center py-16">
          <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="card p-6">
                <div className="flex gap-6">
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/products/${item.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.brandName}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="px-6 py-2 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-600">
                            ₹{item.price} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (18%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              
              {subtotal < 5000 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  Add ₹{(5000 - subtotal).toFixed(2)} more to get FREE shipping!
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full block text-center mb-4">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="btn-secondary w-full block text-center">
              Continue Shopping
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">We accept</p>
              <div className="flex justify-center gap-3">
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-700">
                  VISA
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-700">
                  MASTER
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-700">
                  AMEX
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-700">
                  PAYPAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

