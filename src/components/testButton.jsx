import { useMutation } from '@tanstack/react-query';
import { loginUser } from "../api/userApi";

export default function LoginButton() {
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      alert('Đăng nhập thành công:\n' + JSON.stringify(data));
    },
    onError: (error) => {
      alert('Lỗi đăng nhập:\n' + (error.message || 'Đã xảy ra lỗi'));
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
    >
      {mutation.isPending ? 'Đang gửi...' : 'Gọi API Đăng nhập'}
    </button>
  );
}
