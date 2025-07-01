import React from "react";
import { formatCurrency } from "../../utils/formatters/currency";

const accountTypeStyles = {
	cash: {
		label: "Tiền mặt",
		cardClass: "bg-green-50 border-l-4 border-green-400",
		labelClass: "bg-green-200 text-green-800",
	},
	checking: {
		label: "Tài khoản thanh toán",
		cardClass: "bg-blue-50 border-l-4 border-blue-400",
		labelClass: "bg-blue-200 text-blue-800",
	},
	savings: {
		label: "Tài khoản tiết kiệm",
		cardClass: "bg-yellow-50 border-l-4 border-yellow-400",
		labelClass: "bg-yellow-200 text-yellow-800",
	},
	investment: {
		label: "Tài khoản đầu tư",
		cardClass: "bg-purple-50 border-l-4 border-purple-400",
		labelClass: "bg-purple-200 text-purple-800",
	},
	credit_card: {
		label: "Thẻ tín dụng",
		cardClass: "bg-gray-50 border-l-4 border-gray-400",
		labelClass: "bg-gray-200 text-gray-800",
	},
	loan: {
		label: "Khoản vay",
		cardClass: "bg-red-50 border-l-4 border-red-400",
		labelClass: "bg-red-200 text-red-800",
	},
};

export default function AccountCard({ account, onEdit, onDelete }) {
	const { cardClass, label, labelClass } = accountTypeStyles[
		account.account_type
	] || {
		cardClass: "bg-white",
		label: "Không xác định",
		labelClass: "bg-gray-300 text-gray-800",
	};

	return (
		<div className={`${cardClass} shadow rounded-lg p-6 space-y-2`}>
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
					<span
						className={`text-xs font-medium px-2 py-1 rounded ${labelClass}`}>
						{label}
					</span>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => onEdit(account)}
						className="text-blue-500 hover:text-blue-700 text-sm">
						Sửa
					</button>
					<button
						onClick={() => onDelete(account)}
						className="text-red-500 hover:text-red-700 text-sm">
						Xóa
					</button>
				</div>
			</div>
			<p className="text-2xl font-bold text-gray-900 mt-2">
				{formatCurrency(account.balance)}
			</p>
		</div>
	);
}
