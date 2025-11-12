/**
 * Format a number as Egyptian Pound (EGP) currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'ar-EG')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, locale: string = 'ar-EG'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format currency with custom symbol (ج.م)
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the currency symbol (default: true)
 * @returns Formatted currency string with EGP symbol
 */
export const formatEGP = (amount: number, showSymbol: boolean = true): string => {
  const formatted = amount.toFixed(2);
  return showSymbol ? `${formatted} ج.م` : formatted;
};

/**
 * Get currency symbol based on current language
 * @param language - Current language code ('en' or 'ar')
 * @returns Currency symbol
 */
export const getCurrencySymbol = (language: string = 'en'): string => {
  return 'ج.م';
};

/**
 * Parse a currency string to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number value
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};
