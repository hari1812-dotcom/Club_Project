import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi } from "../../api/api";

const CATEGORY_CONFIG = {
  "Technical":           { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600" },
  "Cultural & Creative": { bg: "bg-pink-50",   iconBg: "bg-pink-100",   text: "text-pink-600",   badge: "bg-pink-100 text-pink-600"   },
  "Social":              { bg: "bg-green-50",  iconBg: "bg-green-100",  text: "text-green-600",  badge: "bg-green-100 text-green-600"  },
  "Civic":               { bg: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-500", badge: "bg-orange-100 text-orange-500" },
};
const DEFAULT_CONFIG = CATEGORY_CONFIG["Technical"];
const AVATAR_BG = ["bg-indigo-400","bg-pink-400","bg-green-400","bg-orange-400","bg-purple-400","bg-teal-400"];

export default function MyClubs() {
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clubsApi.myClubs(), clubRequestsApi.myRequests()])
      .then(([c, r]) => { setClubs(c); setRequests(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((r) => r.status === "Pending");

  return (
    <DashboardLayout title="My Clubs">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .student-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .club-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .club-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }
      `}</style>

      <div className="student-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Student</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">My Clubs</h1>
            <p className="text-blue-100 text-sm mt-1">
              {clubs.length} club{clubs.length !== 1 ? "s" : ""} joined
              {pending.length > 0 ? ` · ${pending.length} pending request${pending.length !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
          <Link
            to="/student/clubs"
            className="hidden sm:flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Explore Clubs
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending requests */}
            {pending.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-amber-500">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <p className="font-bold text-amber-700 text-sm">Pending Requests ({pending.length})</p>
                </div>
                <div className="flex flex-col gap-2">
                  {pending.map((r, i) => (
                    <div key={r._id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${AVATAR_BG[i % AVATAR_BG.length]} rounded-xl flex items-center justify-center text-white font-bold text-xs`}>
                          {r.clubId?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <p className="font-semibold text-slate-700 text-sm">{r.clubId?.name}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clubs grid */}
            {clubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="text-slate-600 font-semibold">No clubs joined yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  Browse{" "}
                  <Link to="/student/clubs" className="text-blue-500 font-semibold hover:underline">Available Clubs</Link>
                  {" "}to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map((club, i) => {
                  const c = CATEGORY_CONFIG[club.category] || DEFAULT_CONFIG;
                  return (
                    <Link key={club._id} to={`/student/clubs/${club._id}`} className="block">
                      <div className={`club-card ${c.bg} rounded-2xl p-5`}>
                        <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                        </div>
                        <p className={`font-bold text-sm ${c.text}`}>{club.name}</p>
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${c.badge}`}>{club.category}</span>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-1">
                          {(club.activities && club.activities.length > 0)
                            ? club.activities[0]
                            : `Weekly ${club.category} club activities`}
                        </p>
                        <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                          {club.members?.length ?? 0} members
                        </p>
                        <p className={`text-xs font-semibold flex items-center gap-1 mt-3 ${c.text}`}>
                          View Details
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}