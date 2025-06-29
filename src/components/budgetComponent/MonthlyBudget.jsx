import { HiChartPie, HiCurrencyDollar, HiReceiptTax } from "react-icons/hi";

const MonthlyBudget = ({
  account,
  selectedAccount,
  setSelectedAccount,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  totalIncome,
  totalExpenses,
  setIsShowModal,
}) => {
  const balance = (totalIncome || 0) - (totalExpenses || 0);

  const handleAccountChange = (e) => {
    const selectedAccount = account?.find(
      (acc) => acc.account_id === e.target.value
    );

    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
    } else {
      console.error("Không tìm thấy tài khoản");
    }
  };

  if (!account || account.length === 0) {
    return <div className='loading'>Vui lòng thêm tài khoản vào hệ thống.</div>;
  }

  const defaultAccount = account[0];

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
          <HiChartPie className='text-blue-600' /> Ngân sách
        </h1>
        <select
          className='border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto'
          value={
            selectedAccount?.account_id || defaultAccount?.account_id || ""
          }
          onChange={handleAccountChange}>
          {Array.isArray(account) &&
            account.map((acc) => (
              <option key={acc.account_id} value={acc.account_id}>
                {acc.name}
              </option>
            ))}
        </select>
      </div>

      <div className='flex flex-col md:flex-row md:justify-start gap-2'>
        <select
          className='border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500'
          value={selectedMonth?.toString().padStart(2, "0") || "01"}
          onChange={(e) => setSelectedMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month.toString().padStart(2, "0")}>
              Tháng {month}
            </option>
          ))}
        </select>
        <select
          className='border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500'
          value={selectedYear || 2025}
          onChange={(e) => setSelectedYear(e.target.value)}>
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              Năm {year}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsShowModal(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow-sm'>
          Tạo ngân sách
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm w-full'>
        <div className='bg-white border border-green-200 rounded-md p-4 shadow-sm'>
          <p className='text-green-600 font-medium flex items-center gap-1'>
            <HiCurrencyDollar /> Thu nhập
          </p>
          <p className='text-green-700 font-semibold text-lg mt-1'>
            +{(totalIncome || 0).toLocaleString()} VNĐ
          </p>
        </div>

        <div className='bg-white border border-red-200 rounded-md p-4 shadow-sm'>
          <p className='text-red-600 font-medium flex items-center gap-1'>
            <HiReceiptTax /> Chi tiêu
          </p>
          <p className='text-red-700 font-semibold text-lg mt-1'>
            -{(totalExpenses || 0).toLocaleString()} VNĐ
          </p>
        </div>

        <div className='bg-white border border-blue-200 rounded-md p-4 shadow-sm'>
          <p className='text-blue-600 font-medium flex items-center gap-1'>
            <HiChartPie /> Tích lũy
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
