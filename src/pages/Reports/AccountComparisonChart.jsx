import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu mẫu
const data = [
  {
    name: "Tài khoản A",
    thu: 5000,
    chi: 3000,
    loinhuan: 5000 - 3000,
  },
  {
    name: "Tài khoản B",
    thu: 7000,
    chi: 4000,
    loinhuan: 7000 - 4000,
  },
  {
    name: "Tài khoản C",
    thu: 6000,
    chi: 4500,
    loinhuan: 6000 - 4500,
  },
];

const AccountComparisonChart = () => {
  return (
    <ResponsiveContainer width='100%' height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='thu' fill='#82ca9d' name='Thu' />
        <Bar dataKey='chi' fill='#ff6666' name='Chi' />
        <Bar dataKey='loinhuan' fill='#8884d8' name='Lợi nhuận' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AccountComparisonChart;
