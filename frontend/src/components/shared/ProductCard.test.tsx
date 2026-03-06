import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import { ProductCard } from './ProductCard'
import type { Product } from '../../types'

const mockProduct: Product = {
  id: 1,
  name: 'Green Dragon Tea',
  price: 29.99,
  category: 'green',
  material: 'China',
  image: '/images/green-dragon.jpg',
  description: 'A premium green tea from the mountains of China',
  customizable: true,
}

describe('ProductCard', () => {
  const defaultProps = {
    product: mockProduct,
    onAddToCart: vi.fn(),
  }

  it('renders product name and price', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('Green Dragon Tea')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('renders product image with correct alt text', () => {
    render(<ProductCard {...defaultProps} />)

    const image = screen.getByAltText('Green Dragon Tea')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/green-dragon.jpg')
  })

  it('renders product category badge', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('green')).toBeInTheDocument()
  })

  it('renders product description', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('A premium green tea from the mountains of China')).toBeInTheDocument()
  })

  it('renders product material/origin', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('China')).toBeInTheDocument()
  })

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)

    const addButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addButton)

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('renders wishlist button', () => {
    render(<ProductCard {...defaultProps} />)

    // Wishlist button is present (heart icon button)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(1) // Add to Cart + Wishlist button
  })

  it('formats price with two decimal places', () => {
    const productWithRoundPrice = { ...mockProduct, price: 30 }
    render(<ProductCard {...defaultProps} product={productWithRoundPrice} />)

    expect(screen.getByText('$30.00')).toBeInTheDocument()
  })
})
