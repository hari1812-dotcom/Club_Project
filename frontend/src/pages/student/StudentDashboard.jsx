import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { name: "Technical", icon: "⚙️" },
  { name: "Cultural & Creative", icon: "🎨" },
  { name: "Social", icon: "🤝" },
  { name: "Civic", icon: "🏛️" },
];

const TIPS = [
  "Attend 3 events this month to unlock a badge! 🏅",
  "You're only 50 points away from Gold tier! 🥇",
  "New clubs just opened for applications! 🎉",
  "Check out upcoming events in your clubs 📅",
];

const STAT_CONFIG = [
  {
    label: "MY CLUBS",
    key: "clubs",
    link: "/student/my-clubs",
    icon: "🎯",
    iconBg: "bg-blue-500",
    cardBg: "bg-blue-100",
    numColor: "text-blue-700",
  },
  {
    label: "UPCOMING EVENTS",
    key: "events",
    link: "/student/events",
    icon: "📅",
    iconBg: "bg-purple-500",
    cardBg: "bg-purple-100",
    numColor: "text-purple-700",
  },
  {
    label: "PENDING REQUESTS",
    key: "requests",
    link: "/student/my-clubs",
    icon: "⏳",
    iconBg: "bg-amber-500",
    cardBg: "bg-amber-100",
    numColor: "text-amber-700",
  },
];

function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer"
      style={{ perspective: "1000px", height: "160px" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clubs: 0, events: 0, requests: 0 });
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Promise.all([
      clubsApi.myClubs(),
      eventsApi.myEvents(),
      clubRequestsApi.myRequests(),
    ])
      .then(([clubs, events, requests]) => {
        setStats({
          clubs: clubs.length,
          events: events.length,
          requests: requests.filter((r) => r.status === "Pending").length,
        });
      })
      .catch(() => {});
  }, []);

  const points = user?.rewardPoints ?? 0;
  const maxPoints = 500;
  const progress = Math.min((points / maxPoints) * 100, 100);
  const tier =
    points >= 400 ? "🥇 Gold" : points >= 200 ? "🥈 Silver" : "🥉 Bronze";

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="mb-6">
          <p className="text-slate-700 text-sm">
            Welcome back, <strong>{user?.name || "Student"}</strong> 👋
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Here's what's happening with your clubs today.
          </p>
        </div>

        {/* Tip Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
          <span className="text-base">💡</span>
          <p key={tipIndex} className="text-indigo-700 text-sm font-medium">
            {TIPS[tipIndex]}
          </p>
        </div>

        {/* Flip Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {STAT_CONFIG.map((cfg) => (
            <FlipCard
              key={cfg.key}
              front={
                <div
                  className={`${cfg.cardBg} rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
                  style={{ boxSizing: "border-box" }}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`${cfg.iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-xl`}
                    >
                      {cfg.icon}
                    </div>
                    <span className="text-xs text-black/30 font-medium">flip ↻</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-black/40 uppercase mb-1">
                      {cfg.label}
                    </p>
                    <p className={`text-5xl font-extrabold leading-none ${cfg.numColor}`}>
                      {stats[cfg.key]}
                    </p>
                  </div>
                </div>
              }
              back={
                <Link
                  to={cfg.link}
                  className="block h-full"
                  style={{ textDecoration: "none" }}
                >
                  <div className="bg-slate-800 rounded-2xl h-full flex flex-col items-center justify-center gap-3">
                    <span className="text-3xl">{cfg.icon}</span>
                    <p className="text-slate-400 text-sm font-semibold">
                      View {cfg.label.toLowerCase()}
                    </p>
                    <div className="bg-indigo-500 text-white text-sm font-semibold px-5 py-1.5 rounded-lg">
                      Go →
                    </div>
                  </div>
                </Link>
              }
            />
          ))}
        </div>

        {/* Reward Points */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
                Reward Points
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-indigo-600 leading-none">
                  {points}
                </span>
                <span className="text-slate-300 text-base">/ {maxPoints}</span>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-indigo-500 uppercase tracking-widest font-semibold mb-0.5">
                Current Tier
              </p>
              <p className="text-base font-extrabold text-indigo-800">{tier}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-slate-400">Progress to next tier</span>
              <span className="text-xs text-indigo-500 font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Keep participating in events to earn more points ✨
            </p>
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-slate-800">Browse by Category</h2>
            <Link
              to="/student/clubs"
              className="text-xs text-indigo-500 font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/student/clubs?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "Explore Clubs", link: "/student/clubs", icon: "🔍" },
              { label: "My Events", link: "/student/events", icon: "🗓️" },
              { label: "My Clubs", link: "/student/my-clubs", icon: "⭐" },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition shadow-sm"
              >
                <span className="text-base">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}