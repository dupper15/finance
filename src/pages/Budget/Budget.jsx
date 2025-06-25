import React, { useState } from "react";
import { useBudgets } from "../../hooks/useBudgets.js";
import { LoadingSpinner } from "../../components/ui/Loading/LoadingSpinner.js";
import MonthlyBudget from "../../components/budgetComponent/MonthlyBudget.jsx";
import IncomeBudget from "../../components/budgetComponent/IncomeBudget.jsx";
import OutcomeBudget from "../../components/budgetComponent/OutcomeBudget.jsx";
import IncomeBudgetChart from "../../components/budgetComponent/IncomeBudgetChart.jsx";
import OutcomeBudgetChart from "../../components/budgetComponent/OutcomeBudgetChart.jsx";
import AddBudgetForm from "../../components/forms/AddBudgetForm.jsx";
import SavingGoals from "../../components/budgetComponent/SavingGoals.jsx";
const BUDGET_CATEGORIES = [
  { id: "education", name: "Giáo dục" },
  { id: "entertainment", name: "Giải trí" },
  { id: "food", name: "Ăn uống" },
];
const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#005f99",
  "#cc6600",
  "#1e7c1e",
  "#4b0082",
  "#3a915f",
  "#d4a017",
  "#800000",
  "#8b0000",
  "#2f4f4f",
  "#003366",
  "#5f9ea0",
  "#006400",
  "#a0522d",
  "#708090",
];
const CATEGORY_STYLES = {
  income: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:bg-green-100",
  },
  education: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
  },
  entertainment: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    hover: "hover:bg-purple-100",
  },
  food: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-100",
  },
};
const data = {
  income: [
    {
      name: "Lương công ty",
      amount: 2500000,
      description: "Thu nhập chính từ công việc toàn thời gian",
    },
    {
      name: "Làm thêm",
      amount: 500000,
      description: "Tiền công từ công việc làm thêm hoặc freelance",
    },
  ],
  expenses: {
    education: [
      {
        name: "Khóa học IELTS",
        amount: 1000000,
        description: "Chi phí học tiếng Anh để cải thiện kỹ năng",
      },
    ],
    entertainment: [
      {
        name: "Netflix",
        amount: 200000,
        description: "Phí thuê bao hàng tháng dịch vụ xem phim",
      },
      {
        name: "Đi chơi",
        amount: 300000,
        description: "Chi phí gặp gỡ bạn bè, cà phê, dã ngoại...",
      },
    ],
    food: [
      {
        name: "Ăn trưa",
        amount: 500000,
        description: "Chi phí ăn uống hàng ngày trong giờ làm việc",
      },
    ],
  },
};
const savingGoals = [
  {
    id: "goal-1",
    name: "Mua MacBook",
    targetAmount: 30000000,
    currentAmount: 5000000,
    description: "Mục tiêu mua MacBook Pro M3 trong năm nay",
  },
  {
    id: "goal-2",
    name: "Du lịch Đà Lạt",
    targetAmount: 5000000,
    currentAmount: 2500000,
    description: "Dành dụm cho chuyến đi Đà Lạt mùa thu",
  },
];

const incomeChartData = data.income.map((item) => ({
  name: item.name,
  value: item.amount,
}));
export function Budget() {
  const [isShowModal, setIsShowModal] = useState(false);
  const { budgets, loading } = useBudgets();
  const [selectedMonth, setSelectedMonth] = useState("2025-05");

  if (loading) {
    return <LoadingSpinner size='lg' className='h-64' />;
  }

  const pieChartData = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.name,
    value: data.expenses[cat.id]?.reduce((sum, i) => sum + i.amount, 0) || 0,
  }));

  const totalIncome = data.income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = Object.values(data.expenses)
    .flat()
    .reduce((sum, item) => sum + item.amount, 0);
  return (
    <div>
      <div className='space-y-6 w-full'>
        <MonthlyBudget
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          setIsShowModal={setIsShowModal}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <IncomeBudget
            totalIncome={totalIncome}
            data={data}
            CATEGORY_STYLES={CATEGORY_STYLES}
          />
          <OutcomeBudget
            data={data}
            BUDGET_CATEGORIES={BUDGET_CATEGORIES}
            CATEGORY_STYLES={CATEGORY_STYLES}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <IncomeBudgetChart
            incomeChartData={incomeChartData}
            COLORS={COLORS}
          />
          <OutcomeBudgetChart pieChartData={pieChartData} COLORS={COLORS} />
        </div>
        <SavingGoals goals={savingGoals} />
      </div>
      {isShowModal && (
        <AddBudgetForm isOpen={isShowModal} setIsOpen={setIsShowModal} />
      )}
    </div>
  );
}
