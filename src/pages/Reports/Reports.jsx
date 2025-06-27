import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import {
  FaChartPie,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import Summary from "../../components/report/Summary";
import AccountComparisonChart from "./AccountComparisonChart";

export function Reports() {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#845EC2",
    "#D65DB1",
    "#FF6F91",
    "#FFC75F",
    "#F9F871",
    "#2C73D2",
  ];

  const incomeData = [
    { id: 1, name: "Lương", amount: 5000000 },
    { id: 2, name: "Thưởng", amount: 2000000 },
    { id: 3, name: "Kinh doanh", amount: 1500000 },
    { id: 4, name: "Đầu tư", amount: 1000000 },
    { id: 5, name: "Khác", amount: 500000 },
  ];

  const expenseData = [
    { id: 1, name: "Ăn uống", amount: 2000000 },
    { id: 2, name: "Đi lại", amount: 1000000 },
    { id: 3, name: "Giải trí", amount: 500000 },
    { id: 4, name: "Giáo dục", amount: 300000 },
    { id: 5, name: "Khác", amount: 200000 },
    { id: 6, name: "Mua sắm", amount: 800000 },
    { id: 7, name: "Y tế", amount: 600000 },
    { id: 8, name: "Nhà cửa", amount: 400000 },
    { id: 9, name: "Dịch vụ", amount: 300000 },
    { id: 10, name: "Vận chuyển", amount: 200000 },
  ];

  const monthlyReportData = [
    { month: "Tháng 1", income: 5000000, expense: 3000000 },
    { month: "Tháng 2", income: 4800000, expense: 3200000 },
    { month: "Tháng 3", income: 5100000, expense: 3100000 },
    { month: "Tháng 4", income: 4900000, expense: 2900000 },
    { month: "Tháng 5", income: 5300000, expense: 3500000 },
    { month: "Tháng 6", income: 4700000, expense: 3000000 },
    { month: "Tháng 7", income: 5000000, expense: 3300000 },
    { month: "Tháng 8", income: 5200000, expense: 3400000 },
    { month: "Tháng 9", income: 5500000, expense: 3600000 },
    { month: "Tháng 10", income: 5600000, expense: 3700000 },
    { month: "Tháng 11", income: 5700000, expense: 3900000 },
    { month: "Tháng 12", income: 6000000, expense: 4000000 },
  ];
  const transactionData = [
    { transaction_date: "2025-01-01", income: 200000, expense: 100000 },
    { transaction_date: "2025-01-02", income: 150000, expense: 120000 },
    { transaction_date: "2025-01-03", income: 180000, expense: 110000 },

    // ... tiếp tục các ngày khác
  ];

  const incomePieData = incomeData.map((i) => ({
    name: i.name,
    value: i.amount,
  }));

  const expensePieData = expenseData.map((e) => ({
    name: e.name,
    value: e.amount,
  }));

  const topIncomeSources = [...incomeData]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const topExpenseCategories = [...expenseData]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const barChartData = [
    {
      name: "Thu nhập",
      amount: incomeData.reduce((sum, i) => sum + i.amount, 0),
    },
    {
      name: "Chi tiêu",
      amount: expenseData.reduce((sum, i) => sum + i.amount, 0),
    },
  ];
  const netTransactionData = transactionData.map((t) => ({
    ...t,
    net: t.income - t.expense,
  }));
  const sampleBudgets = [
    {
      name: "Ăn uống",
      budget: 2000000,
      spent: 1800000,
    },
    {
      name: "Mua sắm",
      budget: 1000000,
      spent: 1500000,
    },
    {
      name: "Giải trí",
      budget: 500000,
      spent: 500000,
    },
    {
      name: "Giáo dục",
      budget: 800000,
      spent: 600000,
    },
    {
      name: "Y tế",
      budget: 300000,
      spent: 400000,
    },
    {
      name: "Nhà cửa",
      budget: 1000000,
      spent: 1200000,
    },
    {
      name: "Dịch vụ",
      budget: 600000,
      spent: 500000,
    },
    {
      name: "Vận chuyển",
      budget: 400000,
      spent: 300000,
    },
    {
      name: "Khác",
      budget: 200000,
      spent: 250000,
    },
  ];
  function getStatus(spent, budget) {
    const percent = (spent / budget) * 100;
    if (percent < 90)
      return {
        label: "Trong ngân sách",
        color: "text-green-600",
        icon: <FaCheckCircle />,
      };
    if (percent <= 100)
      return {
        label: "Gần đạt giới hạn",
        color: "text-yellow-600",
        icon: <FaExclamationCircle />,
      };
    return {
      label: "Vượt ngân sách",
      color: "text-red-600",
      icon: <FaTimesCircle />,
    };
  }
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Báo cáo</h1>
      </div>
      <Summary />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Biểu đồ Chi tiêu */}
        <div className='bg-white p-6 shadow rounded-lg space-y-4'>
          <h3 className='text-lg font-semibold text-red-700 flex items-center gap-2'>
            <FaChartPie className='text-red-500' />
            Chi tiêu theo danh mục
          </h3>
          <PieChart width={350} height={250}>
            <Pie
              data={expensePieData}
              dataKey='value'
              nameKey='name'
              outerRadius={80}
              label>
              {expensePieData.map((_, index) => (
                <Cell
                  key={`cell-expense-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div>
            <h4 className='text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide'>
              🌟 Top 3 danh mục chi tiêu
            </h4>
            <ul className='space-y-3'>
              {topExpenseCategories.map((item, i) => {
                const ranks = [
                  {
                    label: "🥇",
                    bg: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500",
                    text: "text-white",
                  },
                  {
                    label: "🥈",
                    bg: "bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400",
                    text: "text-white",
                  },
                  {
                    label: "🥉",
                    bg: "bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400",
                    text: "text-white",
                  },
                ];

                const { label, bg, border, text } = ranks[i];

                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${bg} ${border} shadow-md`}>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{label}</span>
                      <span className={`font-semibold ${text}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className={`font-bold ${text}`}>
                      -{item.amount.toLocaleString()} VNĐ
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Biểu đồ Thu nhập */}
        <div className='bg-white p-6 shadow rounded-lg space-y-4'>
          <h3 className='text-lg font-semibold text-green-700 flex items-center gap-2'>
            <FaChartPie className='text-green-500' />
            Thu nhập theo nguồn
          </h3>
          <PieChart width={350} height={250}>
            <Pie
              data={incomePieData}
              dataKey='value'
              nameKey='name'
              outerRadius={80}
              label>
              {incomePieData.map((_, index) => (
                <Cell
                  key={`cell-income-${index}`}
                  fill={COLORS[(index + 3) % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div>
            <h4 className='text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide'>
              💸 Top 3 nguồn thu
            </h4>
            <ul className='space-y-3'>
              {topIncomeSources.map((item, i) => {
                const ranks = [
                  {
                    label: "🥇",
                    bg: "bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500",
                    text: "text-white",
                  },
                  {
                    label: "🥈",
                    bg: "bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-400",
                    text: "text-white",
                  },
                  {
                    label: "🥉",
                    bg: "bg-gradient-to-r from-green-300 via-green-500 to-emerald-400",
                    text: "text-white",
                  },
                ];

                const { label, bg, text } = ranks[i];

                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${bg} shadow-md`}>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{label}</span>
                      <span className={`font-semibold ${text}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className={`font-bold ${text}`}>
                      +{item.amount.toLocaleString()} VNĐ
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

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
              fill='#00C49F' // pastel xanh ngọc đậm
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='expense'
              name='Chi tiêu'
              fill='#FF8042' // pastel cam đậm
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='bg-white shadow rounded-lg p-6 mt-6'>
        <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
          <FaBalanceScale className='text-purple-600' />
          Dòng tiền ròng theo ngày
        </h2>
        <ResponsiveContainer width='100%' height={350}>
          <LineChart data={netTransactionData}>
            <XAxis dataKey='transaction_date' />
            <YAxis />
            <Tooltip
              formatter={(value) => value.toLocaleString() + " VNĐ"}
              labelFormatter={(label) => `Ngày: ${label}`}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='net'
              name='Dòng tiền ròng'
              stroke='#845EC2' // pastel tím đậm
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <AccountComparisonChart />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sampleBudgets.map((item, i) => {
          const percent = Math.round((item.spent / item.budget) * 100);
          const status = getStatus(item.spent, item.budget);

          return (
            <div key={i} className='p-4 bg-white rounded-lg shadow space-y-3'>
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                <span className={`text-sm font-semibold ${status.color}`}>
                  {status.icon} {status.label}
                </span>
              </div>

              <div className='text-sm text-gray-600'>
                Ngân sách: {item.budget.toLocaleString()} VNĐ
              </div>
              <div className='text-sm text-gray-600'>
                Đã chi: {item.spent.toLocaleString()} VNĐ
              </div>

              <div>
                <div className='w-full bg-white shadow rounded-full h-3 relative overflow-hidden'>
                  <div
                    className={`h-full rounded-full ${
                      percent <= 100
                        ? percent < 90
                          ? "bg-green-500"
                          : percent < 100
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}></div>

                  {percent > 100 && (
                    <div
                      className='absolute top-0 right-0 h-full bg-red-700 rounded-full'
                      style={{ width: `${percent - 100}%`, minWidth: "4px" }}
                      title={`Vượt ngân sách ${percent - 100}%`}></div>
                  )}
                </div>

                <div className='text-xs text-right text-gray-500 mt-1'>
                  {percent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
