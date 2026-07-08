'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCartContents } from '@/app/cart-actions';

type CartItem = {
  id: number;
  quantity: number;
  variantId: number;
  sizeMl: number;
  price: string;
  stock: number;
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    const data = await getCartContents();
    setItems(data.items);
    setTotal(data.total);
    setItemCount(data.itemCount);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}