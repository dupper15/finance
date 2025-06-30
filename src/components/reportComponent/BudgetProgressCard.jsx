const BudgetProgressCard = ({ item }) => {
  const { totalSpent, totalBudget, type, status, name } = item;
  const percent = Math.round((totalSpent / totalBudget) * 100);
  const isIncome = type === "income";
  const isAchieved = isIncome && totalSpent >= totalBudget;
  console.log("BudgetProgressCard item:", item);
  return (
    <div className='p-4 bg-white rounded-lg shadow space-y-3 border-l-4 border-blue-500 relative'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-gray-800'>
          {name}{" "}
          {isIncome && (
            <span className='text-xs text-green-600'>(Thu nhập)</span>
          )}
          {!isIncome && (
            <span className='text-xs text-red-600'>(Chi tiêu)</span>
          )}
        </h3>

        {status && !isIncome && (
          <span
            className={`text-sm font-semibold flex items-center gap-1 ${status.color}`}>
            {status.icon} {status.label}
          </span>
        )}
      </div>

      <div className='text-sm text-gray-600'>
        Mục tiêu: {totalBudget.toLocaleString()} VNĐ
      </div>
      <div className='text-sm text-gray-600'>
        {isIncome ? "Đã đạt" : "Đã chi"}: {totalSpent.toLocaleString()} VNĐ
      </div>

      <div>
        <div className='w-full bg-gray-200 rounded-full h-3 relative overflow-hidden'>
          <div
            className={`h-full rounded-full ${
              isIncome
                ? percent >= 100
                  ? "bg-green-500"
                  : "bg-yellow-500"
                : percent < 90
                ? "bg-green-500"
                : percent <= 100
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}></div>

          {!isIncome && percent > 100 && (
            <div
              className='absolute top-0 right-0 h-full bg-red-700 rounded-full'
              style={{ width: `${percent - 100}%`, minWidth: "4px" }}
              title={`Vượt ngân sách ${percent - 100}%`}></div>
          )}
        </div>

        <div className='text-xs text-right text-gray-500 mt-1'>{percent}%</div>
      </div>

      {isAchieved && (
        <div className='absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full shadow animate-bounce'>
          🎉 Đạt mục tiêu!
        </div>
      )}
    </div>
  );
};

export default BudgetProgressCard;
