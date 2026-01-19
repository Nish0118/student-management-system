"use client";

import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-green-600 text-white px-6 py-4">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-semibold">Welcome Student 👋</h2>
        <p className="mt-2 text-gray-600">
          Student Information 
        </p>
      </div>
    </div>
  );
}
