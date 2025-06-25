import { useState } from "react";
import { HiReceiptTax } from "react-icons/hi";

const OutcomeBudget = ({ BUDGET_CATEGORIES, CATEGORY_STYLES, data }) => {
  const [expanded, setExpanded] = useState({});

  const toggleDescription = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEdit = (categoryId, index) => {
    alert(`Chỉnh sửa mục trong ${categoryId}, index ${index}`);
  };

  const handleDelete = (categoryId, index) => {
    alert(`Xoá mục trong ${categoryId}, index ${index}`);
  };

  return (
    <div className='bg-white shadow rounded-lg p-6 space-y-4'>
      {BUDGET_CATEGORIES.map((category) => {
        const total =
          data.expenses[category.id]?.reduce((sum, i) => sum + i.amount, 0) ||
          0;
        const style = CATEGORY_STYLES[category.id] || {};

        return (
          <div key={category.id}>
            <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
              <HiReceiptTax className={style.text} />
              {category.name} - Tổng:{" "}
              <span className={style.text}>{total.toLocaleString()} VNĐ</span>
            </h3>

            <div className='mt-2 space-y-2 text-sm'>
              {(data.expenses[category.id] || []).map((item, index) => {
                const key = `${category.id}-${index}`;
                return (
                  <div
                    key={key}
                    className={`flex flex-col gap-1 cursor-pointer 
                      ${style.bg} ${style.border} ${style.hover} 
                      py-2 px-3 rounded-md border transition`}
                    onClick={() => toggleDescription(category.id, index)}>
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
                            handleEdit(category.id, index);
                          }}>
                          Sửa
                        </button>
                        <button
                          className='text-red-500 hover:underline text-xs'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(category.id, index);
                          }}>
                          Xoá
                        </button>
                      </span>
                    </div>

                    {expanded[key] && item.description && (
                      <p className='text-gray-500 text-xs pl-1 mt-1'>
                        Mô tả: {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutcomeBudget;
