import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Discount, Product } from '../types';
import { validateDiscountCode } from '../services';
import { useNotification } from './NotificationContext';

const CART_STORAGE_KEY = 'pandora_cart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  discount: Discount | null;
  discountError: string | null;
  addItem: (product: Product | CartItem) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
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
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
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

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    const discountAmt = discount ? discount.discountAmount : 0;
    return Math.max(0, subtotal - discountAmt);
  }, [getSubtotal, discount]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
    setDiscount(null);
    setDiscountError(null);
  }, []);

  const applyDiscount = useCallback(async (code: string) => {
    setDiscountError(null);
    try {
      const subtotal = getSubtotal();
      const response = await validateDiscountCode(code, subtotal);
      if (response.valid && response.code && response.discount_type && response.value != null && response.discount_amount != null) {
        setDiscount({
          code: response.code,
          discountType: response.discount_type as 'percentage' | 'fixed',
          value: response.value,
          discountAmount: response.discount_amount,
        });
        setDiscountError(null);
      } else {
        setDiscount(null);
        setDiscountError(response.message);
      }
    } catch {
      setDiscountError('Failed to validate discount code');
    }
  }, [getSubtotal]);

  const removeDiscount = useCallback(() => {
    setDiscount(null);
    setDiscountError(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        discount,
        discountError,
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        getSubtotal,
        getItemCount,
        openCart,
        closeCart,
        toggleCart,
        clearCart,
        applyDiscount,
        removeDiscount,
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
