import type { Product } from '../../../types';
import { ProductCard } from '../../shared';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onCustomize?: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart, onCustomize }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onCustomize={onCustomize}
        />
      ))}
    </div>
  );
}
