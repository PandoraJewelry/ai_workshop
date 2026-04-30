import { fetchApi } from './api';
import type { DiscountValidationResponse } from '../types';

export async function validateDiscountCode(
  code: string,
  cartTotal: number
): Promise<DiscountValidationResponse> {
  return fetchApi<DiscountValidationResponse>('/discount/validate', {
    method: 'POST',
    body: JSON.stringify({ code, cart_total: cartTotal }),
  });
}
