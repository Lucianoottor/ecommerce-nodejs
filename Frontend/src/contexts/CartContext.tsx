import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types';

export interface LocalCartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: LocalCartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | null>(null);

function getCartKey(userId: number | undefined): string {
  return userId ? `cart_${userId}` : 'cart_guest';
}

function loadCart(userId: number | undefined): LocalCartItem[] {
  try {
    const saved = localStorage.getItem(getCartKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<LocalCartItem[]>(() => loadCart(user?.id));

  // Reload cart when user changes (login/logout/switch)
  useEffect(() => {
    setItems(loadCart(user?.id));
  }, [user?.id]);

  // Persist to the correct user key
  useEffect(() => {
    localStorage.setItem(getCartKey(user?.id), JSON.stringify(items));
  }, [items, user?.id]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}
