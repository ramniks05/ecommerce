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

  if (!window.Razorpay) {
    onFailure('Razorpay SDK not available on window');
    return;
  }

  // Razorpay configuration
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  // Better error message for debugging
  if (!keyId) {
    console.error('❌ VITE_RAZORPAY_KEY_ID is not set in environment variables.');
    console.error('For local: Set in .env.local file');
    console.error('For Vercel: Set in Project Settings → Environment Variables');
    console.error('Then redeploy to apply changes.');
    onFailure('Razorpay key is missing. Set VITE_RAZORPAY_KEY_ID in environment variables. See console for details.');
    return;
  }
  
  if (keyId.includes('rzp_test_XXXXX') || keyId.includes('your-key') || keyId.trim() === '') {
    onFailure('Razorpay key appears to be a placeholder. Please set a valid VITE_RAZORPAY_KEY_ID.');
    return;
  }

  const amountPaise = Math.max(100, Math.round((orderData.total || 0) * 100));

  const useMockEnv = (import.meta.env.VITE_RAZORPAY_MODE || '').toLowerCase() === 'mock';
  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const useMockMode = useMockEnv || isLocalHost;

  const optionsBase = {
    key: keyId, // Your Razorpay Key ID
    amount: amountPaise, // Amount in paise (min ₹1)
    currency: 'INR',
    name: 'Catalix',
    description: `Order ${orderData.orderId}`,
    image: '/catalix-logo.svg',
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

  // Only attach order_id when using a real backend-generated order
  const options = (!useMockMode && orderData.razorpayOrderId)
    ? { ...optionsBase, order_id: orderData.razorpayOrderId }
    : optionsBase;

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
export const createRazorpayOrder = async (total) => {
  const amountPaise = Math.max(100, Math.round(Number(total || 0) * 100));

  // Prefer explicit base URL if provided
  const explicitBase = import.meta.env.VITE_PUBLIC_BASE_URL;
  const isVercel = typeof window !== 'undefined' && /vercel\.app$/i.test(window.location.host);
  const base = (explicitBase && explicitBase.replace(/\/$/, '')) || (isVercel ? window.location.origin : '');

  // If we don't have a server base in local dev, fall back to mock
  if (!base) {
    return {
      id: `order_${Date.now()}`,
      amount: amountPaise,
      currency: 'INR',
    };
  }

  try {
    const res = await fetch(`${base}/api/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR' })
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new Error(data?.error?.description || data?.error || 'Failed to create order');
    }
    return data;
  } catch (err) {
    // Fallback to mock in dev
    return {
      id: `order_${Date.now()}`,
      amount: amountPaise,
      currency: 'INR',
    };
  }
};

