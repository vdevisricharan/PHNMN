"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  // You can add orderId logic here if needed
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-lg mb-4 text-center font-medium text-gray-800">
        Order has been created successfully. Your order is being prepared...
      </div>
      <button
        className="px-6 py-3 mt-4 bg-[#bf2132] text-white font-semibold transition-colors duration-200 hover:bg-red-700"
        onClick={() => router.push("/")}
      >
        Go to Homepage
      </button>
    </div>
  );
}