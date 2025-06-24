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

    useEffect(() => {
        const loadChartData = async () => {
            try {
                setChartLoading(true);

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

                setChartData({
                    incomeExpense: incomeExpenseData,
                    expenseByCategory: categoryData,
                });
            } catch (error) {
                console.error('Error loading chart data:', error);
            } finally {
                setChartLoading(false);
            }
        };

        loadChartData();
    }, []);

    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Tổng số dư
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData.totalBalance)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Thu nhập tháng này
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData.monthlySummary?.income || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Chi tiêu tháng này
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(dashboardData.monthlySummary?.expenses || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                            (dashboardData.monthlySummary?.net || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Lãi/lỗ tháng này
                                            </dt>
                                            <dd className={`text-lg font-medium ${
                                                (dashboardData.monthlySummary?.net || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {formatCurrency(dashboardData.monthlySummary?.net || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Thu nhập vs Chi tiêu (6 tháng qua)
                            </h3>
                            {chartLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.incomeExpense}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            name="Thu nhập"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            name="Chi tiêu"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Chi tiêu theo danh mục
                            </h3>
                            {chartLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.expenseByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="total"
                                        >
                                            {chartData.expenseByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Tài khoản</h3>
                                <span className="text-sm text-gray-500">{dashboardData.accounts?.length || 0} tài khoản</span>
                            </div>
                            <div className="space-y-3">
                                {dashboardData.accounts?.slice(0, 5).map((account) => (
                                    <div key={account.account_id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{account.account_type}</p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(account.balance)}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Giao dịch gần đây</h3>
                                <span className="text-sm text-gray-500">10 giao dịch mới nhất</span>
                            </div>
                            <div className="space-y-3">
                                {dashboardData.recentTransactions?.slice(0, 5).map((transaction) => (
                                    <div key={transaction.transaction_id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(transaction.transaction_date)} • {transaction.accounts?.name}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            transaction.transaction_type === 'income'
                                                ? 'text-green-600'
                                                : transaction.transaction_type === 'expense'
                                                    ? 'text-red-600'
                                                    : 'text-blue-600'
                                        }`}>
                      {transaction.transaction_type === 'income' ? '+' : transaction.transaction_type === 'expense' ? '-' : ''}
                                            {formatCurrency(transaction.amount)}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Giao dịch sắp tới</h3>
                                <span className="text-sm text-gray-500">5 ngày tới</span>
                            </div>
                            <div className="space-y-3">
                                {dashboardData.upcomingTransactions?.length > 0 ? (
                                    dashboardData.upcomingTransactions.map((transaction) => (
                                        <div key={transaction.scheduled_id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(transaction.next_due_date)} • {transaction.accounts?.name}
                                                </p>
                                            </div>
                                            <span className={`text-sm font-medium ${
                                                transaction.transaction_type === 'income'
                                                    ? 'text-green-600'
                                                    : transaction.transaction_type === 'expense'
                                                        ? 'text-red-600'
                                                        : 'text-blue-600'
                                            }`}>
                        {transaction.transaction_type === 'income' ? '+' : transaction.transaction_type === 'expense' ? '-' : ''}
                                                {formatCurrency(transaction.amount)}
                      </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Không có giao dịch nào sắp tới
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {dashboardData.budgetAlerts && dashboardData.budgetAlerts.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Cảnh báo ngân sách
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {dashboardData.budgetAlerts.map((alert) => (
                                                <li key={alert.budget_id}>
                                                    {alert.name}: Đã sử dụng {alert.percentage.toFixed(1)}%
                                                    ({formatCurrency(alert.spent)}/{formatCurrency(alert.amount)})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}