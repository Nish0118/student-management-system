
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Student = {
  _id?: string;
  name: string;
  rollNo: string;
  email: string;
  className: string;
};

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // auth token clear
    router.push("/login");            // login page pe redirect
};

  const [form, setForm] = useState<Student>({
    name: "",
    rollNo: "",
    email: "",
    className: "",
  });

  
  const [editId, setEditId] = useState<string | null>(null);
  // const [showForm, setShowForm] = useState(false);


  /* ================= FETCH ================= */
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= ADD / EDIT ================= */
 

  const handleSubmit = async () => {
  try {
    const url = editId
      ? `/api/students/${editId}`
      : "/api/students";

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
    setShowModal(false); // ✅ correct
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


  // ================= EDIT =================
  const handleEdit = (student: Student) => {
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      className: student.className,
    });
    setEditId(student._id!);
    // setShowForm(true);
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
    // <div className="min-h-screen bg-gray-100">
    <div className="min-h-screen bg-gradient-to-br from-gray-60 via-indigo-70 to-blue-50">

      {/* HEADER */}

      <div className="flex justify-between items-center 
          bg-blue-600 text-white px-6 py-4 shadow-md">
            <h1 className="text-xl font-bold">
              Student Management System
            </h1>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 
              px-4 py-2 rounded text-white transition"
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
            className="bg-indigo-500 text-white px-4 py-2 rounded"
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
              <th className="px-4 py-3 text-left">RollNo</th>
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
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="text-blue-600"
                     onClick={() => {
                        setEditId(s._id!);
                        setForm({
                          name: s.name,
                          rollNo: s.rollNo,
                          email: s.email,
                          className: s.className,
                        });
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Student" : "Add Student"}
            </h2>

            <input
              placeholder="Name"
              className="border w-full mb-2 px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Roll No"
              className="border w-full mb-2 px-3 py-2"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            />
            <input
              placeholder="Email"
              className="border w-full mb-2 px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Class"
              className="border w-full mb-4 px-3 py-2"
              value={form.className}
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
            />

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