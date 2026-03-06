export interface CustomizationConfig {
  category: string;
  options: CustomizationOption[];
  preview_template?: string;
}

export interface CustomizationOption {
  option_id: string;
  display_name: string;
  option_type: 'select' | 'text' | 'number' | 'multi_select';
  required: boolean;
  values: CustomizationOptionValue[];
  validation_rules?: ValidationRules;
  order: number;
  help_text?: string;
}

export interface CustomizationOptionValue {
  value: string;
  price_modifier: number;
  display_name: string;
  description?: string;
}

export interface ValidationRules {
  max_length?: number;
  pattern?: string;
  price?: number;
  max_selections?: number;
  price_per_item?: number;
}

export interface CustomizationSelection {
  value: string | string[];
  price?: number;
}

export interface PriceBreakdown {
  basePrice: number;
  customizationCost: number;
  totalPrice: number;
  breakdown: { label: string; amount: number }[];
}

export interface CustomizationSummaryItem {
  label: string;
  value: string;
  price: number;
}
