import { useEffect, useState } from "react";
import { useBudgets } from "../../hooks/useBudgets.js";
import { LoadingSpinner } from "../../components/ui/Loading/LoadingSpinner.js";
import MonthlyBudget from "../../components/budgetComponent/MonthlyBudget.jsx";
import IncomeBudget from "../../components/budgetComponent/IncomeBudget.jsx";
import OutcomeBudget from "../../components/budgetComponent/OutcomeBudget.jsx";
import IncomeBudgetChart from "../../components/budgetComponent/IncomeBudgetChart.jsx";
import OutcomeBudgetChart from "../../components/budgetComponent/OutcomeBudgetChart.jsx";
import AddBudgetForm from "../../components/forms/AddBudgetForm.jsx";
import SavingGoals from "../../components/budgetComponent/SavingGoals.jsx";
import { useMutation } from "@tanstack/react-query";
import { budgetService } from "../../services/budgetService.js";
import { useAuth } from "../../context/AuthContext.js";
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

const CATEGORY_STYLES = [
  {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:bg-green-100",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    hover: "hover:bg-purple-100",
  },
  {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-100",
  },
  {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    hover: "hover:bg-red-100",
  },
  {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    hover: "hover:bg-pink-100",
  },
  {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    hover: "hover:bg-indigo-100",
  },
  {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    hover: "hover:bg-teal-100",
  },
];

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

export function Budget() {
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [data, setData] = useState([]);
  const getBudgetsMutation = useMutation({
    mutationFn: budgetService.getBudget,
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.error("Error fetching budgets:", error);
    },
  });
  const { user } = useAuth();

  // Access user ID
  const userId = user?.id;
  const getBudgets = () => {
    if (selectedMonth && selectedYear) {
      getBudgetsMutation.mutate({
        month: selectedMonth,
        year: selectedYear,
        user_id: "5294e4fd-24bf-49c0-b58b-d2256d8286ee",
      });
    }
  };
  useEffect(() => {
    getBudgets();
  }, [selectedMonth, selectedYear]);
  const incomeChartData = data
    .filter((item) => item.type === "income")
    .flatMap((item) =>
      item.budgets.map((budget) => ({
        name: budget.name,
        value: budget.amount,
      }))
    );

  const [isShowModal, setIsShowModal] = useState(false);
  const { budgets, loading } = useBudgets();

  const expenseChartData = Array.from(
    data
      .filter((item) => item.type === "expense")
      .reduce((map, item) => {
        const key = item.category_id;
        const name = item.name;

        if (!map.has(key)) {
          map.set(key, { name, value: 0 });
        }

        const categoryData = map.get(key);
        const totalAmount = item.budgets.reduce((sum, b) => sum + b.amount, 0);
        categoryData.value += totalAmount;

        return map;
      }, new Map())
      .values()
  );

  const totalIncome = data
    .filter((item) => item.type === "income")
    .reduce(
      (sum, item) => sum + item.budgets.reduce((s, b) => s + b.amount, 0),
      0
    );

  const totalExpenses = data
    .filter((item) => item.type === "expense")
    .reduce(
      (sum, item) => sum + item.budgets.reduce((s, b) => s + b.amount, 0),
      0
    );

  if (loading) {
    return <LoadingSpinner size='lg' className='h-64' />;
  }
  return (
    <div>
      <div className='space-y-6 w-full'>
        <MonthlyBudget
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          setIsShowModal={setIsShowModal}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <IncomeBudget
            getBudgets={getBudgets}
            totalIncome={totalIncome}
            data={data}
            CATEGORY_STYLES={CATEGORY_STYLES}
          />
          <OutcomeBudget
            getBudgets={getBudgets}
            data={data}
            totalExpense={totalExpenses}
            CATEGORY_STYLES={CATEGORY_STYLES}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <IncomeBudgetChart
            incomeChartData={incomeChartData}
            COLORS={COLORS}
          />
          <OutcomeBudgetChart
            expenseChartData={expenseChartData}
            COLORS={COLORS}
          />
        </div>
        <SavingGoals goals={savingGoals} />
      </div>
      {isShowModal && (
        <AddBudgetForm
          getBudgets={getBudgets}
          isOpen={isShowModal}
          setIsOpen={setIsShowModal}
        />
      )}
    </div>
  );
}
