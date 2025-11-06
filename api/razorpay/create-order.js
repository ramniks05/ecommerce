export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body || {};

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      const missing = [];
      if (!keyId) missing.push('RAZORPAY_KEY_ID');
      if (!keySecret) missing.push('RAZORPAY_KEY_SECRET');
      
      console.error(`❌ Razorpay server credentials missing: ${missing.join(', ')}`);
      console.error('Set these in Vercel: Project Settings → Environment Variables');
      console.error('Note: These are SERVER variables (no VITE_ prefix)');
      
      res.status(500).json({ 
        error: 'Razorpay credentials missing on server',
        missing: missing,
        hint: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment variables (without VITE_ prefix)'
      });
      return;
    }

    const amountPaise = Math.max(100, Math.round(Number(amount || 0))); // server expects paise

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1
      })
    });

    const data = await rpRes.json();
    if (!rpRes.ok) {
      res.status(rpRes.status).json({ error: data?.error || data });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Failed to create order' });
  }
}


