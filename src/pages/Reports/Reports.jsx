import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Summary from "../../components/reportComponent/Summary";
import AccountComparisonChart from "./AccountComparisonChart";
import { useEffect, useState } from "react";
import ReportHeader from "./../../components/reportComponent/ReportHeader";
import { budgetService } from "../../services/budgetService";
import { useMutation } from "@tanstack/react-query";
import PieChartWithTopList from "../../components/reportComponent/PieChartWithTopList";
import NetCashFlowChart from "../../components/reportComponent/NetCashFlowChart";
import MonthlyIncomeExpenseChart from "../../components/reportComponent/MonthlyIncomeExpenseChart";
import BudgetProgressCard from "../../components/reportComponent/BudgetProgressCard";
import { reportService } from "../../services/reportService";
import { useAuth } from "../../context/AuthContext";
import { useReportExport } from "../../hooks/useReportExport";

export function Reports() {
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();
  const { exportReport, loading: exportLoading } = useReportExport();

  const userId = user?.id;

  const getAccountMutation = useMutation({
    mutationFn: budgetService.getAccount,
    onSuccess: (data) => {
      setAccount(data);
      if (!selectedAccount && data.length > 0) {
        setSelectedAccount(data[0].account_id);
      }
    },
    onError: (error) => console.error("Error fetching account:", error),
  });

  useEffect(() => {
    getAccountMutation.mutate(userId);
  }, []);

  const getTransactionByAccountMutation = useMutation({
    mutationFn: reportService.getTransactionByAccount,
    onSuccess: setTransactions,
    onError: (error) => console.error("Error fetching transactions:", error),
  });

  useEffect(() => {
    if (selectedAccount) {
      getTransactionByAccountMutation.mutate(selectedAccount);
    }
  }, [selectedAccount]);

  const getBudgetsMutation = useMutation({
    mutationFn: budgetService.getBudget,
    onSuccess: setBudgets,
    onError: (error) => console.error("Error fetching budgets:", error),
  });

  useEffect(() => {
    getBudgetsMutation.mutate({
      month: selectedMonth,
      year: selectedYear,
      user_id: userId,
    });
  }, [selectedMonth, selectedYear]);

  const handleExportReport = async () => {
    try {
      const filters = {
        month: selectedMonth,
        year: selectedYear,
      };

      if (selectedAccount?.account_id) {
        filters.account_id = selectedAccount.account_id;
      }

      await exportReport(filters);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  function summarizeBudgetsByCategory(budgets, transactions) {
    const categoryMap = new Map();

    budgets.forEach((budget) => {
      const categoryId = budget.category_id;
      const categoryName = budget.categories?.name || "Không phân loại";

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          name: categoryName,
          budgetAmount: 0,
          spentAmount: 0,
          status: "safe",
        });
      }

      categoryMap.get(categoryId).budgetAmount += budget.amount;
    });

    transactions.forEach((transaction) => {
      const categoryId = transaction.category_id;
      const amount = transaction.amount;

      if (
          categoryMap.has(categoryId) &&
          transaction.transaction_type === "expense"
      ) {
        categoryMap.get(categoryId).spentAmount += amount;
      }
    });

    return Array.from(categoryMap.values()).map((category) => {
      const percentage = category.budgetAmount
          ? (category.spentAmount / category.budgetAmount) * 100
          : 0;

      let status = "safe";
      let icon = FaCheckCircle;
      let color = "text-green-600";

      if (percentage >= 100) {
        status = "over";
        icon = FaTimesCircle;
        color = "text-red-600";
      } else if (percentage >= 80) {
        status = "warning";
        icon = FaExclamationCircle;
        color = "text-yellow-600";
      }

      return {
        ...category,
        percentage: Math.min(percentage, 100),
        status,
        icon,
        color,
      };
    });
  }

  function aggregateByCategory(transactions, budgets, type) {
    const categoryMap = new Map();

    budgets.forEach((budget) => {
      const categoryId = budget.category_id;
      const categoryName = budget.categories?.name || "Không phân loại";
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { name: categoryName, amount: 0 });
      }
    });

    transactions
        .filter((transaction) => transaction.transaction_type === type)
        .forEach((transaction) => {
          const categoryId = transaction.category_id;
          const categoryName = transaction.categories?.name || "Không phân loại";
          const amount = transaction.amount;

          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, { name: categoryName, amount: 0 });
          }

          categoryMap.get(categoryId).amount += amount;
        });

    const result = Array.from(categoryMap.values()).map((category) => {
      return {
        name: category.name || "Unknown",
        amount: category.amount,
      };
    });

    return result;
  }

  const summarizedCategories = summarizeBudgetsByCategory(
      budgets,
      transactions
  );
  const allExpenseByCategory = aggregateByCategory(
      transactions,
      budgets,
      "expense"
  );
  const allIncomeByCategory = aggregateByCategory(
      transactions,
      budgets,
      "income"
  );

  const topExpenseCategories = [...allExpenseByCategory]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

  const topIncomeSources = [...allIncomeByCategory]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

  const expensePieData = allExpenseByCategory.map((cat) => ({
    name: cat.name,
    value: cat.amount,
  }));
  const incomePieData = allIncomeByCategory.map((cat) => ({
    name: cat.name,
    value: cat.amount,
  }));

  const sumAmount = (list) =>
      list.reduce((total, item) => total + item.amount, 0);

  const thisMonthData = transactions.filter((item) => {
    const date = new Date(item.transaction_date);
    return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
    );
  });
  const lastMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const lastMonthYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
  const lastMonthData = transactions.filter((item) => {
    const date = new Date(item.transaction_date);
    return (
        date.getMonth() + 1 === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const income = {
    thisMonth: sumAmount(
        thisMonthData.filter((i) => i.transaction_type === "income")
    ),
    lastMonth: sumAmount(
        lastMonthData.filter((i) => i.transaction_type === "income")
    ),
  };
  const expenses = {
    thisMonth: sumAmount(
        thisMonthData.filter((i) => i.transaction_type === "expense")
    ),
    lastMonth: sumAmount(
        lastMonthData.filter((i) => i.transaction_type === "expense")
    ),
  };
  const savings = {
    thisMonth: income.thisMonth - expenses.thisMonth,
    lastMonth: income.lastMonth - expenses.lastMonth,
  };

  const monthlyReportData = Array.from({ length: 12 }, (_, index) => {
    const m = index + 1;
    return {
      month: `${m.toString().padStart(2, "0")}/${selectedYear}`,
      income: 0,
      expense: 0,
    };
  });
  transactions.forEach((item) => {
    const date = new Date(item.transaction_date);
    const itemMonth = date.getMonth();
    const itemYear = date.getFullYear();
    if (itemYear === selectedYear) {
      const key = item.transaction_type;
      if (key === "income" || key === "expense") {
        monthlyReportData[itemMonth][key] += item.amount;
      }
    }
  });

  const today = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const netTransactionData = past7Days.map((date) => {
    const dayTransactions = transactions.filter(
        (t) => t.transaction_date.split("T")[0] === date
    );
    const income = dayTransactions
        .filter((t) => t.transaction_type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTransactions
        .filter((t) => t.transaction_type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: new Date(date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      net: income - expenses,
    };
  });

  return (
      <div className='space-y-6'>
        <ReportHeader
            month={selectedMonth}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setSelectedAccount={setSelectedAccount}
            selectedAccount={selectedAccount}
            setAccount={setAccount}
            account={account || {}}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onExportReport={handleExportReport}
            exportLoading={exportLoading}
        />
        <Summary income={income} expenses={expenses} savings={savings} />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <PieChartWithTopList
              title='Thu nhập theo nguồn'
              type='income'
              pieData={incomePieData}
              topList={topIncomeSources}
          />
          <PieChartWithTopList
              title='Chi tiêu theo danh mục'
              type='expense'
              pieData={expensePieData}
              topList={topExpenseCategories}
          />
        </div>

        <MonthlyIncomeExpenseChart monthlyReportData={monthlyReportData} />
        <NetCashFlowChart netTransactionData={netTransactionData} />
        <AccountComparisonChart
            accounts={account}
            month={selectedMonth}
            year={selectedYear}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {summarizedCategories.map((item, i) => (
              <BudgetProgressCard key={i} item={item} />
          ))}
        </div>
      </div>
  );
}