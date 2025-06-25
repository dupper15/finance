import { FaBullseye } from "react-icons/fa";

const SavingGoals = ({ goals }) => {
  return (
    <div className='bg-white shadow rounded-lg p-6 border border-blue-100'>
      <h3 className='font-semibold text-md text-gray-800 mb-4 flex items-center gap-2'>
        <FaBullseye className='text-blue-500' /> Mục tiêu tiết kiệm
      </h3>

      <div className='space-y-5'>
        {goals.map((goal) => {
          const percent = Math.min(
            (goal.currentAmount / goal.targetAmount) * 100,
            100
          );

          return (
            <div key={goal.id} className='space-y-1'>
              <div className='flex justify-between items-center'>
                <span className='font-medium text-gray-800'>{goal.name}</span>
                <span className='text-sm text-gray-600'>
                  {goal.currentAmount.toLocaleString()} /{" "}
                  {goal.targetAmount.toLocaleString()} VNĐ
                </span>
              </div>

              <div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all duration-300'
                  style={{
                    width: `${percent}%`,
                    background: "linear-gradient(to right, #3b82f6, #60a5fa)",
                  }}></div>
              </div>

              {goal.description && (
                <p className='text-xs text-gray-500 italic'>
                  {goal.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingGoals;
