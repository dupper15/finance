import React, { useState, useEffect } from 'react';
import { useAccounts } from "../../hooks/useAccounts";
import { useCategories } from "../../hooks/useCategories";
import { formatDateForInput } from "../../utils/formatters/date";
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "../../utils/constants/transactionTypes";

export function TransactionForm({
                                    transaction = null,
                                    onSubmit,
                                    onCancel,
                                    isOpen = false
                                }) {
    const { accounts } = useAccounts();
    const { categories } = useCategories();

    const [formData, setFormData] = useState({
        account_id: '',
        description: '',
        amount: '',
        transaction_date: formatDateForInput(new Date()),
        transaction_type: TRANSACTION_TYPES.EXPENSE,
        category_id: '',
        memo: '',
        transfer_account_id: '',
        is_repeating: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addAnother, setAddAnother] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                account_id: transaction.account_id || '',
                description: transaction.description || '',
                amount: transaction.amount?.toString() || '',
                transaction_date: formatDateForInput(transaction.transaction_date) || formatDateForInput(new Date()),
                transaction_type: transaction.transaction_type || TRANSACTION_TYPES.EXPENSE,
                category_id: transaction.category_id || '',
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
                memo: '',
                transfer_account_id: '',
                is_repeating: false
            });
        }
        setErrors({});
    }, [transaction, accounts, isOpen]);

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
            newErrors.account_id = 'Vui lòng chọn tài khoản';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Vui lòng nhập mô tả giao dịch';
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
        }
        if (!formData.transaction_date) {
            newErrors.transaction_date = 'Vui lòng chọn ngày giao dịch';
        }
        if (formData.transaction_type === TRANSACTION_TYPES.TRANSFER && !formData.transfer_account_id) {
            newErrors.transfer_account_id = 'Vui lòng chọn tài khoản đích';
        }
        if (formData.transaction_type === TRANSACTION_TYPES.TRANSFER && formData.transfer_account_id === formData.account_id) {
            newErrors.transfer_account_id = 'Tài khoản đích phải khác tài khoản nguồn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e, shouldAddAnother = false) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setAddAnother(shouldAddAnother);

        try {
            const submitData = {
                ...formData,
                amount: parseFloat(formData.amount),
                description: formData.description.trim(),
                memo: formData.memo.trim() || null
            };

            await onSubmit(submitData);

            if (shouldAddAnother && !transaction) {
                setFormData(prev => ({
                    ...prev,
                    description: '',
                    amount: '',
                    memo: '',
                    category_id: ''
                }));
                setErrors({});
            }
        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setIsSubmitting(false);
            setAddAnother(false);
        }
    };

    const filteredCategories = categories.filter(category => {
        if (formData.transaction_type === TRANSACTION_TYPES.TRANSFER) return false;
        return category.type === formData.transaction_type;
    });

    const filteredTransferAccounts = accounts.filter(account =>
        account.account_id !== formData.account_id
    );

    const getTransactionIcon = (type) => {
        switch (type) {
            case TRANSACTION_TYPES.INCOME:
                return (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
            case TRANSACTION_TYPES.EXPENSE:
                return (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                );
            case TRANSACTION_TYPES.TRANSFER:
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {transaction ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tài khoản <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="account_id"
                                value={formData.account_id}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.account_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ngày giao dịch <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="transaction_date"
                                value={formData.transaction_date}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.transaction_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.transaction_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Loại giao dịch <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {Object.values(TRANSACTION_TYPES).map(type => (
                                <label
                                    key={type}
                                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                        formData.transaction_type === type
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="transaction_type"
                                        value={type}
                                        checked={formData.transaction_type === type}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center space-x-2">
                                        {getTransactionIcon(type)}
                                        <span className="font-medium text-gray-700">
                                            {TRANSACTION_TYPE_LABELS[type]}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Nhập mô tả giao dịch..."
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số tiền <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    VNĐ
                                </span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full pl-16 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    step="1000"
                                    min="0"
                                    required
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                            )}
                        </div>

                        {formData.transaction_type !== TRANSACTION_TYPES.TRANSFER && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Danh mục
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {filteredCategories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formData.transaction_type === TRANSACTION_TYPES.TRANSFER && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tài khoản đích <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="transfer_account_id"
                                    value={formData.transfer_account_id}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.transfer_account_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Chọn tài khoản đích</option>
                                    {filteredTransferAccounts.map(account => (
                                        <option key={account.account_id} value={account.account_id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.transfer_account_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.transfer_account_id}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            name="memo"
                            value={formData.memo}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                            placeholder="Thêm ghi chú cho giao dịch này..."
                        />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            name="is_repeating"
                            checked={formData.is_repeating}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Đặt làm giao dịch lặp lại
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Hủy bỏ
                        </button>

                        <div className="flex flex-1 gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting && !addAnother ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang lưu...</span>
                                    </div>
                                ) : (
                                    transaction ? 'Cập nhật' : 'Thêm giao dịch'
                                )}
                            </button>

                            {!transaction && (
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting && addAnother ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang lưu...</span>
                                        </div>
                                    ) : (
                                        'Thêm & Tiếp tục'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}