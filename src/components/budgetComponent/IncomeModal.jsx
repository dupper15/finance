import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../../services/budgetService";

const IncomeModal = ({ isOpen, onClose, type, defaultData, getBudgets }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryClient = useQueryClient();
  const addBudgetMutation = useMutation({
    mutationFn: (data) => budgetService.addBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "budgets"]);
      getBudgets();
      onClose();
    },
    onError: (error) => {
      alert("Lỗi khi thêm ngân sách: " + error.message);
    },
  });

  useEffect(() => {
    if (type === "edit" && defaultData) {
      setName(defaultData.name || "");
      setAmount(defaultData.amount || "");
      setDuration(defaultData.duration || "monthly");
      setStartDate(defaultData.start_date || "");
      setEndDate(defaultData.end_date || "");
    } else {
      setName("");
      setAmount("");
      setDuration("monthly");
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(today);
    }
  }, [type, defaultData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !duration || !startDate || !endDate) return;

    const commonData = {
      name,
      amount: parseFloat(amount),
    };

    if (type === "add") {
      const newBudgetData = {
        ...commonData,
        user_id: "5294e4fd-24bf-49c0-b58b-d2256d8286ee",
        description: "Thu nhập mới",
        duration,
        start_date: startDate,
        end_date: endDate,
        account_id: "2b0a5bf0-2145-4764-bc67-21d4167983af",
        category_id: defaultData?.category_id || null,
      };

      addBudgetMutation.mutate(newBudgetData);
    } else {
      console.log("Submitted income:", {
        ...commonData,
        duration,
        start_date: startDate,
        end_date: endDate,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
        <h2 className='text-lg font-semibold mb-4'>
          {type === "edit"
            ? `Sửa thông tin nhóm: ${defaultData?.groupName || ""}`
            : `Thêm mục thu nhập nhóm: ${defaultData?.groupName || ""}`}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Tên
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
              Số tiền
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
              {type === "edit" ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>

        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-black'
          onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default IncomeModal;
