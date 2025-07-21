import { useState } from "react";
import { FaListAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { budgetService } from "../../services/budgetService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddBudgetForm = ({ getBudgets, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
  });

  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation({
    mutationFn: (data) => budgetService.addCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["categories"]);
      console.log("Category created:", response.data);
      getBudgets?.(); // optional nếu vẫn muốn chạy hàm cũ
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error creating category:", error.message);
      alert("Thêm danh mục thất bại");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const categoryPayload = {
      name: formData.name,
      type: formData.type,
      user_id: "4b2e8393-8d39-4761-bbb0-c3e974c2a359",
    };

    addCategoryMutation.mutate(categoryPayload);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      type: "expense",
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-xl p-6'>
        <h2 className='text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2'>
          Tạo loại ngân sách mới
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaListAlt /> Tên loại ngân sách
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2'
              placeholder='Ví dụ: Ăn uống, Giải trí...'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaCheckCircle /> Loại
            </label>
            <select
              name='type'
              value={formData.type}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2'>
              <option value='expense'>Chi tiêu</option>
              <option value='income'>Thu nhập</option>
            </select>
          </div>
        </div>

        <div className='flex justify-end gap-3 mt-8'>
          <button
            onClick={handleCancel}
            className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium'>
            <FaTimesCircle /> Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={addCategoryMutation.isLoading}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium'>
            <FaCheckCircle />{" "}
            {addCategoryMutation.isLoading ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetForm;
