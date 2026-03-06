import { useCart } from '../../contexts';
import type { CartItem } from '../../types';

function formatCustomizationSummary(item: CartItem): string {
  if (!item.customizationSummary) return '';
  return item.customizationSummary.map((c) => `${c.label}: ${c.value}`).join(' • ');
}

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCart();

  return (
    <>
      {/* Cart Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeCart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') closeCart();
          }}
          tabIndex={0}
          role="button"
          aria-label="Close cart"
        />
      )}

      {/* Cart Sidebar */}
      <div
        data-testid="cart-sidebar"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full invisible'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="bg-luxury text-white p-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">Shopping Cart</h3>
            <button data-testid="close-cart" onClick={closeCart} className="text-white hover:text-gold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 cart-scrollbar">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="cart-item bg-white rounded-lg shadow p-4 mb-4">
                  {item.isCustomized && (
                    <div className="inline-block bg-gold text-white text-xs px-2 py-1 rounded mb-2">
                      Customized
                    </div>
                  )}
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                      {item.isCustomized && item.customizationSummary && (
                        <div className="text-xs text-gray-600 mb-1">
                          {formatCustomizationSummary(item)}
                        </div>
                      )}
                      <p className="text-gold font-bold mb-2">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        {!item.isCustomized ? (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center"
                            >
                              <span className="text-lg font-bold">-</span>
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        )}
                        <button
                          data-testid="remove-item"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-gold">${getTotal().toFixed(2)}</span>
            </div>
            <button className="w-full bg-gold hover:bg-dark-gold text-white font-bold py-3 rounded-lg transition-colors">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
