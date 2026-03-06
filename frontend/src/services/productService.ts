import type { Product, ProductFilters } from '../types';
import { fetchApi } from './api';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters?.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters?.priceMax) {
    params.set('price_max', filters.priceMax.toString());
  }
  if (filters?.material && filters.material !== 'all') {
    params.set('material', filters.material);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return fetchApi<Product[]>(endpoint);
}

export async function getProduct(id: number): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return fetchApi<Product[]>(`/products/category/${category}`);
}
