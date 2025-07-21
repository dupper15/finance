import { useEffect, useMemo, useState } from "react";
import { HiReceiptTax } from "react-icons/hi";
import ExpenseModal from "../forms/ExpenseModal";
import EditChildExpenseModal from "./EditChildExpenseModal";
import { budgetService } from "../../services/budgetService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const OutcomeBudget = ({
  selectedAccount,
  data,
  getBudgets,
  totalExpense,
  CATEGORY_STYLES,
}) => {
  const [expanded, setExpanded] = useState({});
  const [type, setType] = useState("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [isEditChildOpen, setIsEditChildOpen] = useState(false);
  const [editChildData, setEditChildData] = useState(null);
  const queryClient = useQueryClient();

  const toggleDescription = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteBudgetMutation = useMutation({
    mutationFn: (budget_id) => budgetService.deleteBudget(budget_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      getBudgets();
    },
    onError: (err) => alert("Lỗi xoá ngân sách: " + err.message),
  });

  const handleEditChild = (item, groupName) => {
    setEditChildData({ ...item, groupName });
    setIsEditChildOpen(true);
  };

  const editCategoryMutation = useMutation({
    mutationFn: ({ category_id, data }) =>
      budgetService.editCategory(category_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditingGroup(null);
      getBudgets();
    },
    onError: (err) => alert("Lỗi cập nhật danh mục: " + err.message),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (category_id) => budgetService.deleteCategory(category_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      getBudgets();
    },
    onError: (err) => alert("Lỗi xoá danh mục: " + err.message),
  });

  const handleDelete = (budgetId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá mục chi tiêu này?")) {
      deleteBudgetMutation.mutate(budgetId);
    }
  };

  const handleDeleteGroup = async (groupName) => {
    const group = groupedExpenses[groupName];
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xoá nhóm này và tất cả các mục con?"
      )
    ) {
      try {
        const deleteResults = await Promise.allSettled(
          group.items.map((item) =>
            deleteBudgetMutation.mutateAsync(item.budget_id)
          )
        );

        const hasErrors = deleteResults.some(
          (result) => result.status === "rejected"
        );

        if (!hasErrors) {
          await deleteCategoryMutation.mutateAsync(group.category_id);
        } else {
          alert("Một số mục không thể xoá. Vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Xoá nhóm thất bại", err);
        alert("Có lỗi xảy ra khi xoá nhóm.");
      }
    }
  };

  const handleOpen = (type, data = null) => {
    setType(type);
    setEditData(data);
    setIsModalOpen(true);
  };

  const groupedExpenses = useMemo(() => {
    return data
      .filter((item) => item.type === "expense")
      .reduce((acc, category) => {
        const groupName = category.name;
        if (!acc[groupName]) {
          acc[groupName] = {
            category_id: category.category_id,
            items: [],
          };
        }

        const enrichedBudgets = category.budgets.map((budget) => ({
          ...budget,
          categoryName: category.name,
          category_id: category.category_id,
        }));

        acc[groupName].items.push(...enrichedBudgets);
        return acc;
      }, {});
  }, [data]);

  const categoryNames = Object.keys(groupedExpenses);

  useEffect(() => {
    console.log("Grouped outcome data:", groupedExpenses);
  }, [groupedExpenses]);

  return (
    <div className='bg-white shadow rounded-lg p-6 space-y-4'>
      <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
        <HiReceiptTax className='text-red-500' />
        Chi tiêu - Tổng:{" "}
        <span className='text-red-500'>
          {totalExpense.toLocaleString()} VNĐ
        </span>
      </h3>

      {categoryNames.map((groupName, i) => {
        const group = groupedExpenses[groupName];
        const total = group.items.reduce((sum, item) => sum + item.amount, 0);
        const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];

        return (
          <div key={groupName} className='space-y-1'>
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
                <HiReceiptTax className={style.text} />
                {editingGroup === groupName ? (
                  <input
                    type='text'
                    value={editedGroupName}
                    onChange={(e) => setEditedGroupName(e.target.value)}
                    className='border px-2 py-1 rounded text-sm'
                  />
                ) : (
                  <>{groupName}</>
                )}
                - Tổng:{" "}
                <span className={style.text}>{total.toLocaleString()} VNĐ</span>
              </h3>

              <div className='flex gap-2 text-xs'>
                {editingGroup === groupName ? (
                  <>
                    <button
                      className='text-green-600 hover:underline'
                      onClick={() => {
                        if (editedGroupName.trim()) {
                          editCategoryMutation.mutate({
                            category_id: group.category_id,
                            data: { name: editedGroupName },
                          });
                        }
                      }}>
                      Lưu
                    </button>
                    <button
                      className='text-gray-500 hover:underline'
                      onClick={() => setEditingGroup(null)}>
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='text-green-600 hover:underline'
                      onClick={() =>
                        handleOpen("add", {
                          groupName,
                          category_id: group.category_id,
                        })
                      }>
                      Thêm
                    </button>
                    <button
                      className='text-blue-600 hover:underline'
                      onClick={() => {
                        setEditingGroup(groupName);
                        setEditedGroupName(groupName);
                      }}>
                      Sửa
                    </button>
                    <button
                      className='text-red-600 hover:underline'
                      onClick={() => handleDeleteGroup(groupName)}>
                      Xoá
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className='mt-2 space-y-2 text-sm'>
              {group.items.map((item) => (
                <div
                  key={item.budget_id}
                  className={`flex flex-col gap-1 cursor-pointer 
                    ${style.bg} ${style.border} ${style.hover} 
                    py-2 px-3 rounded-md border transition`}
                  onClick={() => toggleDescription(item.budget_id)}>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700 font-medium'>
                      {item.name}
                    </span>
                    <span className='flex gap-3 items-center'>
                      <span className={`${style.text} font-semibold`}>
                        -{item.amount.toLocaleString()} VNĐ
                      </span>
                      <button
                        className='text-blue-500 hover:underline text-xs'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditChild(item, groupName);
                        }}>
                        Sửa
                      </button>
                      <button
                        className='text-red-500 hover:underline text-xs'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.budget_id);
                        }}>
                        Xoá
                      </button>
                    </span>
                  </div>

                  {expanded[item.budget_id] && item.description && (
                    <p className='text-gray-500 text-xs pl-1 mt-1'>
                      Mô tả: {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {isModalOpen && (
        <ExpenseModal
          selectedAccount={selectedAccount}
          getBudgets={getBudgets}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={type}
          defaultData={editData}
        />
      )}

      <EditChildExpenseModal
        isOpen={isEditChildOpen}
        getBudgets={getBudgets}
        onClose={() => setIsEditChildOpen(false)}
        defaultData={editChildData}
      />
    </div>
  );
};

export default OutcomeBudget;
