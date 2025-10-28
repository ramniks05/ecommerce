import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { initializeRazorpay, createRazorpayOrder } from '../utils/razorpay';
import Breadcrumb from '../components/Breadcrumb';
import { FiCheck } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zipCode: user?.addresses?.[0]?.zipCode || '',
    country: user?.addresses?.[0]?.country || 'USA',
    paymentMethod: 'razorpay',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate shipping info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate payment info
      if (formData.paymentMethod === 'razorpay') {
        // Razorpay - no card details needed
        setStep(3);
      } else if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVV) {
          showNotification('Please fill in all payment details', 'error');
          return;
        }
        setStep(3);
      } else {
        // COD or other methods
        setStep(3);
      }
    } else if (step === 3) {
      // Place order with payment
      const orderId = `ORD-${Date.now()}`;
      
      if (formData.paymentMethod === 'razorpay') {
        // Razorpay Payment Integration
        try {
          // Create Razorpay order
          const razorpayOrder = await createRazorpayOrder(total);
          
          const orderData = {
            orderId,
            razorpayOrderId: razorpayOrder.id,
            total,
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerEmail: formData.email,
            customerPhone: formData.phone,
          };

          // Initialize Razorpay checkout
          await initializeRazorpay(
            orderData,
            // Success callback
            (paymentResponse) => {
              console.log('Payment successful:', paymentResponse);
              clearCart();
              showNotification('Payment successful! Order placed.');
              navigate(`/order-confirmation/${orderId}`);
            },
            // Failure callback
            (error) => {
              console.error('Payment failed:', error);
              showNotification('Payment failed. Please try again.', 'error');
            }
          );
        } catch (error) {
          console.error('Error initializing payment:', error);
          showNotification('Payment initialization failed', 'error');
        }
      } else if (formData.paymentMethod === 'cod') {
        // Cash on Delivery - Direct order placement
        clearCart();
        showNotification('Order placed successfully! Pay on delivery.');
        navigate(`/order-confirmation/${orderId}`);
      } else {
        // Other payment methods (mock)
        clearCart();
        showNotification('Order placed successfully!');
        navigate(`/order-confirmation/${orderId}`);
      }
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Payment' },
    { number: 3, name: 'Review' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step >= s.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.number ? <FiCheck size={24} /> : s.number}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {s.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-32 h-1 mx-4 ${
                    step > s.number ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>

                <div className="mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-primary-200 bg-primary-50 rounded-lg cursor-pointer hover:border-primary-600 transition-colors mb-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div>
                        <span className="font-semibold block">Razorpay (Recommended)</span>
                        <span className="text-xs text-gray-600">UPI, Cards, Net Banking, Wallets</span>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600 transition-colors mb-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold">Cash on Delivery</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-semibold">Credit/Debit Card (Manual)</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Shipping Address
                  </h2>
                  <div className="text-gray-700">
                    <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p className="mt-2">{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-4"
                  >
                    Edit
                  </button>
                </div>

                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Payment Method
                  </h2>
                  <p className="text-gray-700">
                    {formData.paymentMethod === 'razorpay' && 'Razorpay (UPI, Cards, Net Banking, Wallets)'}
                    {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
                    {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
                  </p>
                  {formData.paymentMethod === 'card' && formData.cardNumber && (
                    <p className="text-gray-600 mt-2">
                      **** **** **** {formData.cardNumber.slice(-4)}
                    </p>
                  )}
                  {formData.paymentMethod === 'razorpay' && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        ✓ You will be redirected to Razorpay secure payment gateway
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-4"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
              )}
              <button type="submit" className="btn-primary flex-1">
                {step === 3 ? 'Place Order' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

