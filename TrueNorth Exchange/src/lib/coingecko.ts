// CoinGecko API integration
const COINGECKO_API_KEY = 'CG-xTR3aTaiVmWc5Pno1qwVDs7r';
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap_rank: number;
  image: string;
  price_change_percentage_24h: number;
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  rank: number;
  change24h: number;
  image?: string;
}

/**
 * Fetch top 510 cryptocurrencies from CoinGecko
 */
export async function fetchTopCryptocurrencies(): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'X-CG-Demo-API-Key': COINGECKO_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const page1Data: CoinGeckoPrice[] = await response.json();

    // Fetch second page for coins 251-500
    const response2 = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'X-CG-Demo-API-Key': COINGECKO_API_KEY,
        },
      }
    );

    let page2Data: CoinGeckoPrice[] = [];
    if (response2.ok) {
      page2Data = await response2.json();
    }

    // Fetch third page for coins 501-510
    const response3 = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=3&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'X-CG-Demo-API-Key': COINGECKO_API_KEY,
        },
      }
    );

    let page3Data: CoinGeckoPrice[] = [];
    if (response3.ok) {
      page3Data = await response3.json();
    }

    // Combine all data
    const allData = [...page1Data, ...page2Data, ...page3Data];

    // Transform to our format
    return allData.map((coin, index) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      icon: getIconForSymbol(coin.symbol.toUpperCase()),
      color: getColorForSymbol(coin.symbol.toUpperCase()),
      rank: coin.market_cap_rank || index + 1,
      change24h: coin.price_change_percentage_24h || 0,
      image: coin.image,
    }));
  } catch (error) {
    console.error('Error fetching cryptocurrencies from CoinGecko:', error);
    // Return fallback data if API fails
    return getFallbackCryptocurrencies();
  }
}

/**
 * Get icon for cryptocurrency symbol
 */
function getIconForSymbol(symbol: string): string {
  const iconMap: { [key: string]: string } = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'USDT': '₮',
    'BNB': 'B',
    'SOL': 'S',
    'ADA': 'A',
    'XRP': 'X',
    'DOT': '●',
    'DOGE': 'Ð',
    'AVAX': 'A',
    'LINK': 'L',
    'LTC': 'Ł',
    'MATIC': 'M',
    'UNI': 'U',
    'XLM': '*',
    'VET': 'V',
    'FIL': 'F',
    'TRX': 'T',
    'ATOM': 'A',
    'XMR': 'M',
  };
  
  return iconMap[symbol] || symbol.charAt(0);
}

/**
 * Get color for cryptocurrency symbol
 */
function getColorForSymbol(symbol: string): string {
  const colorMap: { [key: string]: string } = {
    'BTC': 'text-orange-500',
    'ETH': 'text-blue-500',
    'USDT': 'text-green-500',
    'BNB': 'text-yellow-500',
    'SOL': 'text-purple-500',
    'ADA': 'text-blue-400',
    'XRP': 'text-blue-600',
    'DOT': 'text-pink-500',
    'DOGE': 'text-yellow-400',
    'AVAX': 'text-red-500',
    'LINK': 'text-blue-600',
    'LTC': 'text-gray-400',
    'MATIC': 'text-purple-600',
    'UNI': 'text-pink-400',
    'XLM': 'text-blue-300',
    'VET': 'text-blue-500',
    'FIL': 'text-blue-400',
    'TRX': 'text-red-600',
    'ATOM': 'text-purple-400',
    'XMR': 'text-orange-600',
  };
  
  // Generate color based on symbol hash if not in map
  if (!colorMap[symbol]) {
    const colors = [
      'text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400',
      'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-teal-400',
      'text-orange-400', 'text-cyan-400', 'text-lime-400', 'text-emerald-400'
    ];
    const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  
  return colorMap[symbol];
}

/**
 * Fallback cryptocurrency data if API fails
 */
function getFallbackCryptocurrencies(): CryptoCurrency[] {
  return [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, icon: '₿', color: 'text-orange-500', rank: 1, change24h: 2.5 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2680.50, icon: 'Ξ', color: 'text-blue-500', rank: 2, change24h: 1.8 },
    { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.00, icon: '₮', color: 'text-green-500', rank: 3, change24h: 0.1 },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 315.20, icon: 'B', color: 'text-yellow-500', rank: 4, change24h: 3.2 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 98.45, icon: 'S', color: 'text-purple-500', rank: 5, change24h: 4.1 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.52, icon: 'A', color: 'text-blue-400', rank: 6, change24h: -1.2 },
    { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 0.63, icon: 'X', color: 'text-blue-600', rank: 7, change24h: 2.8 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.20, icon: '●', color: 'text-pink-500', rank: 8, change24h: 1.5 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, icon: 'Ð', color: 'text-yellow-400', rank: 9, change24h: 5.2 },
    { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 36.80, icon: 'A', color: 'text-red-500', rank: 10, change24h: 3.7 },
  ];
}

/**
 * Calculate exchange rate between two currencies
 */
export function calculateExchangeRate(fromCurrency: CryptoCurrency, toCurrency: CryptoCurrency, amount: number): number {
  if (!amount || amount <= 0) return 0;
  
  const fromValue = amount * fromCurrency.price;
  const toValue = fromValue / toCurrency.price;
  
  return toValue;
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toFixed(4);
  } else if (price >= 0.01) {
    return price.toFixed(6);
  } else {
    return price.toFixed(8);
  }
}

/**
 * Format amount with appropriate decimal places
 */
export function formatAmount(amount: number): string {
  if (amount >= 1000) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  } else if (amount >= 1) {
    return amount.toFixed(8);
  } else {
    return amount.toFixed(8);
  }
}