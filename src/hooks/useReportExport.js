import { useState, useCallback } from 'react';
import { financeService } from '../services/financeService.js';

export function useReportExport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const exportReport = useCallback(async (filters = {}, format = 'pdf') => {
        try {
            setLoading(true);
            setError(null);

            const blob = await financeService.exportReport({...filters, format});

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const fileExtension = format === 'excel' ? 'xlsx' : 'pdf';
            const formatText = format === 'excel' ? 'du-lieu' : 'bieu-do';
            a.download = `bao-cao-tai-chinh-${formatText}-${filters.month || 'all'}-${filters.year || new Date().getFullYear()}.${fileExtension}`;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        exportReport,
    };
}