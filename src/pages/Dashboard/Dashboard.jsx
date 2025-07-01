import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard.js';
import { useReports } from '../../hooks/useReports.js';
import { formatCurrency } from '../../utils/formatters/currency.js';
import { formatDate } from '../../utils/formatters/date.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
    const { dashboardData, loading: dashboardLoading, refetch } = useDashboard();
    const { getIncomeExpenseReport, getExpenseByCategoryReport } = useReports();

    const [chartData, setChartData] = useState({
        incomeExpense: [],
        expenseByCategory: [],
    });
    const [chartLoading, setChartLoading] = useState(true);
    const [chartError, setChartError] = useState(null);

    // Helper function to format month display
    const formatMonthDisplay = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                month: 'short',
                year: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    useEffect((
    ) => {

        console.log(dashboardData)
    }, [dashboardData]);

    // Helper function to format chart data
    const processChartData = (incomeExpenseData, categoryData) => {
        // Process income/expense data with proper date sorting
        const processedIncomeExpense = incomeExpenseData?.map(item => ({
            ...item,
            month: formatMonthDisplay(item.month || item.period),
            income: Number(item.income) || 0,
            expense: Number(item.expense) || 0,
            // Keep original date for sorting
            originalDate: new Date(item.month || item.period)
        })).sort((a, b) => a.originalDate - b.originalDate) // Sort by actual date
            .map(item => {
                // Remove originalDate after sorting
                const { originalDate, ...rest } = item;
                return rest;
            }) || [];

        // Process category data
        const processedCategoryData = categoryData?.map(item => ({
            ...item,
            category: item.category || item.category_name || 'Khác',
            total: Number(item.total) || Number(item.amount) || 0
        })).filter(item => item.total > 0) || [];

        return {
            incomeExpense: processedIncomeExpense,
            expenseByCategory: processedCategoryData
        };
    };

    useEffect(() => {
        const loadChartData = async () => {
            try {
                setChartLoading(true);
                setChartError(null);

                const endDate = new Date().toISOString();
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);

                const [incomeExpenseData, categoryData] = await Promise.all([
                    getIncomeExpenseReport({
                        start_date: startDate.toISOString(),
                        end_date: endDate,
                        group_by: 'month'
                    }),
                    getExpenseByCategoryReport({
                        start_date: startDate.toISOString(),
                        end_date: endDate
                    })
                ]);

                const processedData = processChartData(incomeExpenseData, categoryData);
                setChartData(processedData);

            } catch (error) {
                console.error('Error loading chart data:', error);
                setChartError('Không thể tải dữ liệu biểu đồ');
            } finally {
                setChartLoading(false);
            }
        };

        loadChartData();
    }, [getIncomeExpenseReport, getExpenseByCategoryReport]);

    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

    // Custom tooltip for line chart
    const CustomLineTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for pie chart
    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{data.payload.category}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
                </div>
            );
        }
        return null;
    };

    // Format Y-axis values
    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Bảng Điều Khiển</h1>
                <button
                    onClick={refetch}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                    Làm mới
                </button>
            </div>

            {dashboardData && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Balance */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Tổng số dư</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData?.totalBalance || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Income */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Thu nhập tháng này</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData?.monthlySummary?.totalIncome || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly expense */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Chi tiêu tháng này</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData?.monthlySummary?.totalExpenses || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Income */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Lợi nhuận ròng</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency((dashboardData?.monthlySummary?.totalIncome || 0) - (dashboardData?.monthlySummary?.totalexpense || 0))}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income & Expense Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thu nhập & Chi tiêu 6 tháng gần đây</h3>
                            {chartLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : chartError ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">{chartError}</p>
                                    </div>
                                </div>
                            ) : chartData.incomeExpense.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Không có dữ liệu để hiển thị</p>
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.incomeExpense} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12 }}
                                            axisLine={{ stroke: '#e0e0e0' }}
                                        />
                                        <YAxis
                                            tickFormatter={formatYAxis}
                                            tick={{ fontSize: 12 }}
                                            axisLine={{ stroke: '#e0e0e0' }}
                                        />
                                        <Tooltip content={<CustomLineTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            name="Thu nhập"
                                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#EF4444"
                                            strokeWidth={3}
                                            name="Chi tiêu"
                                            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Expense by Category Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiêu theo danh mục</h3>
                            {chartLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : chartError ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">{chartError}</p>
                                    </div>
                                </div>
                            ) : chartData.expenseByCategory.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Không có dữ liệu chi tiêu</p>
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.expenseByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ category, percent }) => percent > 0.05 ? `${category} ${(percent * 100).toFixed(0)}%` : ''}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="total"
                                        >
                                            {chartData.expenseByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Bottom Grid - 2x2 layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Accounts - Scrollable */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Tài khoản</h3>
                                    <span className="text-sm text-gray-500">{dashboardData?.accounts?.length || 0} tài khoản</span>
                                </div>
                            </div>
                            <div className="h-80 overflow-y-auto">
                                <div className="p-4 space-y-3">
                                    {dashboardData?.accounts?.length > 0 ? (
                                        dashboardData.accounts.map((account) => (
                                            <div key={account.account_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{account.account_type}</p>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(account.balance)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-500">Không có tài khoản nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions - Scrollable, shows 10 transactions */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Giao dịch gần đây</h3>
                                    <span className="text-sm text-gray-500">10 giao dịch mới nhất</span>
                                </div>
                            </div>
                            <div className="h-80 overflow-y-auto">
                                <div className="p-4 space-y-3">
                                    {dashboardData?.recentTransactions?.length > 0 ? (
                                        dashboardData.recentTransactions.map((transaction) => (
                                            <div key={transaction.transaction_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(transaction.transaction_date)}</p>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    transaction.transaction_type === 'income'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}>
                                                    {transaction.transaction_type === 'income' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-500">Không có giao dịch nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/*/!* Upcoming Scheduled Transactions - Scrollable *!/*/}
                        {/*<div className="bg-white shadow rounded-lg">*/}
                        {/*    <div className="p-6 border-b border-gray-200">*/}
                        {/*        <div className="flex items-center justify-between">*/}
                        {/*            <h3 className="text-lg font-medium text-gray-900">Giao dịch sắp tới</h3>*/}
                        {/*            <span className="text-sm text-gray-500">5 ngày tới</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="h-80 overflow-y-auto">*/}
                        {/*        <div className="p-4 space-y-3">*/}
                        {/*            {dashboardData?.upcomingTransactions?.length > 0 ? (*/}
                        {/*                dashboardData.upcomingTransactions.map((transaction) => (*/}
                        {/*                    <div key={transaction.scheduled_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">*/}
                        {/*                        <div>*/}
                        {/*                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>*/}
                        {/*                            <p className="text-xs text-gray-500">{formatDate(transaction.due_date)}</p>*/}
                        {/*                        </div>*/}
                        {/*                        <span className={`text-sm font-medium ${*/}
                        {/*                            transaction.transaction_type === 'income'*/}
                        {/*                                ? 'text-green-600'*/}
                        {/*                                : 'text-red-600'*/}
                        {/*                        }`}>*/}
                        {/*                            {transaction.transaction_type === 'income' ? '+' : '-'}*/}
                        {/*                            {formatCurrency(transaction.amount)}*/}
                        {/*                        </span>*/}
                        {/*                    </div>*/}
                        {/*                ))*/}
                        {/*            ) : (*/}
                        {/*                <div className="text-center py-8">*/}
                        {/*                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                        {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />*/}
                        {/*                    </svg>*/}
                        {/*                    <p className="mt-2 text-sm text-gray-500">Không có giao dịch đã lên lịch</p>*/}
                        {/*                </div>*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*/!* Budget Alerts - Scrollable *!/*/}
                        {/*<div className="bg-white shadow rounded-lg">*/}
                        {/*    <div className="p-6 border-b border-gray-200">*/}
                        {/*        <div className="flex items-center justify-between">*/}
                        {/*            <h3 className="text-lg font-medium text-gray-900">Cảnh báo ngân sách</h3>*/}
                        {/*            <span className="text-sm text-gray-500">Trạng thái hiện tại</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="h-80 overflow-y-auto">*/}
                        {/*        <div className="p-4 space-y-3">*/}
                        {/*            {dashboardData?.budgetAlerts?.length > 0 ? (*/}
                        {/*                dashboardData.budgetAlerts.map((alert) => (*/}
                        {/*                    <div key={alert.budget_id} className={`p-3 rounded-lg ${*/}
                        {/*                        alert.percentage >= 100*/}
                        {/*                            ? 'bg-red-50 border border-red-200'*/}
                        {/*                            : alert.percentage >= 80*/}
                        {/*                                ? 'bg-yellow-50 border border-yellow-200'*/}
                        {/*                                : 'bg-green-50 border border-green-200'*/}
                        {/*                    }`}>*/}
                        {/*                        <div className="flex items-center justify-between mb-2">*/}
                        {/*                            <p className="text-sm font-medium text-gray-900">{alert.category_name}</p>*/}
                        {/*                            <span className={`text-xs font-medium px-2 py-1 rounded ${*/}
                        {/*                                alert.percentage >= 100*/}
                        {/*                                    ? 'bg-red-100 text-red-800'*/}
                        {/*                                    : alert.percentage >= 80*/}
                        {/*                                        ? 'bg-yellow-100 text-yellow-800'*/}
                        {/*                                        : 'bg-green-100 text-green-800'*/}
                        {/*                            }`}>*/}
                        {/*                                {alert.percentage.toFixed(0)}%*/}
                        {/*                            </span>*/}
                        {/*                        </div>*/}
                        {/*                        <div className="w-full bg-gray-200 rounded-full h-2">*/}
                        {/*                            <div*/}
                        {/*                                className={`h-2 rounded-full ${*/}
                        {/*                                    alert.percentage >= 100*/}
                        {/*                                        ? 'bg-red-500'*/}
                        {/*                                        : alert.percentage >= 80*/}
                        {/*                                            ? 'bg-yellow-500'*/}
                        {/*                                            : 'bg-green-500'*/}
                        {/*                                }`}*/}
                        {/*                                style={{ width: `${Math.min(alert.percentage, 100)}%` }}*/}
                        {/*                            ></div>*/}
                        {/*                        </div>*/}
                        {/*                        <p className="text-xs text-gray-500 mt-1">*/}
                        {/*                            {formatCurrency(alert.spent)} / {formatCurrency(alert.budget)}*/}
                        {/*                        </p>*/}
                        {/*                    </div>*/}
                        {/*                ))*/}
                        {/*            ) : (*/}
                        {/*                <div className="text-center py-8">*/}
                        {/*                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">*/}
                        {/*                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                        {/*                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />*/}
                        {/*                        </svg>*/}
                        {/*                    </div>*/}
                        {/*                    <p className="mt-2 text-sm text-gray-500">Tất cả ngân sách đều ổn định</p>*/}
                        {/*                </div>*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </>
            )}
        </div>
    );
}