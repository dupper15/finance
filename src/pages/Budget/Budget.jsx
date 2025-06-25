import React, { useState } from 'react';
import { useBudgets } from '../../hooks/useBudgets.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BUDGET_CATEGORIES = [
    { id: 'education', name: 'Giáo dục' },
    { id: 'entertainment', name: 'Giải trí' },
    { id: 'food', name: 'Ăn uống' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const CATEGORY_STYLES = {
    income: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        hover: 'hover:bg-green-100',
    },
    education: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        hover: 'hover:bg-blue-100',
    },
    entertainment: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-100',
    },
    food: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        hover: 'hover:bg-yellow-100',
    },
};

const MOCK_DATA = {
    income: [
        { name: 'Lương công ty', amount: 2500000 },
        { name: 'Làm thêm', amount: 500000 },
    ],
    expenses: {
        education: [
            { name: 'Khóa học IELTS', amount: 1000000 },
        ],
        entertainment: [
            { name: 'Netflix', amount: 200000 },
            { name: 'Đi chơi', amount: 300000 },
        ],
        food: [
            { name: 'Ăn trưa', amount: 500000 },
        ],
    },
};

export function Budget() {
    const { budgets, loading } = useBudgets();
    const [selectedMonth, setSelectedMonth] = useState('2025-05');

    if (loading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    const totalIncome = MOCK_DATA.income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = Object.values(MOCK_DATA.expenses)
        .flat()
        .reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpenses;

    const pieChartData = BUDGET_CATEGORIES.map((cat) => ({
        name: cat.name,
        value: MOCK_DATA.expenses[cat.id]?.reduce((sum, i) => sum + i.amount, 0) || 0,
    }));

    const handleEdit = (categoryId, index) => {
        alert(`Chỉnh sửa mục trong ${categoryId}, index ${index}`);
    };

    const handleDelete = (categoryId, index) => {
        alert(`Xoá mục trong ${categoryId}, index ${index}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 md:gap-4 md:flex-row md:items-center md:justify-between mb-6">
    {/* Tiêu đề và bộ chọn tháng */}
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Ngân sách</h1>
        <div className="flex gap-2">
            <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="2025-05">Tháng 5/2025</option>
                <option value="2025-06">Tháng 6/2025</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow-sm">
                Tạo ngân sách
            </button>
        </div>
    </div>

    {/* Thống kê thu - chi - số dư */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full md:w-auto">
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <p className="text-gray-500 mb-1">Thu nhập</p>
            <p className="text-green-600 font-semibold text-base">
                +{totalIncome.toLocaleString()} VNĐ
            </p>
        </div>
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <p className="text-gray-500 mb-1">Chi tiêu</p>
            <p className="text-red-600 font-semibold text-base">
                -{totalExpenses.toLocaleString()} VNĐ
            </p>
        </div>
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <p className="text-gray-500 mb-1">Số dư</p>
            <p className="text-blue-600 font-semibold text-base">
                {balance >= 0 ? '+' : '-'}{Math.abs(balance).toLocaleString()} VNĐ
            </p>
        </div>
    </div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Thu nhập chi tiết */}
    {/* Thu nhập */}
<div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
    <h3 className="font-semibold text-md text-gray-800">
        💰 Thu nhập - Tổng: <span className="text-green-600">{totalIncome.toLocaleString()} VNĐ</span>
    </h3>
    <div className="mt-2 space-y-2 text-sm">
        {MOCK_DATA.income.map((item, index) => (
            <div
                key={index}
                className={`flex justify-between items-center 
                    ${CATEGORY_STYLES.income.bg} 
                    ${CATEGORY_STYLES.income.border} 
                    ${CATEGORY_STYLES.income.hover} 
                    py-2 px-3 rounded-md border transition`}
            >
                <span className="text-gray-700 font-medium">{item.name}</span>
                <span className="flex gap-3 items-center">
                    <span className={`${CATEGORY_STYLES.income.text} font-semibold`}>
                        +{item.amount.toLocaleString()} VNĐ
                    </span>
                    <button
                        className="text-blue-500 hover:underline text-xs"
                        onClick={() => alert(`Sửa thu nhập dòng ${index}`)}
                    >
                        Sửa
                    </button>
                    <button
                        className="text-red-500 hover:underline text-xs"
                        onClick={() => alert(`Xoá thu nhập dòng ${index}`)}
                    >
                        Xoá
                    </button>
                </span>
            </div>
        ))}
    </div>
</div>


    {/* Chi tiêu */}
<div className="bg-white shadow rounded-lg p-6 space-y-6 border border-gray-200">
    {BUDGET_CATEGORIES.map((category) => {
        const total = MOCK_DATA.expenses[category.id]?.reduce((sum, i) => sum + i.amount, 0) || 0;
        const style = CATEGORY_STYLES[category.id] || {};
        return (
            <div key={category.id}>
                <h3 className="font-semibold text-md text-gray-800">
                    🧾 {category.name} - Tổng: <span className={`${style.text}`}>{total.toLocaleString()} VNĐ</span>
                </h3>
                <div className="mt-2 space-y-2 text-sm">
                    {(MOCK_DATA.expenses[category.id] || []).map((item, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center 
                                ${style.bg} ${style.border} ${style.hover} 
                                py-2 px-3 rounded-md border transition`}
                        >
                            <span className="text-gray-700 font-medium">{item.name}</span>
                            <span className="flex gap-3 items-center">
                                <span className={`${style.text} font-semibold`}>
                                    -{item.amount.toLocaleString()} VNĐ
                                </span>
                                <button
                                    className="text-blue-500 hover:underline text-xs"
                                    onClick={() => handleEdit(category.id, index)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="text-red-500 hover:underline text-xs"
                                    onClick={() => handleDelete(category.id, index)}
                                >
                                    Xoá
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    })}
</div>

</div>

            {/* Biểu đồ trực quan */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-medium text-md text-gray-800 mb-4">Biểu đồ chi tiêu</h3>
                <PieChart width={400} height={300}>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
}
