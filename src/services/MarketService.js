/**
 * Market Service - Fetches real-time prices and 24h/7d/30d/1y changes
 */

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const ASSET_CATEGORIES = {
    STOCKS: 'Stocks & Índices',
    CRYPTO_MAJORS: 'Cripto (Principales)',
    CRYPTO_ALTS: 'Cripto (Altcoins)',
    COMMODITIES: 'Materias Primas'
};

export const MARKET_ASSETS = [
    // STOCKS & INDICES (Using Yahoo Finance public query symbols)
    { id: 'sp500', name: 'S&P 500', symbol: 'SPX', category: ASSET_CATEGORIES.STOCKS, yahooId: '%5EGSPC' },
    { id: 'nasdaq100', name: 'Nasdaq 100', symbol: 'NDX', category: ASSET_CATEGORIES.STOCKS, yahooId: '%5EIXIC' },
    { id: 'msciworld', name: 'MSCI World ETF', symbol: 'URTH', category: ASSET_CATEGORIES.STOCKS, yahooId: 'URTH' },
    { id: 'microsoft', name: 'Microsoft', symbol: 'MSFT', category: ASSET_CATEGORIES.STOCKS, yahooId: 'MSFT' },
    { id: 'tesla', name: 'Tesla', symbol: 'TSLA', category: ASSET_CATEGORIES.STOCKS, yahooId: 'TSLA' },
    { id: 'apple', name: 'Apple', symbol: 'AAPL', category: ASSET_CATEGORIES.STOCKS, yahooId: 'AAPL' },
    { id: 'amazon', name: 'Amazon', symbol: 'AMZN', category: ASSET_CATEGORIES.STOCKS, yahooId: 'AMZN' },
    { id: 'nvidia', name: 'Nvidia', symbol: 'NVDA', category: ASSET_CATEGORIES.STOCKS, yahooId: 'NVDA' },
    { id: 'google', name: 'Google', symbol: 'GOOGL', category: ASSET_CATEGORIES.STOCKS, yahooId: 'GOOGL' },
    { id: 'meta', name: 'Meta', symbol: 'META', category: ASSET_CATEGORIES.STOCKS, yahooId: 'META' },
    { id: 'oracle', name: 'Oracle', symbol: 'ORCL', category: ASSET_CATEGORIES.STOCKS, yahooId: 'ORCL' },
    { id: 'netflix', name: 'Netflix', symbol: 'NFLX', category: ASSET_CATEGORIES.STOCKS, yahooId: 'NFLX' },
    { id: 'ypf', name: 'YPF', symbol: 'YPF', category: ASSET_CATEGORIES.STOCKS, yahooId: 'YPF' },
    { id: 'ibex35', name: 'IBEX 35', symbol: 'IBEX', category: ASSET_CATEGORIES.STOCKS, yahooId: '%5EIBEX' },

    // COMMODITIES
    { id: 'gold', name: 'Oro', symbol: 'XAU', category: ASSET_CATEGORIES.COMMODITIES, cgId: 'pax-gold' },
    { id: 'silver', name: 'Plata', symbol: 'XAG', category: ASSET_CATEGORIES.COMMODITIES, cgId: 'tether-gold' },
    { id: 'copper', name: 'Cobre', symbol: 'HG', category: ASSET_CATEGORIES.COMMODITIES, yahooId: 'HG=F' },

    // CRYPTO MAJORS
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', cgId: 'bitcoin', category: ASSET_CATEGORIES.CRYPTO_MAJORS },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', cgId: 'ethereum', category: ASSET_CATEGORIES.CRYPTO_MAJORS },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', cgId: 'ripple', category: ASSET_CATEGORIES.CRYPTO_MAJORS },
    { id: 'solana', name: 'Solana', symbol: 'SOL', cgId: 'solana', category: ASSET_CATEGORIES.CRYPTO_MAJORS },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', cgId: 'cardano', category: ASSET_CATEGORIES.CRYPTO_MAJORS },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', cgId: 'dogecoin', category: ASSET_CATEGORIES.CRYPTO_MAJORS },

    // CRYPTO ALTS
    { id: 'kaspa', name: 'Kaspa', symbol: 'KAS', cgId: 'kaspa', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', cgId: 'litecoin', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', cgId: 'bitcoin-cash', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'monero', name: 'Monero', symbol: 'XMR', cgId: 'monero', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', cgId: 'chainlink', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'stellar', name: 'Stellar', symbol: 'XLM', cgId: 'stellar', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'sui', name: 'Sui', symbol: 'SUI', cgId: 'sui', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'hbar', name: 'Hedera', symbol: 'HBAR', cgId: 'hedera-hashgraph', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'aave', name: 'Aave', symbol: 'AAVE', cgId: 'aave', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'bittensor', name: 'Bittensor', symbol: 'TAO', cgId: 'bittensor', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'worldcoin', name: 'Worldcoin', symbol: 'WLD', cgId: 'worldcoin-org', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', cgId: 'arbitrum', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'polygon', name: 'Polygon', symbol: 'POL', cgId: 'polygon-ecosystem-token', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', cgId: 'optimism', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'stacks', name: 'Stacks', symbol: 'STX', cgId: 'blockstack', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'ondo', name: 'Ondo', symbol: 'ONDO', cgId: 'ondo-finance', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'zcash', name: 'Zcash', symbol: 'ZEC', cgId: 'zcash', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'dash', name: 'Dash', symbol: 'DASH', cgId: 'dash', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'filecoin', name: 'Filecoin', symbol: 'FIL', cgId: 'filecoin', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'algorand', name: 'Algorand', symbol: 'ALGO', cgId: 'algorand', category: ASSET_CATEGORIES.CRYPTO_ALTS },
    { id: 'fetch-ai', name: 'Fetch.ai', symbol: 'FET', cgId: 'fetch-ai', category: ASSET_CATEGORIES.CRYPTO_ALTS }
];

export async function fetchMarketData(vsCurrency = 'EUR') {
    const cgIds = MARKET_ASSETS.map(a => a.cgId).filter(Boolean).join(',');
    const cgUrl = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${vsCurrency.toLowerCase()}&ids=${cgIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`;

    try {
        const cgResponse = await fetch(cgUrl);
        const cgData = cgResponse.ok ? await cgResponse.json() : [];

        // Fetch Yahoo data
        const yahooAssets = MARKET_ASSETS.filter(a => a.yahooId);
        const yahooData = await fetchYahooFinanceDataProxy(yahooAssets);

        return MARKET_ASSETS.map(asset => {
            if (asset.cgId) {
                const live = cgData.find(d => d.id === asset.cgId);
                if (live) {
                    return {
                        ...asset,
                        price: live.current_price,
                        change24h: live.price_change_percentage_24h_in_currency || live.price_change_percentage_24h || 0,
                        change7d: live.price_change_percentage_7d_in_currency || 0,
                        change30d: live.price_change_percentage_30d_in_currency || 0,
                        change1y: live.price_change_percentage_1y_in_currency || 0
                    };
                }
            }

            if (asset.yahooId && yahooData[asset.yahooId]) {
                const live = yahooData[asset.yahooId];
                // Approximate conversion if not in USD
                const priceFactor = vsCurrency === 'USD' ? 1 : 0.92;
                return {
                    ...asset,
                    price: live.price * priceFactor,
                    change24h: live.change24h,
                    change7d: live.change7d,
                    change30d: live.change30d,
                    change1y: live.change1y
                };
            }

            return { ...asset, price: null, change24h: null, change7d: null, change30d: null, change1y: null };
        });
    } catch (e) {
        console.error('Market fetch failed', e);
        return MARKET_ASSETS.map(a => ({ ...a, price: null, change24h: null, change7d: null, change30d: null, change1y: null }));
    }
}

async function fetchYahooFinanceDataProxy(assets) {
    const results = {};
    await Promise.all(assets.map(async (asset) => {
        try {
            // Fetch 1y range to calculate 30d and 1y changes
            const target = `https://query1.finance.yahoo.com/v8/finance/chart/${asset.yahooId}?interval=1d&range=1y`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;

            const response = await fetch(proxyUrl);
            const wrapper = await response.json();
            const data = JSON.parse(wrapper.contents);

            if (!data.chart || !data.chart.result || !data.chart.result[0]) throw new Error('Invalid data');

            const result = data.chart.result[0];
            const meta = result.meta;
            const indicators = result.indicators.quote[0].close;
            const validPrices = indicators.filter(v => v !== null);

            if (validPrices.length === 0) throw new Error('No valid price data');

            const currentPrice = meta.regularMarketPrice || validPrices[validPrices.length - 1];

            // 24h Change
            const prevClose = meta.chartPreviousClose || (validPrices.length > 1 ? validPrices[validPrices.length - 2] : currentPrice);
            const change24h = ((currentPrice - prevClose) / prevClose) * 100;

            // 7d Change (approx 5 trading days)
            const idx7d = Math.max(0, validPrices.length - 6);
            const price7d = validPrices[idx7d];
            const change7d = ((currentPrice - price7d) / price7d) * 100;

            // 30d Change (approx 21 trading days)
            const idx30d = Math.max(0, validPrices.length - 22);
            const price30d = validPrices[idx30d];
            const change30d = ((currentPrice - price30d) / price30d) * 100;

            // 1y Change (first valid price in the year chart)
            const price1y = validPrices[0];
            const change1y = ((currentPrice - price1y) / price1y) * 100;

            results[asset.yahooId] = {
                price: currentPrice,
                change24h: isNaN(change24h) ? 0 : change24h,
                change7d: isNaN(change7d) ? 0 : change7d,
                change30d: isNaN(change30d) ? 0 : change30d,
                change1y: isNaN(change1y) ? 0 : change1y
            };
        } catch (err) {
            console.warn(`Failed to fetch ${asset.symbol} from Yahoo`, err);
            results[asset.yahooId] = null;
        }
    }));
    return results;
}
