import React, { useState, useEffect } from "react";

export default function AccountFormModal({
	isOpen,
	onClose,
	onSave,
	initialData,
}) {
	const [formData, setFormData] = useState({
		name: "",
		account_type: "cash",
		balance: 0,
		is_active: true,
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name || "",
				account_type: initialData.account_type || "cash",
				balance: initialData.balance || 0,
				is_active:
					initialData.is_active !== undefined ? initialData.is_active : true,
			});
		} else {
			setFormData({
				name: "",
				account_type: "cash",
				balance: 0,
				is_active: true,
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	const handleClose = () => {
		if (initialData) {
			setFormData({
				name: initialData.name || "",
				account_type: initialData.account_type || "cash",
				balance: initialData.balance || 0,
				is_active:
					initialData.is_active !== undefined ? initialData.is_active : true,
			});
		} else {
			setFormData({
				name: "",
				account_type: "cash",
				balance: 0,
				is_active: true,
			});
		}
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">
					{initialData ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Tên tài khoản
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Loại tài khoản
						</label>
						<select
							name="account_type"
							value={formData.account_type}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
							<option value="cash">Tiền mặt</option>
							<option value="checking">Tài khoản thanh toán</option>
							<option value="savings">Tài khoản tiết kiệm</option>
							<option value="investment">Đầu tư</option>
							<option value="credit_card">Thẻ tín dụng</option>
							<option value="loan">Khoản vay</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Số dư ban đầu
						</label>
						<input
							type="number"
							name="balance"
							value={formData.balance}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="flex items-center">
						<input
							type="checkbox"
							name="is_active"
							checked={formData.is_active}
							onChange={handleChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label className="ml-2 text-sm text-gray-700">Đang hoạt động</label>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
							Hủy
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
							Lưu
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
