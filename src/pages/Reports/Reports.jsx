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
  const [userId, setUserId] = useState(null);

  const { user } = useAuth();
  const { exportReport, loading: exportLoading } = useReportExport();

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId) {
        getBudgetsMutation.mutate({
          account_id: selectedAccount?.account_id,
          month: selectedMonth,
          year: selectedYear,
          user_id: userId,
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [userId, selectedMonth, selectedYear, selectedAccount]);
  const getAccountMutation = useMutation({
    mutationFn: budgetService.getAccount,
    onSuccess: (data) => {
      setAccount(data);
      if (!selectedAccount && data.length > 0) {
        setSelectedAccount(data[1]);
      }
    },
    onError: (error) => console.error("Error fetching account:", error),
  });

  useEffect(() => {
    getAccountMutation.mutate(userId);
  }, []);

  const getTransactionByAccountMutation = useMutation({
    mutationFn: reportService.getTransactionByAccount,
    onSuccess: (data) => {
      setTransactions(data);
      console.log("Transactions fetched:", data);
    },
    onError: (error) => console.error("Error fetching transactions:", error),
  });

  useEffect(() => {
    if (selectedAccount !== null && selectedAccount.account_id !== undefined) {
      console.log(
        "Fetching transactions for account:",
        selectedAccount.account_id
      );
      const data = { accountId: selectedAccount.account_id };
      getTransactionByAccountMutation.mutate(data);
    }
  }, [selectedAccount, selectedMonth, selectedYear]);
  const getBudgetsMutation = useMutation({
    mutationFn: budgetService.getBudget,
    onSuccess: (data) => {
      setBudgets(data);
      console.log("Budgets fetched:", data);
    },
    onError: (error) => console.error("Error fetching budgets:", error),
  });

  useEffect(() => {
    getBudgetsMutation.mutate({
      account_id: selectedAccount?.account_id,
      month: selectedMonth,
      year: selectedYear,
      user_id: userId,
    });
  }, [selectedMonth, selectedYear, selectedAccount]);

  const handleExportReport = async (format = 'pdf') => {
    try {
      const filters = {
        month: selectedMonth,
        year: selectedYear,
      };

      if (selectedAccount?.account_id) {
        filters.account_id = selectedAccount.account_id;
      }

      await exportReport(filters, format);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

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

  const [income, setIncome] = useState({ thisMonth: 0, lastMonth: 0 });
  const [expenses, setExpenses] = useState({ thisMonth: 0, lastMonth: 0 });
  const [savings, setSavings] = useState({ thisMonth: 0, lastMonth: 0 });

  useEffect(() => {
    if (!Array.isArray(transactions)) return;

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
        date.getMonth() + 1 === lastMonth &&
        date.getFullYear() === lastMonthYear
      );
    });

    const incomeData = {
      thisMonth: sumAmount(
        thisMonthData.filter((i) => i.transaction_type === "income")
      ),
      lastMonth: sumAmount(
        lastMonthData.filter((i) => i.transaction_type === "income")
      ),
    };

    const expenseData = {
      thisMonth: sumAmount(
        thisMonthData.filter((i) => i.transaction_type === "expense")
      ),
      lastMonth: sumAmount(
        lastMonthData.filter((i) => i.transaction_type === "expense")
      ),
    };

    setIncome(incomeData);
    setExpenses(expenseData);
    setSavings({
      thisMonth: incomeData.thisMonth - expenseData.thisMonth,
      lastMonth: incomeData.lastMonth - expenseData.lastMonth,
    });
  }, [selectedMonth, selectedYear, transactions]);

  const monthlyReportData = Array.from({ length: 12 }, (_, index) => {
    const m = index + 1;
    return {
      month: `${m.toString().padStart(2, "0")}/${selectedYear}`,
      income: 0,
      expense: 0,
    };
  });
  if (Array.isArray(transactions)) {
    transactions.forEach((item) => {
      const date = new Date(item.transaction_date);
      const itemMonth = date.getMonth(); // 0–11
      const itemYear = date.getFullYear();
      if (itemYear === selectedYear) {
        const key = item.transaction_type; // "income" hoặc "expense"
        if (
          (key === "income" || key === "expense") &&
          monthlyReportData[itemMonth]
        ) {
          monthlyReportData[itemMonth][key] =
            (monthlyReportData[itemMonth][key] || 0) + item.amount;
        }
      }
    });
  }

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
  if (Array.isArray(transactions)) {
    transactions.forEach((item) => {
      if (!item?.transaction_date) return; // bỏ qua nếu thiếu ngày

      const itemDate = new Date(item.transaction_date);
      if (isNaN(itemDate.getTime())) return; // bỏ qua nếu không hợp lệ

      const key = itemDate.toISOString().split("T")[0];
      const found = past7Days.find((d) => d.dateKey === key);

      if (found) {
        if (item.transaction_type === "income") {
          found.income += item.amount || 0;
        } else if (item.transaction_type === "expense") {
          found.expense += item.amount || 0;
        }
        found.net = found.income - found.expense;
      }
    });
  }

  const netTransactionData = past7Days.map(({ transaction_date, net }) => ({
    transaction_date,
    net,
  }));
  const summarizedCategories = summarizeBudgetsByCategory(
    budgets,
    transactions
  );
  function summarizeBudgetsByCategory(budgetCategories, transactions) {
    const categoryMap = {};

    budgetCategories.forEach((category) => {
      const id = category.category_id;
      const name = category.name || "Unknown";
      const type = category.type || "unknown";

      if (!categoryMap[id]) {
        categoryMap[id] = {
          category_id: id,
          name,
          type,
          totalBudget: 0,
          totalSpent: 0,
        };
      }

      if (Array.isArray(category.budgets)) {
        category.budgets.forEach((budget) => {
          categoryMap[id].totalBudget += Number(budget.amount) || 0;
        });
      }
    });

    if (Array.isArray(transactions)) {
      transactions.forEach((tx) => {
        const id = tx.category_id;
        if (categoryMap[id] && tx.transaction_type === "expense") {
          categoryMap[id].totalSpent += Number(tx.amount) || 0;
        }
      });
    }

    return Object.values(categoryMap).map((cat) => ({
      ...cat,
      status: getStatus(cat.totalSpent, cat.totalBudget, cat.type),
    }));
  }

  function getStatus(spent, budget, type = "expense") {
    if (type === "income") {
      if (spent >= budget) {
        return {
          label: "🎉 Đã đạt mục tiêu!",
          color: "text-green-600",
          icon: "✅",
        };
      } else {
        return {
          label: "Đang tiến tới mục tiêu",
          color: "text-blue-600",
          icon: "📈",
        };
      }
    } else {
      if (spent < budget * 0.9) {
        return { label: "Ổn định", color: "text-green-600", icon: "✅" };
      } else if (spent <= budget) {
        return { label: "Sắp hết!", color: "text-yellow-600", icon: "⚠️" };
      } else {
        return { label: "Vượt mức!", color: "text-red-600", icon: "❌" };
      }
    }
  }

  function aggregateByCategory(data, budgets, type = "expense") {
    if (!Array.isArray(data) || !Array.isArray(budgets)) return [];

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
