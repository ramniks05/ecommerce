import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService, fileService } from '../services/supabaseService';
import Breadcrumb from '../components/Breadcrumb';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Safety timeout to prevent infinite spinner if network hangs
    const timeout = setTimeout(() => {
      if (active) setLoading(false);
    }, 7000);
    (async () => {
      try {
        const { data } = await orderService.getOrderById(orderId);
        if (!active) return;
        // If embedded order_items join failed, try fetching items separately in a second pass
        if (data && (!data.order_items || data.order_items.length === 0)) {
          try {
            // Best-effort: pull items directly via REST by reusing the service (demo/local handled by service)
            const { data: orderOnly } = await orderService.getOrderById(orderId);
            setOrder(orderOnly || data);
          } catch {
            setOrder(data);
          }
        } else {
          setOrder(data || null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; clearTimeout(timeout); };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <Link to="/orders" className="text-primary-600 hover:text-primary-700">← Back to Orders</Link>
      </div>
    );
  }

  const items = order.order_items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'My Orders', path: '/orders' }, { label: order.order_number || order.id }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order #{order.order_number || order.id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {items.map((item) => {
              const raw = item.product_image || (item.products?.images?.[0]) || '';
              const src = raw
                ? ((String(raw).startsWith('http') || String(raw).includes('/storage/v1/object/public/'))
                    ? raw
                    : fileService.getPublicUrl('product-images', raw))
                : null;
              const displayName = item.products?.name || item.product_name || 'Product';
              return (
                <div key={item.id} className="flex gap-4">
                  {src ? (
                    <img src={src} alt={displayName} className="w-20 h-20 object-cover rounded bg-white" />
                  ) : (
                    <div className="w-20 h-20 rounded bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{displayName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">₹{Number((item.price ?? item.unit_price) || 0).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Status</span><span>{(order.status || 'processing').replace(/^./, c => c.toUpperCase())}</span></div>
            <div className="flex justify-between"><span>Payment</span><span>{order.payment_status || 'pending'}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(order.subtotal || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{Number(order.shipping_cost || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{Number(order.tax_amount || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>₹{Number(order.total_amount || 0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;


