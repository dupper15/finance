export function formatCurrency(amount, currency = 'VND') {
    if (amount === null || amount === undefined) return '0 ₫';

    const number = parseFloat(amount);

    if (currency === 'VND') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(number);
}

export function formatNumber(number, decimals = 0) {
    if (number === null || number === undefined) return '0';

    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
}
