import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useFinance } from '../../context/FinanceContext';
import { CategoryFormModal } from './CategoryFormModal';
import { TRANSACTION_TYPES } from '../../utils/constants/transactionTypes';

export function CategoryManager({
                                    isOpen,
                                    onClose,
                                    transactionType = TRANSACTION_TYPES.EXPENSE,
                                    onCategorySelect = null
                                }) {
    const { categories, loading, refetch } = useCategories();
    const { createCategory, updateCategory, deleteCategory } = useFinance();

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            refetch();
        }
    }, [isOpen, refetch, categories.length]);

    const filteredCategories = categories.filter(category => {
        if (category.type !== transactionType) return false;
        if (searchTerm) {
            return category.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const userCategories = filteredCategories.filter(cat => !cat.is_default);
    const defaultCategories = filteredCategories.filter(cat => cat.is_default);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleSaveCategory = async (categoryData) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.category_id, {
                    ...categoryData,
                    type: transactionType
                });
            } else {
                await createCategory({
                    ...categoryData,
                    type: transactionType
                });
            }
            await refetch();
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error saving category:', error);
            throw error;
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            setConfirmDelete(null);
            await refetch();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSelectCategory = (category) => {
        if (onCategorySelect) {
            onCategorySelect(category);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Quản lý danh mục {transactionType === 'expense' ? 'chi tiêu' : 'thu nhập'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Thêm, chỉnh sửa hoặc xóa danh mục để tổ chức giao dịch của bạn
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm danh mục..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleAddCategory}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Thêm danh mục</span>
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto space-y-6">
                            {userCategories.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Danh mục của bạn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {userCategories.map(category => (
                                            <CategoryCard
                                                key={category.category_id}
                                                category={category}
                                                onEdit={handleEditCategory}
                                                onDelete={() => setConfirmDelete(category)}
                                                onSelect={onCategorySelect ? handleSelectCategory : null}
                                                canEdit={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {defaultCategories.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Danh mục mặc định</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {defaultCategories.map(category => (
                                            <CategoryCard
                                                key={category.category_id}
                                                category={category}
                                                onSelect={onCategorySelect ? handleSelectCategory : null}
                                                canEdit={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredCategories.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có danh mục nào</h3>
                                    <p className="text-gray-600 mb-4">
                                        Thêm danh mục đầu tiên để bắt đầu tổ chức giao dịch của bạn
                                    </p>
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Thêm danh mục
                                    </button>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Đang tải danh mục...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CategoryFormModal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                }}
                onSave={handleSaveCategory}
                category={editingCategory}
                transactionType={transactionType}
            />

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16c-.77.833-.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                            Xác nhận xóa danh mục
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            Bạn có chắc chắn muốn xóa danh mục "{confirmDelete.name}"?
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(confirmDelete.category_id)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Xóa danh mục
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function CategoryCard({ category, onEdit, onDelete, onSelect, canEdit = true }) {
    return (
        <div className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all ${
            onSelect ? 'cursor-pointer hover:border-blue-300' : ''
        }`}
             onClick={onSelect ? () => onSelect(category) : undefined}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        {category.is_default && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                Mặc định
                            </span>
                        )}
                    </div>
                </div>

                {canEdit && (
                    <div className="flex space-x-1 ml-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(category);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa danh mục"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(category);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa danh mục"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}