
import { useNavigate } from "react-router";

function AuthModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Continue karne ke liye login karo</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white py-2 rounded-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border border-blue-600 text-blue-600 py-2 rounded-lg"
          >
            Signup
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AuthModal;