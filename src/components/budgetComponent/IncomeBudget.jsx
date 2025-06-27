import { useEffect, useState } from "react";
import { HiCurrencyDollar } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IncomeModal from "./IncomeModal";
import EditChildIncomeModal from "./EditChildIncomeModal";
import { budgetService } from "../../services/budgetService";

const IncomeBudget = ({ getBudgets, totalIncome, data, CATEGORY_STYLES }) => {
  const [expanded, setExpanded] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditChildOpen, setIsEditChildOpen] = useState(false);
  const [addGroupData, setAddGroupData] = useState(null);
  const [editChildData, setEditChildData] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");

  const queryClient = useQueryClient();

  const deleteBudgetMutation = useMutation({
    mutationFn: (budget_id) => {
      budgetService.deleteBudget(budget_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      getBudgets();
    },
    onError: (err) => alert("Lỗi xoá ngân sách: " + err.message),
  });

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

  const toggleDescription = (budgetId) => {
    setExpanded((prev) => ({
      ...prev,
      [budgetId]: !prev[budgetId],
    }));
  };

  const handleOpenAdd = (groupData) => {
    setAddGroupData(groupData);
    setIsAddOpen(true);
  };

  const handleEditChild = (item, groupName) => {
    setEditChildData({ ...item, groupName });
    setIsEditChildOpen(true);
  };

  const handleDelete = (budgetId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá mục thu nhập này?")) {
      deleteBudgetMutation.mutate(budgetId);
    }
  };

  const handleDeleteGroup = async (groupName) => {
    const group = groupedIncome[groupName];
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xoá nhóm này và tất cả các mục con?"
      )
    ) {
      try {
        for (const item of group.items) {
          await deleteBudgetMutation.mutateAsync(item.budget_id);
        }
        await deleteCategoryMutation.mutateAsync(group.category_id);
      } catch (err) {
        console.error("Xoá nhóm thất bại", err);
      }
    }
  };

  const groupedIncome = data
    .filter((item) => item.type === "income")
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

  const categoryNames = Object.keys(groupedIncome);

  useEffect(() => {
    console.log("Grouped income data:", groupedIncome);
  }, [groupedIncome]);

  return (
    <div className='bg-white shadow rounded-lg p-6 space-y-4'>
      <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
        <HiCurrencyDollar className='text-green-600' />
        Thu nhập - Tổng:{" "}
        <span className='text-green-600'>
          {totalIncome.toLocaleString()} VNĐ
        </span>
      </h3>

      {categoryNames.map((groupName, i) => {
        const group = groupedIncome[groupName];
        const total = group.items.reduce((sum, item) => sum + item.amount, 0);
        const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];

        return (
          <div key={groupName} className='space-y-1'>
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
                <HiCurrencyDollar className={style.text} />
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
                        handleOpenAdd({
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
                        +{item.amount.toLocaleString()} VNĐ
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

      <IncomeModal
        getBudgets={getBudgets}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        type='add'
        defaultData={addGroupData}
      />

      <EditChildIncomeModal
        isOpen={isEditChildOpen}
        getBudgets={getBudgets}
        onClose={() => setIsEditChildOpen(false)}
        defaultData={editChildData}
      />
    </div>
  );
};

export default IncomeBudget;
