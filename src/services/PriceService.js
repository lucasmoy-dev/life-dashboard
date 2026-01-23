/**
 * Price Service - Fetches real-time prices for currencies, cryptos and assets
 */

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa,solana,stellar,algorand,litecoin,sui,chainlink,render-token&vs_currencies=eur,ars';
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD';

export async function fetchAllPrices() {
    const rates = {
        EUR: 1
    };

    try {
        // 1. Fetch Crypto Prices
        const cryptoResponse = await fetch(COINGECKO_URL);
        const cryptoData = await cryptoResponse.json();

        rates.BTC = cryptoData.bitcoin?.eur || 40000;
        rates.ETH = cryptoData.ethereum?.eur || 2200;
        rates.XRP = cryptoData.ripple?.eur || 0.50;
        rates.KAS = cryptoData.kaspa?.eur || 0.10;
        rates.SOL = cryptoData.solana?.eur || 90;
        rates.XLM = cryptoData.stellar?.eur || 0.11;
        rates.ALGO = cryptoData.algorand?.eur || 0.18;
        rates.LTC = cryptoData.litecoin?.eur || 65;
        rates.SUI = cryptoData.sui?.eur || 1.10;
        rates.LINK = cryptoData.chainlink?.eur || 14;
        rates.RNDR = cryptoData['render-token']?.eur || 4.5;

        // Calculate ARS rate (EUR/ARS)
        if (cryptoData.bitcoin?.ars && cryptoData.bitcoin?.eur) {
            rates.ARS = cryptoData.bitcoin.eur / cryptoData.bitcoin.ars;
        }

        // 2. Fetch Fiat rates from EUR
        const forexResponse = await fetch(FRANKFURTER_URL);
        if (forexResponse.ok) {
            const forexData = await forexResponse.json();
            rates.USD = 1 / forexData.rates.USD;
            rates.CHF = 1 / forexData.rates.CHF;
            rates.GBP = 1 / forexData.rates.GBP;
            rates.AUD = 1 / forexData.rates.AUD;
        }

        // 3. Fallbacks / Mocked
        rates.GOLD = 2100;
        rates.SP500 = 4700;

    } catch (error) {
        console.error('Failed to fetch some prices:', error);
        // Essential Fallbacks
        rates.USD = rates.USD || 0.92;
        rates.CHF = rates.CHF || 1.05;
        rates.GBP = rates.GBP || 1.15;
        rates.AUD = rates.AUD || 0.60;
        rates.ARS = rates.ARS || 0.001;
    }

    return rates;
}
