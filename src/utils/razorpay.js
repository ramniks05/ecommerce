// Razorpay Payment Integration

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpay = async (orderData, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  // Razorpay configuration
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXX', // Your Razorpay Key ID
    amount: Math.round(orderData.total * 100), // Amount in paise (₹1 = 100 paise)
    currency: 'INR',
    name: 'Catalix',
    description: `Order ${orderData.orderId}`,
    image: '/catalix-logo.svg',
    order_id: orderData.razorpayOrderId, // This comes from backend
    handler: function (response) {
      // Payment successful
      onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      contact: orderData.customerPhone,
    },
    notes: {
      order_id: orderData.orderId,
    },
    theme: {
      color: '#0284c7', // Primary color
    },
    modal: {
      ondismiss: function() {
        onFailure('Payment cancelled by user');
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Verify payment signature (should be done on backend in production)
export const verifyPaymentSignature = (razorpayData) => {
  // In production, this verification MUST happen on backend
  // This is just for demonstration
  console.log('Payment data to verify:', razorpayData);
  return true; // Mock verification
};

// Create Razorpay order (this should be backend API call)
export const createRazorpayOrder = async (amount) => {
  // In production, call your backend API:
  // const response = await fetch('/api/payment/create-order', {
  //   method: 'POST',
  //   body: JSON.stringify({ amount }),
  // });
  
  // For now, return mock order
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100,
    currency: 'INR',
  };
};

