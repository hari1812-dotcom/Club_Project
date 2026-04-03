import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

const ROLE_BADGE = {
  student: "bg-blue-100 text-blue-600",
  faculty: "bg-purple-100 text-purple-600",
  admin:   "bg-pink-100 text-pink-600",
};

const AVATAR_BG = [
  "bg-blue-400", "bg-green-400", "bg-purple-400",
  "bg-pink-400",  "bg-orange-400", "bg-teal-400",
];

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") || "";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminApi.users(role || undefined).then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, [role]);

  const toggleActive = async (id, isActive) => {
    setToggling(id);
    try {
      await adminApi.updateUser(id, isActive);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive } : u)));
    } catch (e) {
      alert(e.message);
    } finally {
      setToggling(null);
    }
  };

  const tabs = [
    { value: "",        label: "All"     },
    { value: "student", label: "Student" },
    { value: "faculty", label: "Faculty" },
    { value: "admin",   label: "Admin"   },
  ];

  return (
    <DashboardLayout title="User Management">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .admin-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .user-row { transition: background 0.12s; }
        .user-row:hover { background-color: #f0f7ff; }
      `}</style>

      <div className="admin-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Manage</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">User Management</h1>
            <p className="text-blue-100 text-sm mt-1">View and manage all students, faculty, and admins.</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => {
            const active = t.value === role;
            return (
              <button
                key={t.value}
                onClick={() => setSearchParams(t.value ? { role: t.value } : {})}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No users found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different role filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header info */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">{users.length}</span> user{users.length !== 1 ? "s" : ""}
                {role && <span className="ml-1 text-blue-500 font-semibold capitalize">· {role}</span>}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Reward pts</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isActive = u.isActive !== false;
                    const roleBadge = ROLE_BADGE[u.role] || "bg-slate-100 text-slate-600";
                    const avatarBg = AVATAR_BG[i % AVATAR_BG.length];
                    return (
                      <tr key={u._id} className="user-row border-b border-slate-50">
                        {/* Name + avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 ${avatarBg} rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                              {u.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">{u.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-slate-500 text-sm">{u.email}</td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${roleBadge}`}>
                            {u.role}
                          </span>
                        </td>

                        {/* Reward pts */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-orange-400">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="font-bold text-slate-700 text-sm">{u.rewardPoints ?? 0}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleActive(u._id, !isActive)}
                            disabled={toggling === u._id}
                            className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition disabled:opacity-50 ${
                              isActive
                                ? "border-red-200 text-red-500 hover:bg-red-50"
                                : "border-green-200 text-green-500 hover:bg-green-50"
                            }`}
                          >
                            {toggling === u._id ? "…" : isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}