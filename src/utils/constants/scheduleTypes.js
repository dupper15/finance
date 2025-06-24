export const SCHEDULE_TYPES = {
    ONCE: 'once',
    RECURRING: 'recurring',
    INSTALLMENT: 'installment'
};

export const SCHEDULE_TYPE_LABELS = {
    [SCHEDULE_TYPES.ONCE]: 'Một lần',
    [SCHEDULE_TYPES.RECURRING]: 'Định kỳ',
    [SCHEDULE_TYPES.INSTALLMENT]: 'Trả góp'
};

export const FREQUENCY_TYPES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
};

export const FREQUENCY_TYPE_LABELS = {
    [FREQUENCY_TYPES.DAILY]: 'Hàng ngày',
    [FREQUENCY_TYPES.WEEKLY]: 'Hàng tuần',
    [FREQUENCY_TYPES.MONTHLY]: 'Hàng tháng',
    [FREQUENCY_TYPES.QUARTERLY]: 'Hàng quý',
    [FREQUENCY_TYPES.YEARLY]: 'Hàng năm'
};
