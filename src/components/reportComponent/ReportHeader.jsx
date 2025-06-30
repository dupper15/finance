import React, { useState, useRef, useEffect } from "react";

const ReportHeader = ({
                          account,
                          selectedAccount,
                          setSelectedAccount,
                          selectedMonth,
                          setSelectedMonth,
                          selectedYear,
                          setSelectedYear,
                          onExportReport,
                          exportLoading = false
                      }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleAccountChange = (e) => {
        const selected = account?.find((acc) => acc.account_id === e.target.value);
        setSelectedAccount(selected);
    };

    const handleExportClick = (format) => {
        setShowDropdown(false);
        onExportReport(format);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-gray-900'>Báo cáo</h1>

                {onExportReport && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            disabled={exportLoading}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {exportLoading ? 'Đang xuất...' : 'Xuất báo cáo'}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDropdown && !exportLoading && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleExportClick('pdf')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Xuất PDF (có biểu đồ)
                                    </button>
                                    <button
                                        onClick={() => handleExportClick('excel')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Xuất Excel (dữ liệu)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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