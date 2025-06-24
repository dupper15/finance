import React, { useState, useEffect } from 'react';
import {useAccounts} from "../../hooks/useAccounts";
import {useCategories} from "../../hooks/useCategories";
import {useTags} from "../../hooks/useTags";
import {formatDateForInput} from "../../utils/formatters/date";
import {TRANSACTION_TYPES} from "../../utils/constants/transactionTypes";
export function TransactionForm({
                                    transaction = null,
                                    onSubmit,
                                    onCancel,
                                    isOpen = false
                                }) {
    const { accounts } = useAccounts();
    const { categories } = useCategories();
    const { tags } = useTags();

    const [formData, setFormData] = useState({
        account_id: '',
        description: '',
        amount: '',
        transaction_date: formatDateForInput(new Date()),
        transaction_type: TRANSACTION_TYPES.EXPENSE,
        category_id: '',
        tag_id: '',
        memo: '',
        transfer_account_id: '',
        is_repeating: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                account_id: transaction.account_id || '',
                description: transaction.description || '',
                amount: transaction.amount?.toString() || '',
                transaction_date: formatDateForInput(transaction.transaction_date) || formatDateForInput(new Date()),
                transaction_type: transaction.transaction_type || TRANSACTION_TYPES.EXPENSE,
                category_id: transaction.category_id || '',
                tag_id: transaction.tag_id || '',
                memo: transaction.memo || '',
                transfer_account_id: transaction.transfer_account_id || '',
                is_repeating: false
            });
        } else {
            setFormData({
                account_id: accounts.length > 0 ? accounts[0].account_id : '',
                description: '',
                amount: '',
                transaction_date: formatDateForInput(new Date()),
                transaction_type: TRANSACTION_TYPES.EXPENSE,
                category_id: '',
                tag_id: '',
                memo: '',
                transfer_account_id: '',
                is_repeating: false
            });
        }
    }, [transaction, accounts]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.account_id) {
            newErrors.account_id = 'Tài khoản là bắt buộc';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả là bắt buộc';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Số tiền phải lớn hơn 0';
        }

        if (!formData.transaction_date) {
            newErrors.transaction_date = 'Ngày giao dịch là bắt buộc';
        }

        if (formData.transaction_type === TRANSACTION_TYPES.TRANSFER && !formData.transfer_account_id) {
            newErrors.transfer_account_id = 'Tài khoản đích là bắt buộc cho giao dịch chuyển khoản';
        }

        if (formData.transaction_type === TRANSACTION_TYPES.TRANSFER && formData.account_id === formData.transfer_account_id) {
            newErrors.transfer_account_id = 'Tài khoản đích phải khác tài khoản nguồn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                ...formData,
                amount: parseFloat(formData.amount),
                transaction_date: new Date(formData.transaction_date).toISOString(),
                category_id: formData.category_id || null,
                tag_id: formData.tag_id || null,
                transfer_account_id: formData.transaction_type === TRANSACTION_TYPES.TRANSFER ? formData.transfer_account_id : null
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const availableTransferAccounts = accounts.filter(account => account.account_id !== formData.account_id);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {transaction ? 'Sửa Giao Dịch' : 'Thêm Giao Dịch'}
                        </h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tài khoản
                            </label>
                            <select
                                name="account_id"
                                value={formData.account_id}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.account_id ? 'border-red-300' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">Chọn tài khoản</option>
                                {accounts.map(account => (
                                    <option key={account.account_id} value={account.account_id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                            {errors.account_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.account_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả *
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Nhập mô tả giao dịch"
                                required
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày *
                            </label>
                            <input
                                type="date"
                                name="transaction_date"
                                value={formData.transaction_date}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.transaction_date ? 'border-red-300' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.transaction_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại giao dịch
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        value={TRANSACTION_TYPES.EXPENSE}
                                        checked={formData.transaction_type === TRANSACTION_TYPES.EXPENSE}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Chi tiêu
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        value={TRANSACTION_TYPES.INCOME}
                                        checked={formData.transaction_type === TRANSACTION_TYPES.INCOME}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Thu nhập
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        value={TRANSACTION_TYPES.TRANSFER}
                                        checked={formData.transaction_type === TRANSACTION_TYPES.TRANSFER}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Chuyển khoản
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục *
                            </label>
                            <div className="flex">
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">---</option>
                                    {categories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thẻ
                            </label>
                            <div className="flex">
                                <select
                                    name="tag_id"
                                    value={formData.tag_id}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">---</option>
                                    {tags.map(tag => (
                                        <option key={tag.tag_id} value={tag.tag_id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {formData.transaction_type === TRANSACTION_TYPES.TRANSFER && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tài khoản đích
                                </label>
                                <div className="flex">
                                    <select
                                        name="transfer_account_id"
                                        value={formData.transfer_account_id}
                                        onChange={handleChange}
                                        className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.transfer_account_id ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">---</option>
                                        {availableTransferAccounts.map(account => (
                                            <option key={account.account_id} value={account.account_id}>
                                                {account.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                {errors.transfer_account_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.transfer_account_id}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.amount ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                name="memo"
                                value={formData.memo}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ghi chú thêm cho giao dịch..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_repeating"
                                checked={formData.is_repeating}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                Lặp lại
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang lưu...' : (transaction ? 'Cập nhật' : 'Thêm')}
                            </button>
                            {!transaction && (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                                    onClick={() => {
                                        handleSubmit(new Event('submit'));
                                    }}
                                >
                                    Thêm Thêm
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}