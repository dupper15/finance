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
export function Reports() {
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

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
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const yyyy = d.getFullYear();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    return {
      transaction_date: `${dd}/${mm}/${yyyy}`,
      dateKey: d.toISOString().split("T")[0],
      income: 0,
      expense: 0,
      net: 0,
    };
  });
  transactions.forEach((item) => {
    const itemDate = new Date(item.transaction_date);
    const key = itemDate.toISOString().split("T")[0];
    const found = past7Days.find((d) => d.dateKey === key);
    if (found) {
      if (item.transaction_type === "income") {
        found.income += item.amount;
      } else if (item.transaction_type === "expense") {
        found.expense += item.amount;
      }
      found.net = found.income - found.expense;
    }
  });
  const netTransactionData = past7Days.map(({ transaction_date, net }) => ({
    transaction_date,
    net,
  }));

  function summarizeBudgetsByCategory(budgetCategories, transactions) {
    const categoryMap = {};
    budgetCategories.forEach((cat) => {
      cat.budgets.forEach((budget) => {
        const id = budget.category_id;
        if (!categoryMap[id]) {
          categoryMap[id] = {
            category_id: id,
            name: cat.name,
            type: cat.type,
            totalBudget: 0,
            totalSpent: 0,
          };
        }
        categoryMap[id].totalBudget += budget.amount;
      });
    });

    transactions.forEach((tx) => {
      const id = tx.category_id;
      if (categoryMap[id] && tx.transaction_type === "expense") {
        categoryMap[id].totalSpent += tx.amount;
      }
    });

    return Object.values(categoryMap).map((cat) => ({
      ...cat,
      status: getStatus(cat.totalSpent, cat.totalBudget),
    }));
  }

  function getStatus(spent, budgetAmount) {
    if (budgetAmount === 0) return null;
    const percent = (spent / budgetAmount) * 100;

    if (percent < 90) {
      return {
        label: "Trong ngân sách",
        color: "text-green-600",
        icon: <FaCheckCircle />,
      };
    }
    if (percent <= 100) {
      return {
        label: "Gần đạt giới hạn",
        color: "text-yellow-600",
        icon: <FaExclamationCircle />,
      };
    }
    return {
      label: "Vượt ngân sách",
      color: "text-red-600",
      icon: <FaTimesCircle />,
    };
  }

  function aggregateByCategory(data, budgets, type = "expense") {
    const filtered = data.filter((t) => t.transaction_type === type);
    const grouped = filtered.reduce((acc, curr) => {
      const catId = curr.category_id;
      acc[catId] = (acc[catId] || 0) + curr.amount;
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([category_id, amount]) => {
      const category = budgets.find((b) => b.category_id === category_id);
      return {
        category_id,
        name: category?.name || "Unknown",
        amount,
      };
    });

    return result;
  }
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
