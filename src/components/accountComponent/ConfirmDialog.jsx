import React from "react";

export default function ConfirmDialog({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
				<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
				<p className="text-sm text-gray-600 mt-2">{message}</p>

				<div className="flex justify-end space-x-2 mt-6">
					<button
						onClick={onCancel}
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
						Hủy
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
						Xác nhận
					</button>
				</div>
			</div>
		</div>
	);
}
