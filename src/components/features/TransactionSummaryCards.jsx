import React from "react";
import { formatCurrency } from "../../utils/formatters/currency";
import { useMonthlyTransactionSummary } from "../../hooks/useMonthlyTransactionSummary";

export function TransactionSummaryCards({ summary, accountsData, refreshTrigger = 0 }) {
	const {
		monthlyData,
		loading,
		error,
		getIncomeChangePercentage,
		getExpenseChangePercentage,
		getCurrentMonthName
	} = useMonthlyTransactionSummary(refreshTrigger);

	const currentMonthName = getCurrentMonthName();
	const incomeChangePercent = getIncomeChangePercentage();
	const expenseChangePercent = getExpenseChangePercentage();

	const formatChangeDisplay = (percentage) => {
		const absPercent = Math.abs(percentage);
		const sign = percentage >= 0 ? '+' : '-';
		return `${sign}${absPercent.toFixed(1)}%`;
	};

	const cards = [
		{
			title: `Thu nhập ${currentMonthName}`,
			value: loading ? (summary?.totalIncome || 0) : monthlyData.currentMonth.totalIncome,
			icon: (
				<svg
					className="w-6 h-6 text-green-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 16l-4-4m0 0l4-4m-4 4h18"
					/>
				</svg>
			),
			color: "green",
			change: loading ? "+12.5%" : formatChangeDisplay(incomeChangePercent),
			changeType: incomeChangePercent >= 0 ? "increase" : "decrease",
		},
		{
			title: `Chi tiêu ${currentMonthName}`,
			value: loading ? (summary?.totalExpenses || 0) : monthlyData.currentMonth.totalExpenses,
			icon: (
				<svg
					className="w-6 h-6 text-red-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 16l4-4m0 0l-4-4m4 4H3"
					/>
				</svg>
			),
			color: "red",
			change: loading ? "-8.2%" : formatChangeDisplay(expenseChangePercent),
			changeType: expenseChangePercent >= 0 ? "increase" : "decrease",
		},
		{
			title: "Số dư hiện tại",
			value: accountsData?.totalBalance || 0,
			icon: (
				<svg
					className="w-6 h-6 text-blue-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
					/>
				</svg>
			),
			color: "blue",
			change: loading
				? (summary?.netAmount >= 0
					? `+${((summary.netAmount / (summary.totalExpenses || 1)) * 100).toFixed(1)}%`
					: `${((summary.netAmount / (summary.totalExpenses || 1)) * 100).toFixed(1)}%`)
				: formatChangeDisplay(
					((monthlyData.currentMonth.netAmount - monthlyData.previousMonth.netAmount) /
						(monthlyData.previousMonth.netAmount || 1)) * 100
				),
			changeType: loading
				? (summary?.netAmount >= 0 ? "increase" : "decrease")
				: (monthlyData.currentMonth.netAmount >= monthlyData.previousMonth.netAmount ? "increase" : "decrease"),
		},
	];

	if (error) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex">
						<svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						<div className="ml-3">
							<p className="text-sm text-red-800">
								Không thể tải dữ liệu tháng hiện tại: {error}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			{cards.map((card, index) => (
				<div key={index} className="bg-white overflow-hidden shadow rounded-lg">
					<div className="p-5">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<div
									className={`w-8 h-8 bg-${card.color}-100 rounded-md flex items-center justify-center`}>
									{card.icon}
								</div>
							</div>
							<div className="ml-5 w-0 flex-1">
								<dl>
									<dt className="text-sm font-medium text-gray-500 truncate">
										{card.title}
									</dt>
									<dd className="flex items-baseline">
										<div
											className={`text-2xl font-semibold text-${card.color}-600`}>
											{formatCurrency(card.value)}
											{loading && (
												<span className="ml-2 text-sm text-gray-400">
													(đang tải...)
												</span>
											)}
										</div>
									</dd>
									<div
										className={`flex items-baseline text-sm font-semibold ${
											card.changeType === "increase"
												? "text-green-600"
												: "text-red-600"
										}`}>
										<svg
											className={`self-center flex-shrink-0 h-5 w-5 ${
												card.changeType === "increase"
													? "text-green-500"
													: "text-red-500"
											}`}
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true">
											<path
												fillRule="evenodd"
												d={
													card.changeType === "increase"
														? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
														: "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
												}
												clipRule="evenodd"
											/>
										</svg>
										<span className="sr-only">
											{card.changeType === "increase" ? "Increased" : "Decreased"} by
										</span>
										{card.change}
									</div>
								</dl>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}