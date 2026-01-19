"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Student = {
  _id?: string;
  name: string;
  rollNo: string;
  email: string;
  className: string;
};

/* ================= COMPONENT ================= */
export default function AdminDashboard() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<Student>({
    name: "",
    rollNo: "",
    email: "",
    className: "",
  });

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async () => {
    try {
      const url = editId ? `/api/students/${editId}` : "/api/students";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Save failed");

      setForm({
        name: "",
        rollNo: "",
        email: "",
        className: "",
      });

      setEditId(null);
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      fetchStudents();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* ================= FILTER + SORT ================= */
  const filtered = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-200">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between items-center px-6 py-4">
        <input
          className="border px-3 py-2 rounded w-72"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Sort: {sortAsc ? "A → Z" : "Z → A"}
          </button>

          <button
            onClick={() => {
              setEditId(null);
              setForm({
                name: "",
                rollNo: "",
                email: "",
                className: "",
              });
              setShowModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="px-6">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.rollNo}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.className}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        setEditId(s._id!);
                        setForm(s);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(s._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0  bg-transparent-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Student" : "Add Student"}
            </h2>

            {["name", "rollNo", "email", "className"].map((field) => (
              <input
                key={field}
                placeholder={field}
                className="border w-full mb-2 px-3 py-2"
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
