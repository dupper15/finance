import React, { useState } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import { LoadingSpinner } from "../../components/ui/Loading/LoadingSpinner";
import AccountCard from "../../components/accountComponent/AccountCard";
import AccountFormModal from "../../components/accountComponent/AccountFormModal";
import ConfirmDialog from "../../components/accountComponent/ConfirmDialog";
import { useUser } from "../../hooks/useUser";

export function Accounts() {
	const { accounts, loading, createAccount, updateAccount, deleteAccount } =
		useAccounts();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState(null);
	const { userId } = useUser();

	const handleAdd = () => {
		setSelectedAccount(null);
		setIsModalOpen(true);
	};

	const handleEdit = (account) => {
		setSelectedAccount(account);
		setIsModalOpen(true);
	};

	const handleDelete = (account) => {
		setAccountToDelete(account);
		setConfirmOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (accountToDelete) {
			await deleteAccount(accountToDelete.account_id);
			setAccountToDelete(null);
			setConfirmOpen(false);
		}
	};

	const handleSave = async (data) => {
		if (!userId) {
			alert("Không thể tạo tài khoản vì chưa có thông tin người dùng.");
			return;
		}

		const payload = {
			...data,
			user_id: userId,
			balance: parseFloat(data.balance),
		};

		console.log("Form submitting:", payload);

		try {
			if (selectedAccount) {
				await updateAccount(data.account_id, payload);
			} else {
				await createAccount(payload);
			}
			setIsModalOpen(false);
		} catch (error) {
			console.error("Lỗi khi lưu tài khoản:", error.message);
			alert("Lưu tài khoản thất bại: " + error.message);
		}
	};

	if (loading) {
		return <LoadingSpinner size="lg" className="h-64" />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Tài khoản</h1>
				<button
					onClick={handleAdd}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
					Thêm tài khoản
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{accounts.map((account) => (
					<AccountCard
						key={account.account_id}
						account={account}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				))}
			</div>

			{accounts.length === 0 && (
				<div className="bg-white shadow rounded-lg p-6 text-center">
					<p className="text-gray-600">
						Chưa có tài khoản nào. Hãy tạo tài khoản đầu tiên!
					</p>
				</div>
			)}

			<AccountFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				initialData={selectedAccount}
			/>

			<ConfirmDialog
				isOpen={confirmOpen}
				title="Xác nhận xóa"
				message={`Bạn có chắc muốn xóa tài khoản "${accountToDelete?.name}"?`}
				onConfirm={handleConfirmDelete}
				onCancel={() => {
					setAccountToDelete(null);
					setConfirmOpen(false);
				}}
			/>
		</div>
	);
}
