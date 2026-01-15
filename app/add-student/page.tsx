"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
    className: "",
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    await fetch("/api/students/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Add Student</h2>

        {["name", "rollNo", "email", "className"].map((field) => (
          <input
            key={field}
            className="w-full border p-2 mb-3"
            placeholder={field}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
