import { useState, useEffect } from 'react';
import { financeService } from '../services/financeService';

export function useMonthlyTransactionSummary(refreshTrigger = 0) {
    const [monthlyData, setMonthlyData] = useState({
        currentMonth: {
            totalIncome: 0,
            totalExpenses: 0,
            netAmount: 0
        },
        previousMonth: {
            totalIncome: 0,
            totalExpenses: 0,
            netAmount: 0
        },
        loading: false,
        error: null
    });

    const fetchMonthlyData = async () => {
        try {
            setMonthlyData(prev => ({ ...prev, loading: true, error: null }));

            const now = new Date();

            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            const [currentMonthResponse, previousMonthResponse] = await Promise.all([
                financeService.getTransactionStats({
                    start_date: startOfCurrentMonth.toISOString(),
                    end_date: endOfCurrentMonth.toISOString()
                }),
                financeService.getTransactionStats({
                    start_date: startOfPreviousMonth.toISOString(),
                    end_date: endOfPreviousMonth.toISOString()
                })
            ]);

            const currentMonth = {
                totalIncome: currentMonthResponse.totalIncome || 0,
                totalExpenses: currentMonthResponse.totalExpenses || 0,
                netAmount: (currentMonthResponse.totalIncome || 0) - (currentMonthResponse.totalExpenses || 0)
            };

            const previousMonth = {
                totalIncome: previousMonthResponse.totalIncome || 0,
                totalExpenses: previousMonthResponse.totalExpenses || 0,
                netAmount: (previousMonthResponse.totalIncome || 0) - (previousMonthResponse.totalExpenses || 0)
            };

            setMonthlyData({
                currentMonth,
                previousMonth,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error('Error fetching monthly transaction summary:', error);
            setMonthlyData(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to fetch monthly data'
            }));
        }
    };

    useEffect(() => {
        fetchMonthlyData();
    }, [refreshTrigger]);

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const getIncomeChangePercentage = () => {
        return calculatePercentageChange(
            monthlyData.currentMonth.totalIncome,
            monthlyData.previousMonth.totalIncome
        );
    };

    const getExpenseChangePercentage = () => {
        return calculatePercentageChange(
            monthlyData.currentMonth.totalExpenses,
            monthlyData.previousMonth.totalExpenses
        );
    };

    const getCurrentMonthName = () => {
        const months = [
            "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
            "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
        ];
        const currentDate = new Date();
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    return {
        monthlyData,
        loading: monthlyData.loading,
        error: monthlyData.error,
        refetch: fetchMonthlyData,
        getIncomeChangePercentage,
        getExpenseChangePercentage,
        getCurrentMonthName
    };
}