const BudgetProgressCard = ({ item }) => {
  const percent = Math.round((item.totalSpent / item.totalBudget) * 100);
  const status = item.status;

  return (
    <div className='p-4 bg-white rounded-lg shadow space-y-3'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-gray-800'>{item.name}</h3>
        {status && (
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${status.color}`}>
            {status.icon} {status.label}
          </span>
        )}
      </div>

      <div className='text-sm text-gray-600'>
        Ngân sách: {item.totalBudget.toLocaleString()} VNĐ
      </div>
      <div className='text-sm text-gray-600'>
        Đã chi: {item.totalSpent.toLocaleString()} VNĐ
      </div>

      <div>
        <div className='w-full bg-gray-200 rounded-full h-3 relative overflow-hidden'>
          <div
            className={`h-full rounded-full ${
              percent < 90
                ? "bg-green-500"
                : percent <= 100
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}></div>

          {percent > 100 && (
            <div
              className='absolute top-0 right-0 h-full bg-red-700 rounded-full'
              style={{ width: `${percent - 100}%`, minWidth: "4px" }}
              title={`Vượt ngân sách ${percent - 100}%`}></div>
          )}
        </div>

        <div className='text-xs text-right text-gray-500 mt-1'>{percent}%</div>
      </div>
    </div>
  );
};

export default BudgetProgressCard;
