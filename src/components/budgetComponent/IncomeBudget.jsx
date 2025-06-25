import { useState } from "react";
import { HiCurrencyDollar } from "react-icons/hi";

const IncomeBudget = ({ totalIncome, data, CATEGORY_STYLES }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDescription = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className='bg-white shadow rounded-lg p-6 space-y-4'>
      <h3 className='font-semibold text-md text-gray-800 flex items-center gap-2'>
        <HiCurrencyDollar className='text-green-600' />
        Thu nhập - Tổng:{" "}
        <span className='text-green-600'>
          {totalIncome.toLocaleString()} VNĐ
        </span>
      </h3>

      <div className='mt-2 space-y-2 text-sm'>
        {data.income.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 cursor-pointer 
              ${CATEGORY_STYLES.income.bg} 
              ${CATEGORY_STYLES.income.border} 
              ${CATEGORY_STYLES.income.hover} 
              py-2 px-3 rounded-md border transition`}
            onClick={() => toggleDescription(index)}>
            <div className='flex justify-between items-center'>
              <span className='text-gray-700 font-medium'>{item.name}</span>
              <span className='flex gap-3 items-center'>
                <span
                  className={`${CATEGORY_STYLES.income.text} font-semibold`}>
                  +{item.amount.toLocaleString()} VNĐ
                </span>
                <button
                  className='text-blue-500 hover:underline text-xs'
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Sửa thu nhập dòng ${index}`);
                  }}>
                  Sửa
                </button>
                <button
                  className='text-red-500 hover:underline text-xs'
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Xoá thu nhập dòng ${index}`);
                  }}>
                  Xoá
                </button>
              </span>
            </div>

            {expandedIndex === index && item.description && (
              <p className='text-gray-500 text-xs pl-1 mt-1'>
                Mô tả: {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeBudget;
