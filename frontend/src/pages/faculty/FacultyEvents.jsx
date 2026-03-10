import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

const STATUS_STYLE = {
  Pending:  { badge: "bg-orange-100 text-orange-500", dot: "bg-orange-400" },
  Approved: { badge: "bg-green-100 text-green-600",   dot: "bg-green-400"  },
  Rejected: { badge: "bg-red-100 text-red-500",       dot: "bg-red-400"    },
};

const TAB_STYLE = {
  Pending:  { active: "bg-orange-500 text-white shadow-sm", inactive: "bg-white border border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500" },
  Approved: { active: "bg-green-500 text-white shadow-sm",  inactive: "bg-white border border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-500"  },
  Rejected: { active: "bg-red-500 text-white shadow-sm",    inactive: "bg-white border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500"    },
};

export default function FacultyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    eventsApi.facultyEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const byStatus = (s) => events.filter((e) => e.status === s);
  const tabs = ["Pending", "Approved", "Rejected"];

  return (
    <DashboardLayout title="Events">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; } .ev-card { transition: transform 0.16s ease, box-shadow 0.16s ease; } .ev-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -6px rgba(0,0,0,0.09); }`}</style>

      <div className="faculty-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Manage</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Events</h1>
            <p className="text-blue-100 text-sm mt-1">{events.length} total event{events.length !== 1 ? "s" : ""}.</p>
          </div>
          <Link
            to="/faculty/events/new"
            className="flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Event
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            const ts = TAB_STYLE[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${active ? ts.active : ts.inactive}`}
              >
                {tab} ({byStatus(tab).length})
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : byStatus(activeTab).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No {activeTab.toLowerCase()} events</p>
            <p className="text-slate-400 text-sm mt-1">Nothing to show here right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {byStatus(activeTab).map((ev) => {
              const ss = STATUS_STYLE[ev.status] || STATUS_STYLE.Pending;
              return (
                <div key={ev._id} className="ev-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-slate-800 text-sm">{ev.description}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ss.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {ev.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                          </svg>
                          {ev.clubId?.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {ev.venue}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {new Date(ev.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {ev.status === "Approved" && (
                      <Link
                        to={`/faculty/events/${ev._id}/manage`}
                        className="flex items-center gap-2 bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-blue-600 transition shrink-0 self-center"
                      >
                        Manage
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
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