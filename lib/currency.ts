// Currency utilities and configuration
export interface Currency {
    code: string;
    symbol: string;
    name: string;
    nameAr: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    {
        code: 'SAR',
        symbol: 'ريال سعودي',
        name: 'Saudi Riyal',
        nameAr: 'ريال سعودي'
    },
    {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        nameAr: 'دولار أمريكي'
    },
    {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        nameAr: 'يورو'
    },
    {
        code: 'AED',
        symbol: 'درهم',
        name: 'UAE Dirham',
        nameAr: 'درهم إماراتي'
    },
    {
        code: 'KWD',
        symbol: 'د.ك',
        name: 'Kuwaiti Dinar',
        nameAr: 'دينار كويتي'
    },
    {
        code: 'QAR',
        symbol: 'ريال قطري',
        name: 'Qatari Riyal',
        nameAr: 'ريال قطري'
    }
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // SAR

export function formatCurrency(amount: number, currencyCode: string = 'SAR'): string {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || DEFAULT_CURRENCY;
    return `${amount} ${currency.symbol}`;
}

export function getCurrencyByCode(code: string): Currency {
    return SUPPORTED_CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
}