import { FaChartLine } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const IncomeBudgetChart = ({ incomeChartData, COLORS }) => {
  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h3 className='font-medium text-md text-gray-800 mb-4 flex items-center gap-2'>
        <FaChartLine className='text-blue-600' /> Biểu đồ thu nhập
      </h3>
      <div className='flex justify-center'>
        <PieChart width={400} height={300}>
          <Pie
            data={incomeChartData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
            label>
            {incomeChartData.map((_, index) => (
              <Cell
                key={`cell-income-${index}`}
                fill={COLORS[(index % COLORS.length) + 10]}
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
export default IncomeBudgetChart;
