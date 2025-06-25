import { HiChartPie, HiCurrencyDollar, HiReceiptTax } from "react-icons/hi";

const MonthlyBudget = ({
  selectedMonth,
  setSelectedMonth,
  totalIncome,
  totalExpenses,
  setIsShowModal,
}) => {
  const balance = totalIncome - totalExpenses;

  return (
    <div className='flex flex-col justify-between w-full gap-3 md:flex-row md:items-center md:gap-4'>
      <div className='flex gap-4'>
        <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
          <HiChartPie className='text-blue-600' /> Ngân sách
        </h1>
        <div className='flex gap-2'>
          <select
            className='border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value='2025-05'>Tháng 5/2025</option>
            <option value='2025-06'>Tháng 6/2025</option>
          </select>
          <button
            onClick={() => setIsShowModal(true)}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow-sm'>
            Tạo ngân sách
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full md:w-auto'>
        <div className='bg-white border border-green-200 rounded-md p-4 shadow-sm'>
          <p className='text-green-600 font-medium flex items-center gap-1'>
            <HiCurrencyDollar /> Thu nhập
          </p>
          <p className='text-green-700 font-semibold text-lg mt-1'>
            +{totalIncome.toLocaleString()} VNĐ
          </p>
        </div>

        <div className='bg-white border border-red-200 rounded-md p-4 shadow-sm'>
          <p className='text-red-600 font-medium flex items-center gap-1'>
            <HiReceiptTax /> Chi tiêu
          </p>
          <p className='text-red-700 font-semibold text-lg mt-1'>
            -{totalExpenses.toLocaleString()} VNĐ
          </p>
        </div>

        <div className='bg-white border border-blue-200 rounded-md p-4 shadow-sm'>
          <p className='text-blue-600 font-medium flex items-center gap-1'>
            <HiChartPie /> Số dư
          </p>
          <p
            className={`font-semibold text-lg mt-1 ${
              balance >= 0 ? "text-blue-700" : "text-orange-600"
            }`}>
            {balance >= 0 ? "+" : "-"}
            {Math.abs(balance).toLocaleString()} VNĐ
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBudget;
