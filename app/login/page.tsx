"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center
      bg-linear-to-br from-blue-50 via-indigo-70 to-purple-70"
    >
      {/* MAIN HEADING */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Student Management System
      </h1>
      <p className="text-gray-500 mb-8">
        Manage students, records and details easily
      </p>

      {/* LOGIN CARD */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-6">
          Student Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700
          text-white py-2 rounded-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
