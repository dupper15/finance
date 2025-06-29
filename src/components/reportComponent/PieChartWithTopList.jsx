import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaChartPie } from "react-icons/fa";

const PieChartWithTopList = ({
  title,
  type, // 'income' | 'expense'
  pieData,
  topList,
}) => {
  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const isIncome = type === "income";

  const ranks = [
    {
      label: "🥇",
      bg: isIncome
        ? "bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500"
        : "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500",
      text: "text-white",
    },
    {
      label: "🥈",
      bg: isIncome
        ? "bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-400"
        : "bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400",
      text: "text-white",
    },
    {
      label: "🥉",
      bg: isIncome
        ? "bg-gradient-to-r from-green-300 via-green-500 to-emerald-400"
        : "bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400",
      text: "text-white",
    },
  ];

  return (
    <div className='bg-white p-6 shadow rounded-lg space-y-4'>
      <h3
        className={`text-lg font-semibold ${
          isIncome ? "text-green-700" : "text-red-700"
        } flex items-center gap-2`}>
        <FaChartPie className={isIncome ? "text-green-500" : "text-red-500"} />
        {title}
      </h3>

      <div className='flex justify-center mb-2'>
        <PieChart width={350} height={250}>
          <Pie
            data={pieData}
            dataKey='value'
            nameKey='name'
            outerRadius={80}
            label>
            {pieData.map((_, index) => (
              <Cell
                key={`${type}-cell-${index}`}
                fill={COLORS[(isIncome ? index + 3 : index) % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div>
        <h4 className='text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide'>
          {isIncome ? "💸 Top 3 nguồn thu" : "🌟 Top 3 danh mục chi tiêu"}
        </h4>
        <ul className='space-y-3'>
          {topList.map((item, i) => {
            const { label, bg, text } = ranks[i];
            return (
              <li
                key={i}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${bg} shadow-md`}>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>{label}</span>
                  <span className={`font-semibold ${text}`}>{item.name}</span>
                </div>
                <span className={`font-bold ${text}`}>
                  {isIncome ? "+" : "-"}
                  {item.amount.toLocaleString()} VNĐ
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PieChartWithTopList;
