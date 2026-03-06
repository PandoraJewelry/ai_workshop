import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts, getProduct, getProductsByCategory } from './productService'
import type { Product, ProductFilters } from '../types'

// Mock the api module
vi.mock('./api', () => ({
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'

const mockFetchApi = vi.mocked(fetchApi)

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Green Dragon',
    price: 29.99,
    category: 'green',
    material: 'China',
    image: '/images/green-dragon.jpg',
    description: 'A premium green tea',
    customizable: true,
  },
  {
    id: 2,
    name: 'Earl Grey Classic',
    price: 24.99,
    category: 'black',
    material: 'India',
    image: '/images/earl-grey.jpg',
    description: 'Classic black tea with bergamot',
    customizable: false,
  },
]

describe('ProductService', () => {
  beforeEach(() => {
    mockFetchApi.mockClear()
  })

  describe('getProducts', () => {
    it('should fetch all products without filters', async () => {
      mockFetchApi.mockResolvedValueOnce(mockProducts)

      const result = await getProducts()

      expect(mockFetchApi).toHaveBeenCalledWith('/products')
      expect(result).toEqual(mockProducts)
    })

    it('should fetch products with category filter', async () => {
      mockFetchApi.mockResolvedValueOnce([mockProducts[0]])

      const filters: ProductFilters = {
        category: 'green',
        priceMax: null,
        material: null,
      }
      const result = await getProducts(filters)

      expect(mockFetchApi).toHaveBeenCalledWith('/products?category=green')
      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('green')
    })

    it('should fetch products with multiple filters', async () => {
      mockFetchApi.mockResolvedValueOnce([mockProducts[1]])

      const filters: ProductFilters = {
        category: 'black',
        priceMax: 30,
        material: 'India',
      }
      const result = await getProducts(filters)

      expect(mockFetchApi).toHaveBeenCalledWith(
        '/products?category=black&price_max=30&material=India'
      )
      expect(result).toHaveLength(1)
    })

    it('should ignore "all" category filter', async () => {
      mockFetchApi.mockResolvedValueOnce(mockProducts)

      const filters: ProductFilters = {
        category: 'all',
        priceMax: null,
        material: null,
      }
      const result = await getProducts(filters)

      expect(mockFetchApi).toHaveBeenCalledWith('/products')
      expect(result).toEqual(mockProducts)
    })
  })

  describe('getProduct', () => {
    it('should fetch a single product by id', async () => {
      mockFetchApi.mockResolvedValueOnce(mockProducts[0])

      const result = await getProduct(1)

      expect(mockFetchApi).toHaveBeenCalledWith('/products/1')
      expect(result).toEqual(mockProducts[0])
    })
  })

  describe('getProductsByCategory', () => {
    it('should fetch products by category', async () => {
      mockFetchApi.mockResolvedValueOnce([mockProducts[0]])

      const result = await getProductsByCategory('green')

      expect(mockFetchApi).toHaveBeenCalledWith('/products/category/green')
      expect(result).toHaveLength(1)
    })
  })
})
