import { FaChartPie } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const OutcomeBudgetChart = ({ expenseChartData, COLORS }) => {
  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h3 className='font-medium text-md text-gray-800 mb-4 flex items-center gap-2'>
        <FaChartPie className='text-red-600' /> Biểu đồ chi tiêu
      </h3>
      <div className='flex justify-center'>
        <PieChart width={400} height={300}>
          <Pie
            data={expenseChartData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
            label>
            {expenseChartData.map((_, index) => (
              <Cell
                key={`cell-expense-${index}`}
                fill={COLORS[(index % COLORS.length) + 4]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};
export default OutcomeBudgetChart;
