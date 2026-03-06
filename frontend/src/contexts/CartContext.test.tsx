import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import { NotificationProvider } from './NotificationContext'
import type { Product } from '../types'

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
})
