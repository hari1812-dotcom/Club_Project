import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

const CATEGORY_CONFIG = {
  "Technical":           { bg: "bg-indigo-50",  iconBg: "bg-indigo-100",  text: "text-indigo-600",  badge: "bg-indigo-100 text-indigo-600",  barColor: "#6366f1", bannerFrom: "from-indigo-500", bannerTo: "to-indigo-400" },
  "Cultural & Creative": { bg: "bg-pink-50",    iconBg: "bg-pink-100",    text: "text-pink-600",    badge: "bg-pink-100 text-pink-600",      barColor: "#ec4899", bannerFrom: "from-pink-500",   bannerTo: "to-rose-400"    },
  "Social":              { bg: "bg-green-50",   iconBg: "bg-green-100",   text: "text-green-600",   badge: "bg-green-100 text-green-600",    barColor: "#10b981", bannerFrom: "from-green-500",  bannerTo: "to-emerald-400" },
  "Civic":               { bg: "bg-orange-50",  iconBg: "bg-orange-100",  text: "text-orange-500",  badge: "bg-orange-100 text-orange-500",  barColor: "#f59e0b", bannerFrom: "from-orange-500", bannerTo: "to-amber-400"   },
};
const DEFAULT_CONFIG = { bg: "bg-blue-50", iconBg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-100 text-blue-600", barColor: "#3b82f6", bannerFrom: "from-blue-500", bannerTo: "to-blue-400" };

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function EventDetailModal({ ev, onClose }) {
  const c = CATEGORY_CONFIG[ev.clubId?.category] || DEFAULT_CONFIG;
  const evDate = new Date(ev.date);
  const isPast = evDate < new Date();
  const roleStyle =
    ev.memberRole === "Coordinator"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,13,40,.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full shadow-2xl overflow-hidden"
        style={{ maxWidth: 440, animation: "modalSlide .25s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Colored header */}
        <div className={`bg-gradient-to-r ${c.bannerFrom} ${c.bannerTo} px-6 py-5`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {ev.clubId?.category && (
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wide">
                  {ev.clubId.category}
                </span>
              )}
              <h2 className="text-white font-bold text-lg mt-2 leading-snug">{ev.description}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-xl text-white flex items-center justify-center hover:bg-white/30 transition shrink-0 text-sm"
            >✕</button>
          </div>
          {isPast && (
            <span className="inline-block mt-2 bg-white/20 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Past Event
            </span>
          )}
          {!isPast && (
            <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleStyle}`}>
              Your Role: {ev.memberRole || "Member"}
            </span>
          )}
        </div>

        {/* Detail rows */}
        <div className="p-5 flex flex-col gap-3">
          {/* Date */}
          <div className={`flex items-center gap-4 ${c.bg} rounded-2xl px-4 py-3.5`}>
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Date & Time</p>
              <p className="text-slate-800 font-bold text-sm mt-0.5">
                {DAYS[evDate.getDay()]}, {evDate.getDate()} {MONTHS[evDate.getMonth()]} {evDate.getFullYear()}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {evDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className={`flex items-center gap-4 ${c.bg} rounded-2xl px-4 py-3.5`}>
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Venue</p>
              <p className="text-slate-800 font-bold text-sm mt-0.5">{ev.venue || "—"}</p>
            </div>
          </div>

          {/* Club */}
          <div className={`flex items-center gap-4 ${c.bg} rounded-2xl px-4 py-3.5`}>
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Club</p>
              <p className="text-slate-800 font-bold text-sm mt-0.5">{ev.clubId?.name || "—"}</p>
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center gap-4 ${c.bg} rounded-2xl px-4 py-3.5`}>
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Status</p>
              <span className={`inline-flex items-center gap-1.5 text-sm font-bold mt-0.5 ${c.text}`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.barColor }} />
                {isPast ? "Completed" : "Upcoming"}
              </span>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ ev, onClick }) {
  const c = CATEGORY_CONFIG[ev.clubId?.category] || DEFAULT_CONFIG;
  const evDate = new Date(ev.date);
  const isPast = evDate < new Date();
  const roleStyle =
    ev.memberRole === "Coordinator"
      ? "bg-purple-100 text-purple-600"
      : "bg-blue-100 text-blue-600";

  return (
    <div
      onClick={onClick}
      className={`${c.bg} rounded-2xl p-5 cursor-pointer outline-none select-none`}
      style={{ transition: "transform 0.18s ease, box-shadow 0.18s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px -6px rgba(0,0,0,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Date box + badge row */}
      <div className="flex items-start justify-between mb-3">
        <div className={`${c.iconBg} rounded-xl px-3 py-2 text-center min-w-[52px]`}>
          <p className={`text-2xl font-extrabold leading-none ${c.text}`}>{evDate.getDate()}</p>
          <p className={`text-xs font-bold mt-0.5 ${c.text} opacity-70`}>{MONTHS[evDate.getMonth()]}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {!isPast && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${roleStyle}`}>
              {ev.memberRole || "Member"}
            </span>
          )}
          {ev.clubId?.category && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${c.badge}`}>{ev.clubId.category}</span>
          )}
          {isPast && (
            <span className="bg-slate-200 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">Past</span>
          )}
        </div>
      </div>

      {/* Title */}
      <p className={`font-bold text-sm ${c.text} leading-snug line-clamp-2 mb-3`}>{ev.description}</p>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-slate-500 text-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          {ev.clubId?.name || "—"}
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 text-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {ev.venue || "—"}
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 text-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {evDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* View hint */}
      <div className="flex items-center justify-end mt-3 pt-3 border-t border-white/60">
        <span className={`text-xs font-semibold flex items-center gap-1 ${c.text}`}>
          View details
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [selected, setSelected] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({});
  const [feedbackSavingId, setFeedbackSavingId] = useState("");

  useEffect(() => {
    eventsApi.myEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past     = events.filter((e) => new Date(e.date) < now);
  const shown    = tab === "upcoming" ? upcoming : past;

  const submitFeedback = async (eventId) => {
    const value = feedbackForm[eventId] || {};
    const rating = Number(value.rating || 0);
    const message = (value.message || "").trim();
    if (!rating || rating < 1 || rating > 5 || !message) {
      alert("Please select rating (1-5) and enter feedback message.");
      return;
    }
    try {
      setFeedbackSavingId(eventId);
      await eventsApi.submitFeedback(eventId, { rating, message });
      setEvents((prev) =>
        prev.map((ev) => (ev._id === eventId ? { ...ev, feedbackSubmitted: true } : ev))
      );
    } catch (err) {
      alert(err.message || "Failed to submit feedback.");
    } finally {
      setFeedbackSavingId("");
    }
  };

  return (
    <DashboardLayout title="Events">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .student-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes modalSlide { from{opacity:0;transform:scale(.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      <div className="student-root">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Student</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">My Events</h1>
            <p className="text-blue-100 text-sm mt-1">
              {upcoming.length} upcoming · {past.length} past — click any card to see details
            </p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "upcoming", label: `Upcoming (${upcoming.length})` },
            { key: "past",     label: `Past (${past.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No {tab} events</p>
            <p className="text-slate-400 text-sm mt-1">
              {tab === "upcoming" ? "Join clubs to see their upcoming events here." : "No past events to show."}
            </p>
          </div>
        ) : tab === "upcoming" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map((ev) => (
              <EventCard key={ev._id} ev={ev} onClick={() => setSelected(ev)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {shown.map((ev) => {
              const value = feedbackForm[ev._id] || { rating: 5, message: "" };
              return (
                <div key={ev._id} className="bg-white rounded-2xl border border-slate-100 p-4">
                  <EventCard ev={ev} onClick={() => setSelected(ev)} />
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-sm font-semibold text-slate-700">Event Feedback</p>
                    {ev.feedbackSubmitted ? (
                      <p className="text-xs text-green-600 mt-1">Feedback already submitted.</p>
                    ) : (
                      <div className="mt-2 flex gap-3 flex-wrap">
                        <select
                          value={value.rating}
                          onChange={(e) =>
                            setFeedbackForm((prev) => ({
                              ...prev,
                              [ev._id]: { ...value, rating: e.target.value },
                            }))
                          }
                          className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                        >
                          <option value={1}>1 Star</option>
                          <option value={2}>2 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={5}>5 Stars</option>
                        </select>
                        <textarea
                          value={value.message}
                          onChange={(e) =>
                            setFeedbackForm((prev) => ({
                              ...prev,
                              [ev._id]: { ...value, message: e.target.value },
                            }))
                          }
                          rows={2}
                          placeholder="Share your feedback"
                          className="flex-1 min-w-[220px] px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                        />
                        <button
                          onClick={() => submitFeedback(ev._id)}
                          disabled={feedbackSavingId === ev._id}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
                        >
                          {feedbackSavingId === ev._id ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && <EventDetailModal ev={selected} onClose={() => setSelected(null)} />}
    </DashboardLayout>
  );
}