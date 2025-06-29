import React from "react";

const ReportHeader = ({
  account,
  selectedAccount,
  setSelectedAccount,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const handleAccountChange = (e) => {
    const selected = account?.find((acc) => acc.account_id === e.target.value);
    setSelectedAccount(selected);
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Báo cáo</h1>
      </div>

      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div className='flex flex-col md:flex-row gap-2'>
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

          <select
            className='border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500'
            value={selectedAccount?.account_id || ""}
            onChange={handleAccountChange}>
            {Array.isArray(account) &&
              account.map((acc) => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
