import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, ProductFilters, CartItem } from '../../../types';
import { getProducts } from '../../../services';
import { useCart } from '../../../contexts';
import { LoadingSpinner } from '../../shared';
import { HeroSection } from './HeroSection';
import { FilterSection } from './FilterSection';
import { ProductGrid } from './ProductGrid';
import { CustomizationModal } from '../customization/CustomizationModal';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || null,
    priceMax: searchParams.get('price') ? parseInt(searchParams.get('price')!, 10) : null,
    material: searchParams.get('material') || null,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  // Load all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Apply filters when filters or allProducts change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const products = await getProducts(filters);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error filtering products:', error);
      }
    };
    applyFilters();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.priceMax) params.price = filters.priceMax.toString();
    if (filters.material) params.material = filters.material;
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ category: null, priceMax: null, material: null });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleCustomize = (product: Product) => {
    if (product.customizable) {
      setSelectedProduct(product);
      setCustomizationOpen(true);
    }
  };

  const handleCloseCustomization = () => {
    setCustomizationOpen(false);
    setSelectedProduct(null);
  };

  const handleCustomizedAddToCart = (item: CartItem) => {
    addItem(item);
    handleCloseCustomization();
  };

  // Expose filterByCategory for header navigation
  const filterByCategory = (category: string) => {
    setFilters({
      ...filters,
      category: category === 'all' ? null : category,
    });
  };

  // Store the function in window for access from App
  useEffect(() => {
    (window as unknown as { filterByCategory?: (category: string) => void }).filterByCategory = filterByCategory;
    return () => {
      delete (window as unknown as { filterByCategory?: (category: string) => void }).filterByCategory;
    };
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />

      <FilterSection
        filters={filters}
        resultCount={filteredProducts.length}
        totalCount={allProducts.length}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onCustomize={handleCustomize}
        />
      )}

      <CustomizationModal
        product={selectedProduct}
        isOpen={customizationOpen}
        onClose={handleCloseCustomization}
        onAddToCart={handleCustomizedAddToCart}
      />
    </main>
  );
}
