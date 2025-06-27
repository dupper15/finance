import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney, GiMoneyStack } from "react-icons/gi";

const Summary = () => {
  const income = {
    thisMonth: 5000000,
    lastMonth: 4500000,
  };

  const expenses = {
    thisMonth: 3000000,
    lastMonth: 2500000,
  };

  const savings = {
    thisMonth: income.thisMonth - expenses.thisMonth,
    lastMonth: income.lastMonth - expenses.lastMonth,
  };

  const formatVND = (number) =>
    number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const SummaryCard = ({ title, current, previous, icon, color }) => {
    const diff = current - previous;
    const isChiTieu = title === "Chi tiêu";

    // Xác định màu và biểu tượng dựa trên loại dữ liệu
    const isIncrease = diff > 0;
    const isEqual = diff === 0;

    let iconElement = null;
    let colorClass = "text-gray-500";

    if (!isEqual) {
      if (isChiTieu) {
        // Chi tiêu tăng là xấu (đỏ + mũi tên lên), giảm là tốt (xanh + mũi tên xuống)
        iconElement = isIncrease ? <FaArrowUp /> : <FaArrowDown />;
        colorClass = isIncrease ? "text-red-600" : "text-green-600";
      } else {
        // Các mục khác: tăng là tốt (xanh + mũi tên lên), giảm là xấu (đỏ + mũi tên xuống)
        iconElement = isIncrease ? <FaArrowUp /> : <FaArrowDown />;
        colorClass = isIncrease ? "text-green-600" : "text-red-600";
      }
    }

    return (
      <div
        className={`bg-white shadow rounded-lg p-5 w-full md:w-1/3 space-y-2 border-t-4 ${color.border}`}>
        <div className='flex items-center space-x-2'>
          <div className={`text-2xl ${color.text}`}>{icon}</div>
          <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
        </div>

        <div className='text-xl font-bold text-gray-900'>
          {formatVND(current)}
        </div>

        <div className='text-sm text-gray-600'>
          Tháng trước: {formatVND(previous)}
        </div>

        {!isEqual && (
          <div
            className={`text-sm font-medium flex items-center space-x-1 ${colorClass}`}>
            {iconElement}
            <span>{formatVND(Math.abs(diff))}</span>
          </div>
        )}

        {isEqual && (
          <div className='text-sm text-gray-500 italic'>Không thay đổi</div>
        )}
      </div>
    );
  };

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <SummaryCard
        title='Thu nhập'
        current={income.thisMonth}
        previous={income.lastMonth}
        icon={<GiReceiveMoney />}
        color={{ text: "text-green-600", border: "border-green-500" }}
      />
      <SummaryCard
        title='Chi tiêu'
        current={expenses.thisMonth}
        previous={expenses.lastMonth}
        icon={<GiPayMoney />}
        color={{ text: "text-red-600", border: "border-red-500" }}
      />
      <SummaryCard
        title='Tiết kiệm'
        current={savings.thisMonth}
        previous={savings.lastMonth}
        icon={<GiMoneyStack />}
        color={{ text: "text-yellow-600", border: "border-yellow-500" }}
      />
    </div>
  );
};

export default Summary;
