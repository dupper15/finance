import React, { useState } from 'react';
import {useAccounts} from "../../hooks/useAccounts";
import {useCategories} from "../../hooks/useCategories";
import {useTags} from "../../hooks/useTags";
import {TRANSACTION_TYPE_LABELS, TRANSACTION_TYPES} from "../../utils/constants/transactionTypes";
export function TransactionFilter({
                                      filters,
                                      onFiltersChange,
                                      onApply,
                                      onClear,
                                      isOpen,
                                      onToggle
                                  }) {
    const { accounts } = useAccounts();
    const { categories } = useCategories();
    const { tags } = useTags();

    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (name, value) => {
        const newFilters = { ...localFilters, [name]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleApply = () => {
        onApply(localFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            account_id: '',
            category_id: '',
            tag_id: '',
            transaction_type: '',
            start_date: '',
            end_date: '',
            search: '',
            page: 1,
            limit: 50
        };
        setLocalFilters(clearedFilters);
        onClear(clearedFilters);
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onToggle}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            <svg
                                className={`w-5 h-5 mr-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Bộ lọc
                        </button>

                        {Object.values(localFilters).some(value => value && value !== '' && value !== 1 && value !== 50) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Đã áp dụng bộ lọc
              </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleClear}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Xóa bộ lọc
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tài khoản
                            </label>
                            <select
                                value={localFilters.account_id}
                                onChange={(e) => handleFilterChange('account_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả tài khoản</option>
                                {accounts.map(account => (
                                    <option key={account.account_id} value={account.account_id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <select
                                value={localFilters.category_id}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tag
                            </label>
                            <select
                                value={localFilters.tag_id}
                                onChange={(e) => handleFilterChange('tag_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả tag</option>
                                {tags.map(tag => (
                                    <option key={tag.tag_id} value={tag.tag_id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại giao dịch
                            </label>
                            <select
                                value={localFilters.transaction_type}
                                onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả loại</option>
                                {Object.values(TRANSACTION_TYPES).map(type => (
                                    <option key={type} value={type}>
                                        {TRANSACTION_TYPE_LABELS[type]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={localFilters.start_date}
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={localFilters.end_date}
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localFilters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Tìm kiếm theo mô tả giao dịch..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                            Hiển thị {localFilters.limit} kết quả mỗi trang
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Xóa tất cả
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}