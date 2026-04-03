import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi, eventsApi } from "../../api/api";

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ clubs: 0, requests: 0, events: 0 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clubsApi.facultyClubs(),
      clubRequestsApi.facultyRequests(),
      eventsApi.facultyEvents(),
      eventsApi.facultyFeedback(),
    ])
      .then(([clubs, requests, events, feedbackList]) => {
        const pending = requests.filter((r) => r.status === "Pending");
        setStats({ clubs: clubs.length, requests: pending.length, events: events.length });
        setFeedbacks(feedbackList || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      key: "clubs",
      label: "Clubs I Manage",
      desc: "Active clubs under your supervision",
      to: "/faculty/clubs",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      valueColor: "text-indigo-600",
      linkColor: "text-indigo-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-indigo-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      key: "requests",
      label: "Pending Requests",
      desc: "Join requests awaiting your approval",
      to: "/faculty/requests",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      valueColor: "text-orange-500",
      linkColor: "text-orange-400",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-orange-400">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      key: "events",
      label: "Events",
      desc: "Upcoming & ongoing club events",
      to: "/faculty/events",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      valueColor: "text-green-600",
      linkColor: "text-green-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-green-500">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      label: "Manage Clubs",
      to: "/faculty/clubs",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      label: "Review Requests",
      to: "/faculty/requests",
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: "View Events",
      to: "/faculty/events",
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <DashboardLayout title="Faculty Dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }
        .qa-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .qa-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
      `}</style>

      <div className="faculty-root">
        {/* Blue banner — same as admin */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                Faculty Portal
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-0.5">Welcome back!</h1>
            <p className="text-blue-100 text-sm mt-1">Here's a snapshot of your club activities.</p>
          </div>
          <div className="hidden sm:flex flex-col items-center bg-white/20 rounded-2xl px-5 py-3 shrink-0 min-w-[90px] text-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-200 text-xs font-bold uppercase tracking-wide">Live</span>
            </div>
            <p className="text-white text-3xl font-extrabold leading-none">
              {stats.clubs + stats.requests + stats.events}
            </p>
            <p className="text-blue-100 text-xs mt-1">Total items</p>
          </div>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {statCards.map((c) => (
              <Link key={c.key} to={c.to} className="block">
                <div className={`stat-card ${c.bg} rounded-2xl p-5 h-full`}>
                  <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    {c.icon}
                  </div>
                  <p className={`text-3xl font-extrabold ${c.valueColor}`}>{stats[c.key]}</p>
                  <p className="text-slate-700 font-bold text-sm mt-1">{c.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5 mb-3">{c.desc}</p>
                  <p className={`text-xs font-semibold flex items-center gap-1 ${c.linkColor}`}>
                    View all
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-yellow-500">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Quick Actions</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`qa-btn flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm ${a.bg} ${a.border} ${a.text}`}
              >
                {a.icon}
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Student Feedback</p>
          </div>
          {feedbacks.length === 0 ? (
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-500">
              No feedback submitted yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {feedbacks.slice(0, 8).map((f) => (
                <div key={f._id} className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-slate-700">
                      {f.studentId?.name || "Student"} · {f.clubId?.name || "Club"}
                    </p>
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">
                      {f.rating}/5
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {f.eventId?.description || "Event"} · {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}