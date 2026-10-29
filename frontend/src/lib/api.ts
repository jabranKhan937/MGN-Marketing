const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  AED: { symbol: 'AED', rate: 1 },
  USD: { symbol: '$', rate: 0.27229 },
  EUR: { symbol: '€', rate: 0.251 },
  GBP: { symbol: '£', rate: 0.214 },
};

export function formatCurrency(amountAED: number, currency: CurrencyCode = 'AED', compact = false): string {
  const { symbol, rate } = CURRENCY_RATES[currency] || CURRENCY_RATES.AED;
  const converted = amountAED * rate;

  if (compact) {
    if (converted >= 1_000_000_000) {
      return `${symbol} ${(converted / 1_000_000_000).toFixed(2)}B`;
    }
    if (converted >= 1_000_000) {
      return `${symbol} ${(converted / 1_000_000).toFixed(2)}M`;
    }
    if (converted >= 1_000) {
      return `${symbol} ${(converted / 1_000).toFixed(0)}K`;
    }
  }

  return `${symbol} ${Math.round(converted).toLocaleString('en-US')}`;
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  const json = await res.json();
  return json.data as T;
}
