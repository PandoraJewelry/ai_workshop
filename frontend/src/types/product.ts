export type ProductCategory = 'black' | 'green' | 'oolong' | 'herbal';
export type ProductOrigin = 'China' | 'Japan' | 'India' | 'Taiwan';
export type ProductMaterial = ProductOrigin;

export interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  material: ProductMaterial;
  image: string;
  description: string;
  customizable: boolean;
}
