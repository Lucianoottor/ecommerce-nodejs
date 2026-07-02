import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/format';
import Button from '../components/Button';
import type { Transaction } from '../types';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<Transaction | null>(null);
  const cartSyncedRef = useRef(false);

  if (items.length === 0 && !confirmation) {
    navigate('/cart');
    return null;
  }

  if (confirmation) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Order #{confirmation.transactionId} — {formatPrice(confirmation.totalAmount)}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Payment: {confirmation.paymentMethod === 'pix' ? 'PIX' : 'Credit Card'} — Status: {confirmation.status}
        </p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Sync cart items to backend only once per checkout session —
      // retrying a failed payment must not re-add quantities on top of what's already there.
      if (!cartSyncedRef.current) {
        for (const item of items) {
          await api.post('/cart/addItem', {
            productId: item.product.productId,
            quantity: item.quantity,
          });
        }
        cartSyncedRef.current = true;
      }

      const endpoint = paymentMethod === 'pix' ? '/payment/pix' : '/payment/credit-card';
      const res = await api.post(endpoint);
      setConfirmation(res.data.data);
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      showToast(error.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 mb-6">
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Order Summary</h2>
          {items.map((item) => (
            <div key={item.product.productId} className="flex items-center justify-between py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 ml-4">
                {formatPrice(parseFloat(item.product.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Payment Method</h2>
        <div className="space-y-2">
          {[
            { value: 'pix', label: 'PIX', desc: 'Instant payment' },
            { value: 'credit_card', label: 'Credit Card', desc: '50% chance of approval (demo)' },
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === method.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{method.label}</p>
                <p className="text-xs text-gray-500">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/cart" className="flex-1">
          <Button variant="secondary" className="w-full">Back to Cart</Button>
        </Link>
        <Button onClick={handlePlaceOrder} loading={loading} className="flex-1">
          Place Order
        </Button>
      </div>
    </div>
  );
}
