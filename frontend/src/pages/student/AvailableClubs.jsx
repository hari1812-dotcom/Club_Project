import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORY_CONFIG = {
  "Technical": {
    bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-600", border: "border-indigo-100",
    desc: "Coding, science, math & open-source clubs",
    bannerFrom: "from-indigo-500", bannerTo: "to-indigo-400",
  },
  "Cultural & Creative": {
    bg: "bg-pink-50", iconBg: "bg-pink-100", text: "text-pink-600",
    badge: "bg-pink-100 text-pink-600", border: "border-pink-100",
    desc: "Arts, music, photography & Tamil culture",
    bannerFrom: "from-pink-500", bannerTo: "to-rose-400",
  },
  "Social": {
    bg: "bg-green-50", iconBg: "bg-green-100", text: "text-green-600",
    badge: "bg-green-100 text-green-600", border: "border-green-100",
    desc: "Community service, YRC, Rotaract & more",
    bannerFrom: "from-green-500", bannerTo: "to-emerald-400",
  },
  "Civic": {
    bg: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-500",
    badge: "bg-orange-100 text-orange-500", border: "border-orange-100",
    desc: "Women's cell, yoga, geography & leadership",
    bannerFrom: "from-orange-500", bannerTo: "to-amber-400",
  },
};
const DEFAULT_CONFIG = CATEGORY_CONFIG["Technical"];
const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default function AvailableClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get("category") || null;

  useEffect(() => {
    clubsApi.getAll().then(setClubs).catch(() => setClubs([])).finally(() => setLoading(false));
  }, []);

  const byCategory = clubs.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});

  const catConfig = selectedCat ? (CATEGORY_CONFIG[selectedCat] || DEFAULT_CONFIG) : null;

  return (
    <DashboardLayout title="Available Clubs">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .student-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .cat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .cat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }
        .club-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
        .club-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -6px rgba(0,0,0,0.09); }
      `}</style>

      <div className="student-root">
        {/* Banner */}
        <div className={`rounded-2xl bg-gradient-to-r ${catConfig ? catConfig.bannerFrom + " " + catConfig.bannerTo : "from-blue-500 to-blue-400"} px-7 py-6 mb-7 flex items-center justify-between`}>
          <div>
            <p className="text-white/70 text-sm font-medium">
              {selectedCat ? "Category" : "Explore"}
            </p>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              {selectedCat ? selectedCat : "Available Clubs"}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {selectedCat
                ? `${catConfig?.desc} · ${byCategory[selectedCat]?.length ?? 0} club${(byCategory[selectedCat]?.length ?? 0) !== 1 ? "s" : ""} available`
                : `${clubs.length} clubs across ${CATEGORIES.length} categories — find your community`}
            </p>
          </div>
          {selectedCat ? (
            <button
              onClick={() => setSearchParams({})}
              className="hidden sm:flex items-center gap-2 bg-white/20 border border-white/30 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              All Categories
            </button>
          ) : (
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : selectedCat ? (
          /* ── Club list for selected category ── */
          <>
            {/* Back button (mobile) */}
            <button
              onClick={() => setSearchParams({})}
              className={`flex sm:hidden items-center gap-2 ${catConfig.bg} border ${catConfig.border} ${catConfig.text} text-sm font-semibold px-4 py-2 rounded-xl mb-5 transition`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back
            </button>

            {(byCategory[selectedCat] || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className={`w-16 h-16 ${catConfig.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-8 h-8 ${catConfig.text} opacity-50`}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="text-slate-600 font-semibold">No clubs yet</p>
                <p className="text-slate-400 text-sm mt-1">No clubs have been added to this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(byCategory[selectedCat] || []).map((club) => (
                  <Link key={club._id} to={`/student/clubs/${club._id}`} className="block">
                    <div className={`club-card ${catConfig.bg} rounded-2xl p-5 h-full flex flex-col`}>
                      <div className={`w-11 h-11 ${catConfig.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${catConfig.text}`}>
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        </svg>
                      </div>
                      <p className={`font-bold text-sm ${catConfig.text}`}>{club.name}</p>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2 flex-1">{club.description}</p>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-1">
                        {(club.activities && club.activities.length > 0)
                          ? club.activities[0]
                          : `Popular ${club.category} activities available`}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                          {club.members?.length ?? 0} members
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${catConfig.text}`}>
                          View
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── Category cards ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const c = CATEGORY_CONFIG[cat];
              const count = byCategory[cat]?.length ?? 0;
              return (
                <div
                  key={cat}
                  className={`cat-card ${c.bg} rounded-2xl p-5 cursor-pointer`}
                  onClick={() => setSearchParams({ category: cat })}
                >
                  <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                  </div>
                  <p className={`font-extrabold text-base ${c.text}`}>{cat}</p>
                  <p className="text-slate-400 text-xs mt-1 mb-3">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${c.badge}`}>
                      {count} club{count !== 1 ? "s" : ""}
                    </span>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${c.text}`}>
                      Explore
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}