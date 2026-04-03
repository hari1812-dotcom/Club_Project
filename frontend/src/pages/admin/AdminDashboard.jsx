import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats)
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      to: "/admin/users?role=student",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      valueColor: "text-blue-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-blue-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Total Faculty",
      value: stats.totalFaculty,
      to: "/admin/users?role=faculty",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      valueColor: "text-green-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-green-500">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      label: "Total Clubs",
      value: stats.totalClubs,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      valueColor: "text-purple-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-purple-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      label: "Active Events",
      value: stats.totalActiveEvents,
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      valueColor: "text-pink-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-pink-500">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polyline points="9 16 11 18 15 14" />
        </svg>
      ),
    },
    {
      label: "Pending Events",
      value: stats.totalPendingEvents,
      to: "/admin/events?status=Pending",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      valueColor: "text-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-orange-400">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Approved Events",
      value: stats.totalApprovedEvents,
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      valueColor: "text-teal-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-teal-500">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .admin-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }
      `}</style>

      <div className="admin-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Welcome back, Admin</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Here's an overview of your platform today.</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statCards.map((c) => {
            const inner = (
              <div className={`stat-card ${c.bg} rounded-2xl p-5 h-full`}>
                <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  {c.icon}
                </div>
                <p className={`text-3xl font-extrabold ${c.valueColor}`}>{c.value ?? 0}</p>
                <p className="text-slate-500 text-sm font-medium mt-1">{c.label}</p>
                {c.to && (
                  <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-medium">
                    View all
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                )}
              </div>
            );
            return c.to ? (
              <Link key={c.label} to={c.to} className="block">{inner}</Link>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>

        {/* Info row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Participation */}
          <div className="bg-blue-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="text-slate-700 font-semibold text-sm">Participation</p>
                <p className="text-slate-400 text-xs">Total count</p>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-blue-600">{stats.participationCount ?? 0}</p>
          </div>

          {/* Most active club */}
          <div className="bg-purple-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-purple-500">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <p className="text-slate-700 font-semibold text-sm">Most Active Club</p>
                <p className="text-slate-400 text-xs">By events</p>
              </div>
            </div>
            <p className="text-base font-bold text-purple-600 truncate">{stats.mostActiveClub?.name || "—"}</p>
          </div>

          {/* Most active student */}
          <div className="bg-green-50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-500">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-700 font-semibold text-sm">Most Active Student</p>
                <p className="text-slate-400 text-xs">By reward points</p>
              </div>
            </div>
            <p className="text-base font-bold text-green-600 truncate">
              {stats.mostActiveStudent
                ? `${stats.mostActiveStudent.name} (${stats.mostActiveStudent.rewardPoints} pts)`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}