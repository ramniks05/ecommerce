import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-600">
            Order ID: <span className="font-semibold text-gray-900">{orderId}</span>
          </p>
        </div>

        <div className="card p-8 mb-8 text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What happens next?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-primary-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Order Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive a confirmation email with your order details shortly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiPackage className="text-primary-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                <p className="text-gray-600 text-sm">
                  We're preparing your items for shipment. This usually takes 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiTruck className="text-primary-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Shipping</h3>
                <p className="text-gray-600 text-sm">
                  Your order will be shipped and you'll receive tracking information via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-primary">
            View Order Details
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Need help? Contact our customer support
          </p>
          <div className="flex justify-center gap-6">
            <a href="mailto:support@brandstore.com" className="text-primary-600 hover:text-primary-700">
              support@brandstore.com
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:+1234567890" className="text-primary-600 hover:text-primary-700">
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

