import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { useNotification } from './NotificationContext';

const CART_STORAGE_KEY = 'pandora_cart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product | CartItem) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  getTotal: () => number;
  getItemCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  if (typeof localStorage === 'undefined') return [];
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCart(items: CartItem[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const { show } = useNotification();

  const addItem = useCallback((product: Product | CartItem) => {
    setItems((prevItems) => {
      let newItems: CartItem[];

      if ('isCustomized' in product && product.isCustomized) {
        newItems = [...prevItems, { ...product, quantity: 1 } as CartItem];
      } else {
        const existingItem = prevItems.find(
          (item) => item.id === product.id && !item.isCustomized
        );

        if (existingItem) {
          newItems = prevItems.map((item) =>
            item.id === product.id && !item.isCustomized
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...prevItems, { ...product, quantity: 1 } as CartItem];
        }
      }

      saveCart(newItems);
      return newItems;
    });

    show(`${product.name} added to cart`);
  }, [show]);

  const removeItem = useCallback((productId: number | string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      saveCart(newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return newItems;
    });
  }, [removeItem]);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        getItemCount,
        openCart,
        closeCart,
        toggleCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
