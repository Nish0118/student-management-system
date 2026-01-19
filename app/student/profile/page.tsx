"use client";
import { useEffect, useState } from "react";

export default function StudentProfile() {
  const [form, setForm] = useState<any>({
    name: "",
    rollNo: "",
    className: "",
  });

  useEffect(() => {
    fetch("/api/student/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setForm(data));
  }, []);

  const updateProfile = async () => {
    await fetch("/api/student/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    alert("Profile updated");
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="border p-2 mb-2 w-full"
        placeholder="Name"
      />

      <input
        value={form.rollNo}
        onChange={e => setForm({ ...form, rollNo: e.target.value })}
        className="border p-2 mb-2 w-full"
        placeholder="Roll No"
      />

      <input
        value={form.className}
        onChange={e => setForm({ ...form, className: e.target.value })}
        className="border p-2 mb-2 w-full"
        placeholder="Class"
      />

      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}
