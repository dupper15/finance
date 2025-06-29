import React from "react";
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

const MonthlyIncomeExpenseChart = ({ monthlyReportData }) => {
  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
        <FaBalanceScale className='text-purple-600' />
        Thu nhập & Chi tiêu theo 12 tháng
      </h2>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={monthlyReportData}>
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString() + " VNĐ"} />
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyIncomeExpenseChart;
