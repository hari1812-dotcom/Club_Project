import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") || "";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.users(role || undefined).then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, [role]);

  const toggleActive = async (id, isActive) => {
    try {
      await adminApi.updateUser(id, isActive);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive } : u)));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${!role ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          All
        </button>
        <button
          onClick={() => setSearchParams({ role: "student" })}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${role === "student" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          Student
        </button>
        <button
          onClick={() => setSearchParams({ role: "faculty" })}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${role === "faculty" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          Faculty
        </button>
        <button
          onClick={() => setSearchParams({ role: "admin" })}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${role === "admin" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          Admin
        </button>
      </div>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Reward pts</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.rewardPoints ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${u.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {u.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(u._id, !u.isActive)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {u.isActive !== false ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-6 text-slate-500 text-center">No users found.</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
