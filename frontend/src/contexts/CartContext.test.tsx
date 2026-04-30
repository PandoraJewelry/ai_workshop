import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import { NotificationProvider } from './NotificationContext'
import type { Product } from '../types'

vi.mock('../services', () => ({
  validateDiscountCode: vi.fn(),
}))

const mockProduct: Product = {
  id: 1,
  name: 'Green Dragon Tea',
  price: 29.99,
  category: 'green',
  material: 'China',
  image: '/images/green-dragon.jpg',
  description: 'A premium green tea',
  customizable: true,
}

const mockProduct2: Product = {
  id: 2,
  name: 'Earl Grey Classic',
  price: 24.99,
  category: 'black',
  material: 'India',
  image: '/images/earl-grey.jpg',
  description: 'Classic black tea',
  customizable: false,
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>
    <CartProvider>{children}</CartProvider>
  </NotificationProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
  })

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([])
    expect(result.current.getItemCount()).toBe(0)
    expect(result.current.getTotal()).toBe(0)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe(1)
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.getItemCount()).toBe(1)
  })

  it('increases quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.getItemCount()).toBe(2)
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.removeItem(1)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.getItemCount()).toBe(0)
  })

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.updateQuantity(1, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.getItemCount()).toBe(5)
  })

  it('removes item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.updateQuantity(1, 0)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct) // 29.99
      result.current.addItem(mockProduct2) // 24.99
      result.current.addItem(mockProduct) // +29.99
    })

    // 29.99 * 2 + 24.99 = 84.97
    expect(result.current.getTotal()).toBeCloseTo(84.97, 2)
  })

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct2)
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.getItemCount()).toBe(0)
    expect(result.current.getTotal()).toBe(0)
  })

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('loads cart from localStorage on init', () => {
    const savedCart = JSON.stringify([
      { ...mockProduct, quantity: 2 }
    ])
    vi.mocked(localStorage.getItem).mockReturnValue(savedCart)

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('opens and closes cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.openCart()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeCart()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('toggles cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.toggleCart()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.toggleCart()
    })
    expect(result.current.isOpen).toBe(false)
  })

  describe('Discount functionality', () => {
    it('applies a valid discount code', async () => {
      const { validateDiscountCode } = await import('../services')
      const mockedValidate = vi.mocked(validateDiscountCode)
      mockedValidate.mockResolvedValue({
        valid: true,
        code: 'TEA10',
        discount_type: 'percentage',
        value: 10,
        discount_amount: 3.0,
        message: 'Discount applied: TEA10',
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockProduct) // 29.99
      })

      await act(async () => {
        await result.current.applyDiscount('TEA10')
      })

      expect(result.current.discount).not.toBeNull()
      expect(result.current.discount?.code).toBe('TEA10')
      expect(result.current.discount?.discountAmount).toBe(3.0)
      expect(result.current.getTotal()).toBeCloseTo(29.99 - 3.0, 2)
    })

    it('sets error for invalid discount code', async () => {
      const { validateDiscountCode } = await import('../services')
      const mockedValidate = vi.mocked(validateDiscountCode)
      mockedValidate.mockResolvedValue({
        valid: false,
        code: null,
        discount_type: null,
        value: null,
        discount_amount: null,
        message: 'Invalid discount code',
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.applyDiscount('INVALID')
      })

      expect(result.current.discount).toBeNull()
      expect(result.current.discountError).toBe('Invalid discount code')
    })

    it('removes discount and restores original total', async () => {
      const { validateDiscountCode } = await import('../services')
      const mockedValidate = vi.mocked(validateDiscountCode)
      mockedValidate.mockResolvedValue({
        valid: true,
        code: 'SAVE5',
        discount_type: 'fixed',
        value: 5,
        discount_amount: 5.0,
        message: 'Discount applied: SAVE5',
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockProduct) // 29.99
      })

      await act(async () => {
        await result.current.applyDiscount('SAVE5')
      })

      expect(result.current.getTotal()).toBeCloseTo(24.99, 2)

      act(() => {
        result.current.removeDiscount()
      })

      expect(result.current.discount).toBeNull()
      expect(result.current.getTotal()).toBeCloseTo(29.99, 2)
    })

    it('clears discount when cart is cleared', async () => {
      const { validateDiscountCode } = await import('../services')
      const mockedValidate = vi.mocked(validateDiscountCode)
      mockedValidate.mockResolvedValue({
        valid: true,
        code: 'TEA10',
        discount_type: 'percentage',
        value: 10,
        discount_amount: 3.0,
        message: 'Discount applied: TEA10',
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.addItem(mockProduct)
      })

      await act(async () => {
        await result.current.applyDiscount('TEA10')
      })

      expect(result.current.discount).not.toBeNull()

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.discount).toBeNull()
      expect(result.current.items).toHaveLength(0)
    })
  })
})
