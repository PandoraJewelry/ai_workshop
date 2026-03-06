import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  NotificationProvider,
  ThemeProvider,
  CartProvider,
  WishlistProvider,
} from './contexts';
import { Header, Footer, CartSidebar, NotificationToast } from './components/shared';
import { HomePage } from './components/features/home';
import { WishlistPage } from './components/features/wishlist';

function AppContent() {
  const navigate = useNavigate();

  const handleFilterCategory = useCallback(
    (category: string) => {
      const queryParams = category === 'all' ? '' : `?category=${category}`;
      navigate(`/${queryParams}`);
    },
    [navigate]
  );

  useEffect(() => {
    // Preload all products when app starts
    import('./services').then(({ getProducts }) => {
      getProducts();
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header onFilterCategory={handleFilterCategory} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      <Footer />

      <CartSidebar />
      <NotificationToast />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
