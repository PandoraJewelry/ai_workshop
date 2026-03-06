import type {
  CustomizationConfig,
  CustomizationSelection,
  PriceBreakdown,
  CustomizationSummaryItem,
} from '../types';
import { fetchApi } from './api';

const configCache: Record<string, CustomizationConfig> = {};

export async function getConfig(category: string): Promise<CustomizationConfig> {
  if (configCache[category]) {
    return configCache[category];
  }

  const config = await fetchApi<CustomizationConfig>(`/customization-config/${category}`);
  configCache[category] = config;
  return config;
}

export function calculatePrice(
  basePrice: number,
  customizations: Record<string, CustomizationSelection>,
  config: CustomizationConfig
): PriceBreakdown {
  const breakdown: { label: string; amount: number }[] = [
    { label: 'Base Price', amount: basePrice },
  ];

  let customizationCost = 0;

  for (const [optionId, selection] of Object.entries(customizations)) {
    const option = config.options.find((opt) => opt.option_id === optionId);
    if (!option) continue;

    if (option.option_type === 'text') {
      if (selection.value && option.validation_rules?.price) {
        const price = option.validation_rules.price;
        customizationCost += price;
        breakdown.push({
          label: option.display_name,
          amount: price,
        });
      }
    } else if (option.option_type === 'multi_select') {
      if (Array.isArray(selection.value)) {
        const pricePerItem = option.validation_rules?.price_per_item || 0;
        const totalPrice = selection.value.length * pricePerItem;
        if (totalPrice > 0) {
          customizationCost += totalPrice;
          breakdown.push({
            label: `${option.display_name} (${selection.value.length})`,
            amount: totalPrice,
          });
        }
      }
    } else {
      const optionValue = option.values.find((v) => v.value === selection.value);
      if (optionValue && optionValue.price_modifier > 0) {
        customizationCost += optionValue.price_modifier;
        breakdown.push({
          label: optionValue.display_name,
          amount: optionValue.price_modifier,
        });
      }
    }
  }

  return {
    basePrice,
    customizationCost,
    totalPrice: basePrice + customizationCost,
    breakdown,
  };
}

export function validateStep(
  stepNumber: number,
  customizations: Record<string, CustomizationSelection>,
  config: CustomizationConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const stepOptions = config.options.filter((opt) => {
    if (stepNumber === 1) return opt.option_id === 'package_size';
    if (stepNumber === 2)
      return [
        'brew_strength',
        'add_ons',
        'leaf_style',
        'accessories',
        'roast_level',
        'brewing_vessel',
        'blend_type',
        'extras',
      ].includes(opt.option_id);
    if (stepNumber === 3) return opt.option_id === 'gift_note';
    return false;
  });

  for (const option of stepOptions) {
    if (option.required) {
      const selection = customizations[option.option_id];
      if (
        !selection ||
        !selection.value ||
        (Array.isArray(selection.value) && selection.value.length === 0)
      ) {
        errors.push(`${option.display_name} is required`);
      }
    }

    if (option.option_type === 'text' && customizations[option.option_id]?.value) {
      const text = customizations[option.option_id].value as string;
      const rules = option.validation_rules;
      if (rules?.max_length && text.length > rules.max_length) {
        errors.push(`Text exceeds maximum length of ${rules.max_length} characters`);
      }
    }

    if (
      option.option_type === 'multi_select' &&
      customizations[option.option_id]?.value
    ) {
      const selections = customizations[option.option_id].value as string[];
      const maxSelections = option.validation_rules?.max_selections;
      if (maxSelections && selections.length > maxSelections) {
        errors.push(
          `${option.display_name}: Maximum ${maxSelections} selections allowed`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function formatSummary(
  customizations: Record<string, CustomizationSelection>,
  config: CustomizationConfig
): CustomizationSummaryItem[] {
  const summary: CustomizationSummaryItem[] = [];

  for (const [optionId, selection] of Object.entries(customizations)) {
    const option = config.options.find((opt) => opt.option_id === optionId);
    if (!option || !selection.value) continue;

    if (option.option_type === 'text') {
      if (selection.value) {
        summary.push({
          label: option.display_name,
          value: `"${selection.value}"`,
          price: option.validation_rules?.price || 0,
        });
      }
    } else if (option.option_type === 'multi_select') {
      if (Array.isArray(selection.value) && selection.value.length > 0) {
        const displayNames = selection.value.map((val) => {
          const optVal = option.values.find((v) => v.value === val);
          return optVal ? optVal.display_name : val;
        });
        summary.push({
          label: option.display_name,
          value: displayNames.join(', '),
          price: selection.price || 0,
        });
      }
    } else {
      const optionValue = option.values.find((v) => v.value === selection.value);
      if (optionValue) {
        summary.push({
          label: option.display_name,
          value: optionValue.display_name,
          price: optionValue.price_modifier,
        });
      }
    }
  }

  return summary;
}

export function generateCustomizationId(productId: number): string {
  return `custom_${productId}_${Date.now()}`;
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPriceModifier(amount: number): string {
  if (amount === 0) return 'Free';
  return `+$${amount.toFixed(2)}`;
}
