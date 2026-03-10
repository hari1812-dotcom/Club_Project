import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

export default function AdminEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminApi.events(status || undefined).then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, [status]);

  const handleStatus = async (eventId, newStatus) => {
    setUpdating(eventId);
    const reason = newStatus === "Rejected" ? rejectionReason[eventId] : "";
    try {
      await adminApi.updateEventStatus(eventId, newStatus, reason);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const tabs = ["", "Pending", "Approved", "Rejected"];

  const statusStyle = {
    Pending:  { badge: "bg-orange-100 text-orange-600", dot: "bg-orange-400" },
    Approved: { badge: "bg-green-100 text-green-600",   dot: "bg-green-400"  },
    Rejected: { badge: "bg-red-100 text-red-600",       dot: "bg-red-400"    },
  };

  return (
    <DashboardLayout title="Event Approval">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .admin-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .ev-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
        .ev-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -6px rgba(0,0,0,0.09); }
      `}</style>

      <div className="admin-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Manage</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Event Approval</h1>
            <p className="text-blue-100 text-sm mt-1">Review and approve or reject club event submissions.</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((s) => {
            const active = (s || "all") === (status || "all");
            return (
              <button
                key={s || "all"}
                onClick={() => setSearchParams(s ? { status: s } : {})}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
                }`}
              >
                {s || "All"}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No events found</p>
            <p className="text-slate-400 text-sm mt-1">Try switching to a different filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => {
              const ss = statusStyle[ev.status] || statusStyle.Pending;
              return (
                <div key={ev._id} className="ev-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Left: icon */}
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-slate-800 text-base">{ev.description}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ss.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {ev.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                          </svg>
                          {ev.clubId?.name || "—"}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                          {ev.createdBy?.name || "—"}
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
                  </div>

                  {/* Pending actions */}
                  {ev.status === "Pending" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)"
                        className="flex-1 min-w-[180px] max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        value={rejectionReason[ev._id] || ""}
                        onChange={(e) => setRejectionReason((prev) => ({ ...prev, [ev._id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleStatus(ev._id, "Approved")}
                        disabled={updating === ev._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 disabled:opacity-50 transition"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(ev._id, "Rejected")}
                        disabled={updating === ev._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}