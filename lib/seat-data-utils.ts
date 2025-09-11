import { formatCurrency } from './currency';

export function formatPrice(price: number, currencyCode?: string): string {
    return formatCurrency(price, currencyCode);
}