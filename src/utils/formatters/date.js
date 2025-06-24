import { format, formatDistance, isValid, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDate(date, formatString = 'dd/MM/yyyy') {
    if (!date) return '';

    let dateObj;
    if (typeof date === 'string') {
        dateObj = parseISO(date);
    } else {
        dateObj = date;
    }

    if (!isValid(dateObj)) return '';

    return format(dateObj, formatString, { locale: vi });
}

export function formatDateTime(date, formatString = 'dd/MM/yyyy HH:mm') {
    return formatDate(date, formatString);
}

export function formatRelativeTime(date) {
    if (!date) return '';

    let dateObj;
    if (typeof date === 'string') {
        dateObj = parseISO(date);
    } else {
        dateObj = date;
    }

    if (!isValid(dateObj)) return '';

    return formatDistance(dateObj, new Date(), {
        addSuffix: true,
        locale: vi
    });
}

export function formatDateForInput(date) {
    if (!date) return '';

    let dateObj;
    if (typeof date === 'string') {
        dateObj = parseISO(date);
    } else {
        dateObj = date;
    }

    if (!isValid(dateObj)) return '';

    return format(dateObj, 'yyyy-MM-dd');
}

export function formatDateTimeForInput(date) {
    if (!date) return '';

    let dateObj;
    if (typeof date === 'string') {
        dateObj = parseISO(date);
    } else {
        dateObj = date;
    }

    if (!isValid(dateObj)) return '';

    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}