import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaBalanceScale } from "react-icons/fa";

const NetCashFlowChart = ({ netTransactionData }) => {
  return (
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
            stroke='#845EC2'
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetCashFlowChart;
