import type { Product } from './product';
import type { CustomizationSelection, CustomizationSummaryItem } from './customization';

export interface CartItem extends Omit<Product, 'id'> {
  id: number | string;
  quantity: number;
  isCustomized?: boolean;
  customizationSummary?: CustomizationSummaryItem[];
  basePrice?: number;
  customizationCost?: number;
  customizations?: Record<string, CustomizationSelection>;
}
