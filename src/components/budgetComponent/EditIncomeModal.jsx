import { useState, useEffect } from "react";

const EditIncomeModal = ({ isOpen, onClose, defaultData, onSubmit }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (defaultData) {
      setName(defaultData.name || "");
      setAmount(defaultData.amount || "");
    } else {
      setName("");
      setAmount("");
    }
  }, [defaultData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const updatedIncome = {
      ...defaultData,
      name,
      amount: parseFloat(amount),
    };

    if (onSubmit) onSubmit(updatedIncome); // Gửi về component cha
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
        <h2 className='text-lg font-semibold mb-4'>Sửa mục thu nhập</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Tên thu nhập
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

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300'>
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700'>
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

export default EditIncomeModal;
