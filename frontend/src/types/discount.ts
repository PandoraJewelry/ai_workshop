export interface Discount {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
}

export interface DiscountValidationResponse {
  valid: boolean;
  code: string | null;
  discount_type: string | null;
  value: number | null;
  discount_amount: number | null;
  message: string;
}
