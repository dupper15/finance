import React from "react";

const ReportHeader = ({
  account,
  selectedAccount,
  setSelectedAccount,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onExportReport,
  exportLoading = false,
}) => {
  const handleAccountChange = (e) => {
    const selected = account?.find((acc) => acc.account_id === e.target.value);
    setSelectedAccount(selected);
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Báo cáo</h1>

        {onExportReport && (
          <button
            onClick={onExportReport}
            disabled={exportLoading}
            className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'>
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
            {exportLoading ? "Đang xuất..." : "Xuất PDF"}
          </button>
        )}
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
