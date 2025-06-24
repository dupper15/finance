export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer'
};

export const TRANSACTION_TYPE_LABELS = {
    [TRANSACTION_TYPES.INCOME]: 'Thu nhập',
    [TRANSACTION_TYPES.EXPENSE]: 'Chi tiêu',
    [TRANSACTION_TYPES.TRANSFER]: 'Chuyển khoản'
};

export const TRANSACTION_TYPE_COLORS = {
    [TRANSACTION_TYPES.INCOME]: 'text-green-600',
    [TRANSACTION_TYPES.EXPENSE]: 'text-red-600',
    [TRANSACTION_TYPES.TRANSFER]: 'text-blue-600'
};