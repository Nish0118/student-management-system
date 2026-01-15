"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow">
      <h1 className="text-xl font-bold">Student Management System</h1>
      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
