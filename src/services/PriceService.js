/**
 * Price Service - Fetches real-time prices for currencies, cryptos and assets
 */

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,kaspa&vs_currencies=eur,ars';
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,AUD';

export async function fetchAllPrices() {
    const rates = {
        EUR: 1
    };

    try {
        // 1. Fetch Crypto Prices (BTC, ETH, XRP, KAS)
        const cryptoResponse = await fetch(COINGECKO_URL);
        const cryptoData = await cryptoResponse.json();

        rates.BTC = cryptoData.bitcoin.eur;
        rates.ETH = cryptoData.ethereum.eur;
        rates.XRP = cryptoData.ripple.eur;
        rates.KAS = cryptoData.kaspa.eur;

        // Calculate ARS rate (EUR/ARS)
        // cryptoData.bitcoin.ars is how many ARS for 1 BTC
        // cryptoData.bitcoin.eur is how many EUR for 1 BTC
        // So 1 ARS = (eur_price / ars_price) EUR
        if (cryptoData.bitcoin.ars && cryptoData.bitcoin.eur) {
            rates.ARS = cryptoData.bitcoin.eur / cryptoData.bitcoin.ars;
        }

        // 2. Fetch Fiat rates from EUR
        const forexResponse = await fetch(FRANKFURTER_URL);
        const forexData = await forexResponse.json();

        // Frankfurter returns how many USD for 1 EUR.
        // We need how many EUR for 1 USD (1/rate).
        rates.USD = 1 / forexData.rates.USD;
        rates.CHF = 1 / forexData.rates.CHF;
        rates.GBP = 1 / forexData.rates.GBP;
        rates.AUD = 1 / forexData.rates.AUD;

        // 3. Fallbacks / Mocked
        rates.GOLD = 2100;
        rates.SP500 = 4700;

    } catch (error) {
        console.error('Failed to fetch some prices:', error);
        // Fallbacks
        rates.USD = rates.USD || 0.92;
        rates.CHF = rates.CHF || 1.05;
        rates.GBP = rates.GBP || 1.15;
        rates.AUD = rates.AUD || 0.60;
        rates.ARS = rates.ARS || 0.001;
    }

    return rates;
}
