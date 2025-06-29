import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaBalanceScale } from "react-icons/fa";
import { reportService } from "../../services/reportService";
import { useMutation } from "@tanstack/react-query";

const AccountComparisonChart = ({ accounts, month, year }) => {
  const [accountReportData, setAccountReportData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const getTransactionsByIdsMutation = useMutation({
    mutationFn: reportService.getTransactionByAccountIds,
    onSuccess: (data) => {
      setTransactions(data);
    },
    onError: (error) => {
      console.error("Error fetching transactions:", error);
    },
  });
  const getTransactionByIds = (accountIds) => {
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      setTransactions([]);
      return;
    }
    getTransactionsByIdsMutation.mutate({ accountIds, month, year });
  };
  useEffect(() => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      const accountIds = accounts.map((acc) => acc.account_id);
      getTransactionByIds(accountIds);
    } else {
      setTransactions([]);
    }
  }, [accounts]);
  const buildAccountReport = () => {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      setAccountReportData([]);
      return;
    }

    const report = accounts.map((acc) => ({
      accountName: acc?.name || "Không tên",
      income: 0,
      expense: 0,
      profit: 0,
    }));

    if (!Array.isArray(transactions) || transactions.length === 0) {
      setAccountReportData([]);
      return;
    }

    transactions.forEach((tx) => {
      if (
        !tx ||
        !tx.transaction_date ||
        !tx.account_id ||
        !tx.transaction_type ||
        typeof tx.amount !== "number"
      )
        return;

      const txDate = new Date(tx.transaction_date);
      if (isNaN(txDate)) return;

      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();

      if (txMonth === parseInt(month) && txYear === parseInt(year)) {
        const idx = accounts.findIndex(
          (acc) => String(acc.account_id) === String(tx.account_id)
        );
        if (idx !== -1) {
          if (tx.transaction_type === "income") {
            report[idx].income += tx.amount;
          } else if (tx.transaction_type === "expense") {
            report[idx].expense += tx.amount;
          }
        }
      }
    });

    report.forEach((r) => {
      r.profit = r.income - r.expense;
    });

    const filteredReport = report.filter(
      (r) => r.income > 0 || r.expense > 0 || r.profit !== 0
    );

    setAccountReportData(filteredReport);
  };

  useEffect(() => {
    buildAccountReport();
  }, [accounts, transactions, month, year]);

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return (
      <div className='text-center text-gray-500'>
        Không có tài khoản để hiển thị.
      </div>
    );
  }

  const totalIncome = accountReportData?.reduce(
    (sum, acc) => sum + (acc?.income || 0),
    0
  );
  const totalExpense = accountReportData?.reduce(
    (sum, acc) => sum + (acc?.expense || 0),
    0
  );
  const totalProfit = accountReportData?.reduce(
    (sum, acc) => sum + (acc?.profit || 0),
    0
  );

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
        <FaBalanceScale className='text-purple-600' />
        Thu nhập & Chi tiêu theo tài khoản ({month}/{year})
      </h2>

      {accountReportData.length === 0 ? (
        <p className='text-center text-gray-500'>
          Không có dữ liệu giao dịch cho tháng {month}/{year}.
        </p>
      ) : (
        <>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart
              data={accountReportData}
              margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey='accountName' />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN") + " VNĐ"}
              />
              <Legend />
              <Bar
                dataKey='income'
                name='Thu nhập'
                fill='#00C49F'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='expense'
                name='Chi tiêu'
                fill='#FF8042'
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey='profit'
                name='Lợi nhuận'
                fill='#8884d8'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className='mt-4 text-sm text-gray-700'>
            <p>Tổng thu nhập: {totalIncome.toLocaleString("vi-VN")} VNĐ</p>
            <p>Tổng chi tiêu: {totalExpense.toLocaleString("vi-VN")} VNĐ</p>
            <p>Lợi nhuận ròng: {totalProfit.toLocaleString("vi-VN")} VNĐ</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountComparisonChart;
