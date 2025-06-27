import { useState, useEffect } from "react";
import { budgetService } from "../../services/budgetService";
import { useMutation } from "@tanstack/react-query";

const EditChildIncomeModal = ({ isOpen, onClose, defaultData, getBudgets }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [groupName, setGroupName] = useState("");
  const [duration, setDuration] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (defaultData) {
      setName(defaultData.name || "");
      setAmount(defaultData.amount || "");
      setGroupName(defaultData.groupName || "");
      setDuration(defaultData.duration || "monthly");
      setStartDate(
        defaultData.start_date || new Date().toISOString().split("T")[0]
      );
      setEndDate(
        defaultData.end_date || new Date().toISOString().split("T")[0]
      );
    }
  }, [defaultData]);

  const editBudgetMutation = useMutation({
    mutationFn: (data) => budgetService.editBudget(data),
    onSuccess: () => {
      getBudgets();
      onClose();
    },
    onError: (error) => {
      alert("Lỗi khi cập nhật ngân sách: " + error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !duration || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const updatedItem = {
      ...defaultData,
      name,
      amount: parseFloat(amount),
      duration,
      start_date: startDate,
      end_date: endDate,
    };

    editBudgetMutation.mutate(updatedItem);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
        <h2 className='text-lg font-semibold mb-4'>Sửa mục thu nhập</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Nhóm thu nhập
            </label>
            <input
              type='text'
              className='w-full mt-1 border rounded px-3 py-2 text-sm bg-gray-100'
              value={groupName}
              disabled
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Tên mục thu nhập
            </label>
            <input
              type='text'
              className='w-full mt-1 border rounded px-3 py-2 text-sm'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Số tiền (VNĐ)
            </label>
            <input
              type='number'
              className='w-full mt-1 border rounded px-3 py-2 text-sm'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={0}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Thời gian
            </label>
            <select
              className='w-full mt-1 border rounded px-3 py-2 text-sm'
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required>
              <option value='monthly'>Hàng tháng</option>
              <option value='yearly'>Hàng năm</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Ngày bắt đầu
            </label>
            <input
              type='date'
              className='w-full mt-1 border rounded px-3 py-2 text-sm'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Ngày kết thúc
            </label>
            <input
              type='date'
              className='w-full mt-1 border rounded px-3 py-2 text-sm'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300'>
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'>
              Lưu thay đổi
            </button>
          </div>
        </form>

        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-black text-xl'
          onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default EditChildIncomeModal;
