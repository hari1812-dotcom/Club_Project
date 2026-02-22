import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) return <DashboardLayout title="Admin Dashboard"><p className="text-slate-500">Loading…</p></DashboardLayout>;

  const cards = [
    { label: "Total Students", value: stats.totalStudents, to: "/admin/users?role=student", color: "indigo" },
    { label: "Total Faculty", value: stats.totalFaculty, to: "/admin/users?role=faculty", color: "emerald" },
    { label: "Total Clubs", value: stats.totalClubs, color: "violet" },
    { label: "Active Events", value: stats.totalActiveEvents, color: "sky" },
    { label: "Pending Events", value: stats.totalPendingEvents, to: "/admin/events?status=Pending", color: "amber" },
    { label: "Approved Events", value: stats.totalApprovedEvents, color: "green" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition ${
              c.to ? "cursor-pointer" : ""
            }`}
          >
            {c.to ? (
              <Link to={c.to} className="block">
                <p className="text-slate-500 text-sm">{c.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{c.value}</p>
              </Link>
            ) : (
              <>
                <p className="text-slate-500 text-sm">{c.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{c.value}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">Participation</h2>
          <p className="text-slate-600">Total participation count: <strong>{stats.participationCount ?? 0}</strong></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">Most active club</h2>
          <p className="text-slate-600">{stats.mostActiveClub?.name || "—"}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">Most active student</h2>
          <p className="text-slate-600">
            {stats.mostActiveStudent ? `${stats.mostActiveStudent.name} (${stats.mostActiveStudent.rewardPoints} pts)` : "—"}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
