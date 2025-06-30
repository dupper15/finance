import { useState, useCallback } from 'react';
import { financeService } from '../services/financeService.js';

export function useReportExport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const exportReport = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const blob = await financeService.exportReport(filters);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `bao-cao-tai-chinh-${filters.month || 'all'}-${filters.year || new Date().getFullYear()}.pdf`;
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