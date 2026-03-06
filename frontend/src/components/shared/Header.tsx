import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useWishlist, useTheme } from '../../contexts';

interface HeaderProps {
  onFilterCategory: (category: string) => void;
}

export function Header({ onFilterCategory }: HeaderProps) {
  const { openCart, getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileFilter = (category: string) => {
    onFilterCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-luxury text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider">
              <Link to="/" className="hover:text-gold transition-colors">
                <span className="text-gold">STEEP HOUSE</span>
              </Link>
            </h1>

            <div className="flex items-center gap-4">
              {/* Desktop Menu */}
              <nav className="hidden md:flex gap-6 mr-4">
                <button
                  onClick={() => onFilterCategory('all')}
                  className="text-white hover:text-gold transition-colors"
                >
                  All
                </button>
                <button
                  onClick={() => onFilterCategory('black')}
                  className="text-white hover:text-gold transition-colors"
                >
                  Black
                </button>
                <button
                  onClick={() => onFilterCategory('green')}
                  className="text-white hover:text-gold transition-colors"
                >
                  Green
                </button>
                <button
                  onClick={() => onFilterCategory('oolong')}
                  className="text-white hover:text-gold transition-colors"
                >
                  Oolong
                </button>
                <button
                  onClick={() => onFilterCategory('herbal')}
                  className="text-white hover:text-gold transition-colors"
                >
                  Herbal
                </button>
              </nav>

              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                data-testid="wishlist-link"
                className="relative text-white hover:text-gold transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span data-testid="wishlist-badge" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[20px] text-center">
                  {getWishlistCount()}
                </span>
              </Link>

              {/* Dark Mode Toggle */}
              <button
                data-testid="theme-toggle"
                onClick={toggleTheme}
                className="text-white hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-luxury rounded-lg p-1"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              {/* Cart Button */}
              <button
                data-testid="cart-button"
                onClick={openCart}
                className="relative bg-gold hover:bg-dark-gold px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span data-testid="cart-badge" className="bg-black text-white rounded-full px-2 py-0.5 text-xs">
                    {getItemCount()}
                  </span>
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-luxury text-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <button
              onClick={() => handleMobileFilter('all')}
              className="text-left hover:text-gold transition-colors py-2"
            >
              All Teas
            </button>
            <button
              onClick={() => handleMobileFilter('black')}
              className="text-left hover:text-gold transition-colors py-2"
            >
              Black Tea
            </button>
            <button
              onClick={() => handleMobileFilter('green')}
              className="text-left hover:text-gold transition-colors py-2"
            >
              Green Tea
            </button>
            <button
              onClick={() => handleMobileFilter('oolong')}
              className="text-left hover:text-gold transition-colors py-2"
            >
              Oolong Tea
            </button>
            <button
              onClick={() => handleMobileFilter('herbal')}
              className="text-left hover:text-gold transition-colors py-2"
            >
              Herbal Tea
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
