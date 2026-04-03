import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const TIPS = [
  "Attend 3 events this month to unlock a badge!",
  "Keep participating to reach higher tiers!",
  "New clubs just opened for applications!",
  "Check out upcoming events in your clubs",
];

const CATEGORIES = [
  { name: "Technical",           bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600" },
  { name: "Cultural & Creative", bg: "bg-pink-50",   iconBg: "bg-pink-100",   text: "text-pink-600",   badge: "bg-pink-100 text-pink-600"   },
  { name: "Social",              bg: "bg-green-50",  iconBg: "bg-green-100",  text: "text-green-600",  badge: "bg-green-100 text-green-600"  },
  { name: "Civic",               bg: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-500", badge: "bg-orange-100 text-orange-500" },
];

const STAT_CARDS = [
  { key: "clubs",    label: "My Clubs",          to: "/student/my-clubs",  bg: "bg-indigo-50", iconBg: "bg-indigo-100", valueColor: "text-indigo-600", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-indigo-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { key: "events",   label: "Upcoming Events",   to: "/student/events",    bg: "bg-purple-50", iconBg: "bg-purple-100", valueColor: "text-purple-600", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-purple-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { key: "requests", label: "Pending Requests",  to: "/student/my-clubs",  bg: "bg-amber-50",  iconBg: "bg-amber-100",  valueColor: "text-amber-500",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-amber-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
];

export default function StudentDashboard() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({ clubs: 0, events: 0, requests: 0 });
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    refreshUser().catch(() => {});
    Promise.all([clubsApi.myClubs(), eventsApi.myEvents(), clubRequestsApi.myRequests()])
      .then(([clubs, events, requests]) => {
        setStats({
          clubs: clubs.length,
          events: events.filter((e) => new Date(e.date) >= new Date()).length,
          requests: requests.filter((r) => r.status === "Pending").length,
        });
      })
      .catch(() => {});
  }, [refreshUser]);

  const points = user?.rewardPoints ?? 0;
  const maxPoints = 5000;
  const progress = Math.min((points / maxPoints) * 100, 100);
  const tier = points >= 4000 ? { label: "Gold", bg: "bg-amber-100", text: "text-amber-700" }
    : points >= 2000 ? { label: "Silver", bg: "bg-slate-100", text: "text-slate-600" }
    : { label: "Bronze", bg: "bg-orange-100", text: "text-orange-700" };

  return (
    <DashboardLayout title="Student Dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .student-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }
        .cat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .cat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -4px rgba(0,0,0,0.08); }
        .qa-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .qa-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        @keyframes tipFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .tip-text { animation: tipFade 0.4s ease; }
      `}</style>

      <div className="student-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Student Portal</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="text-blue-100 text-sm mt-1">Explore clubs, join events, and earn rewards.</p>
          </div>
          <Link
            to="/student/events"
            className="hidden sm:flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            View Events
          </Link>
        </div>

        {/* Tip banner */}
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 mb-6">
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-indigo-500">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p key={tipIndex} className="tip-text text-indigo-700 text-sm font-medium">{TIPS[tipIndex]}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {STAT_CARDS.map((c) => (
            <Link key={c.key} to={c.to} className="block">
              <div className={`stat-card ${c.bg} rounded-2xl p-5`}>
                <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  {c.icon}
                </div>
                <p className={`text-3xl font-extrabold ${c.valueColor}`}>{stats[c.key]}</p>
                <p className="text-slate-500 text-sm font-medium mt-1">{c.label}</p>
                <p className={`text-xs font-semibold flex items-center gap-1 mt-3 ${c.valueColor}`}>
                  View all
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Reward Points - Only show if user has points */}
        {points > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reward Points</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-indigo-600">{points}</span>
                  <span className="text-slate-400 text-base font-medium">/ {maxPoints}</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${tier.bg} ${tier.text}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {tier.label} Tier
              </span>
            </div>
            <div className="mb-2 flex justify-between text-xs text-slate-400 font-medium">
              <span>Progress to next tier</span>
              <span className="text-indigo-500 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-indigo-400 shrink-0">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <p className="text-indigo-600 text-xs font-medium">Participate in club events to earn more points and climb the tiers!</p>
            </div>
          </div>
        )}

        {/* Browse by Category */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-slate-800 text-sm">Browse by Category</p>
            <Link to="/student/clubs" className="text-blue-500 text-xs font-semibold flex items-center gap-1 hover:text-blue-700 transition">
              View all
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/student/clubs?category=${encodeURIComponent(cat.name)}`} className="block">
                <div className={`cat-card ${cat.bg} rounded-2xl p-4`}>
                  <div className={`w-9 h-9 ${cat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${cat.text}`}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <p className={`font-bold text-xs ${cat.text}`}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-yellow-500">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Quick Actions</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Explore Clubs", to: "/student/clubs", bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600" },
              { label: "My Events",     to: "/student/events", bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600" },
              { label: "My Clubs",      to: "/student/my-clubs", bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className={`qa-btn flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm ${a.bg} ${a.border} ${a.text}`}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}