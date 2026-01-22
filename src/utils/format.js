/**
 * Formatting utilities
 */

export function formatCurrency(amount, symbol = '$') {
    const absAmount = Math.abs(amount);

    // Determine fraction digits based on currency
    let minDecimals = 0;
    let maxDecimals = 0;

    if (symbol === '₿') {
        minDecimals = 4;
        maxDecimals = 6;
    } else if (symbol === '$' || symbol === '€' || symbol === '£' || symbol === 'Fr') {
        minDecimals = 0;
        maxDecimals = 2;
    }

    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals
    }).format(absAmount);

    const sign = amount < 0 ? '-' : '';
    // Special case for $ (ARS/USD/AUD), symbols usually go before
    return `${sign}${symbol}${formatted}`;
}

export function formatCurrencyCompact(amount, symbol = '$') {
    const absAmount = Math.abs(amount);
    let formatted;

    if (absAmount >= 1000000) {
        formatted = (absAmount / 1000000).toFixed(1) + 'M';
    } else if (absAmount >= 1000) {
        formatted = (absAmount / 1000).toFixed(1) + 'K';
    } else {
        formatted = absAmount.toString();
    }

    const sign = amount < 0 ? '-' : '';
    return `${sign}${symbol}${formatted}`;
}

export function formatPercentage(value) {
    if (value === undefined || value === null) return '0.0%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
