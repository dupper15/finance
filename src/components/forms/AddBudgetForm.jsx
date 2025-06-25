import { useState } from "react";
import {
  FaRegCalendarAlt,
  FaMoneyCheckAlt,
  FaListAlt,
  FaCalendarCheck,
  FaRegCalendarTimes,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AddBudgetForm = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "monthly",
    start_date: "",
    end_date: "",
    account_id: "",
    category_id: "",
    include_subcategories: false,
    include_transfers: false,
    include_deposits: false,
    include_income: false,
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      amount: "",
      duration: "monthly",
      start_date: "",
      end_date: "",
      account_id: "",
      category_id: "",
      include_subcategories: false,
      include_transfers: false,
      include_deposits: false,
      include_income: false,
      is_active: true,
    });
  };
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2'>
          Tạo ngân sách mới
        </h2>

        {/* Thông tin ngân sách */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaListAlt /> Tên ngân sách
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Ví dụ: Giải trí tháng 7'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaMoneyCheckAlt /> Số tiền
            </label>
            <input
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='VD: 1000000'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaRegCalendarAlt /> Thời hạn
            </label>
            <select
              name='duration'
              value={formData.duration}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'>
              <option value='weekly'>Hàng tuần</option>
              <option value='monthly'>Hàng tháng</option>
              <option value='yearly'>Hàng năm</option>
            </select>
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaCalendarCheck /> Ngày bắt đầu
            </label>
            <input
              type='date'
              name='start_date'
              value={formData.start_date}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <FaRegCalendarTimes /> Ngày kết thúc
            </label>
            <input
              type='date'
              name='end_date'
              value={formData.end_date}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              Tài khoản liên kết (ID)
            </label>
            <input
              type='text'
              name='account_id'
              value={formData.account_id}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='VD: acc_001'
            />
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              Danh mục liên quan (ID)
            </label>
            <input
              type='text'
              name='category_id'
              value={formData.category_id}
              onChange={handleChange}
              className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='VD: food_123'
            />
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
          <label className='flex items-center space-x-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              name='include_subcategories'
              checked={formData.include_subcategories}
              onChange={handleChange}
            />
            <span>Danh mục con</span>
          </label>

          <label className='flex items-center space-x-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              name='include_transfers'
              checked={formData.include_transfers}
              onChange={handleChange}
            />
            <span>Chuyển khoản</span>
          </label>

          <label className='flex items-center space-x-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              name='include_deposits'
              checked={formData.include_deposits}
              onChange={handleChange}
            />
            <span>Gửi tiền</span>
          </label>

          <label className='flex items-center space-x-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              name='include_income'
              checked={formData.include_income}
              onChange={handleChange}
            />
            <span>Thu nhập</span>
          </label>
        </div>

        <div className='flex justify-end gap-3 mt-8'>
          <button
            onClick={handleCancel}
            className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition'>
            <FaTimesCircle /> Hủy
          </button>
          <button
            onClick={handleSubmit}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition'>
            <FaCheckCircle /> Tạo ngân sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetForm;
