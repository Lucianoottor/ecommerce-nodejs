import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    if (!isAuthenticated) {
      showToast('You need to login first', 'error');
      return;
    }
    addItem(product);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link
      to={`/products/${product.productId}`}
      data-testid="product-card"
      className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-16 h-16 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-lg font-semibold text-gray-900 mt-auto mb-3">
          {formatPrice(product.price)}
        </p>

        {product.stock > 0 ? (
          <Button size="sm" onClick={handleAdd} className="w-full">
            Add to Cart
          </Button>
        ) : (
          <Button size="sm" disabled className="w-full">
            Out of Stock
          </Button>
        )}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
