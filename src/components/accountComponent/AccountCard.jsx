import React from "react";
import { formatCurrency } from "../../utils/formatters/currency";

export default function AccountCard({ account, onEdit, onDelete }) {
	return (
		<div className="bg-white shadow rounded-lg p-6 space-y-2">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
					<p className="text-sm text-gray-500 capitalize">
						{account.account_type}
					</p>
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
