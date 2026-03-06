import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';
import { useNotification } from './NotificationContext';
import { useCart } from './CartContext';

const WISHLIST_STORAGE_KEY = 'pandora_wishlist';

interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: number) => boolean;
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => boolean;
  moveToCart: (productId: number) => void;
  getItemCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function loadWishlist(): Product[] {
  if (typeof localStorage === 'undefined') return [];
  const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveWishlist(items: Product[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);
  const { show } = useNotification();
  const { addItem: addToCart } = useCart();

  const isInWishlist = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  );

  const addItem = useCallback(
    (product: Product): boolean => {
      if (isInWishlist(product.id)) {
        return false;
      }

      setItems((prev) => {
        const newItems = [...prev, product];
        saveWishlist(newItems);
        return newItems;
      });

      show(`${product.name} added to wishlist`);
      return true;
    },
    [isInWishlist, show]
  );

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== productId);
      saveWishlist(newItems);
      return newItems;
    });
  }, []);

  const toggleItem = useCallback(
    (product: Product): boolean => {
      if (isInWishlist(product.id)) {
        removeItem(product.id);
        return false;
      } else {
        addItem(product);
        return true;
      }
    },
    [isInWishlist, removeItem, addItem]
  );

  const moveToCart = useCallback(
    (productId: number) => {
      const product = items.find((item) => item.id === productId);
      if (product) {
        addToCart(product);
        removeItem(productId);
        show(`${product.name} moved to cart`);
      }
    },
    [items, addToCart, removeItem, show]
  );

  const getItemCount = useCallback(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addItem,
        removeItem,
        toggleItem,
        moveToCart,
        getItemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
