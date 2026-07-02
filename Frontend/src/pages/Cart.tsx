import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started"
          action={
            <Link to="/products">
              <Button variant="secondary">Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cart</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.product.productId} data-testid="cart-item" className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.product.productId}`}
                className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate block"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
            </div>

            <select
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product.productId, Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Quantity for ${item.product.name}`}
            >
              {Array.from({ length: Math.min(item.product.stock, 10) }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <p className="text-sm font-medium text-gray-900 w-24 text-right">
              {formatPrice(parseFloat(item.product.price) * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.product.productId)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label={`Remove ${item.product.name}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/products" className="flex-1">
            <Button variant="secondary" className="w-full">Continue Shopping</Button>
          </Link>
          <Link to="/checkout" className="flex-1">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
