import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi } from "../../api/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ clubId: "", venue: "", date: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clubsApi.facultyClubs().then((list) => {
      setClubs(list);
      if (list.length > 0) setForm((f) => ({ ...f, clubId: list[0]._id }));
    }).catch(() => {});
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.clubId || !form.venue || !form.date || !form.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await eventsApi.create(form);
      navigate("/faculty/events");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <DashboardLayout title="Create Event">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .form-field:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
      `}</style>

      <div className="faculty-root" style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Faculty</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Create New Event</h1>
            <p className="text-blue-100 text-sm mt-1">Events must be approved by admin before students can see them.</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {/* Club */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Club</label>
            <select
              value={form.clubId}
              onChange={(e) => updateField("clubId", e.target.value)}
              className="form-field w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 transition cursor-pointer"
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>{club.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Event Title / Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="form-field w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 transition resize-vertical"
              style={{ minHeight: 110 }}
              placeholder="e.g. Annual Tech Symposium 2025 – 2-day innovation & coding challenge"
            />
          </div>

          {/* Venue */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => updateField("venue", e.target.value)}
              className="form-field w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 transition"
              placeholder="e.g. Seminar Hall A, Academic Block - II"
            />
          </div>

          {/* Date & Time */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Date and Time</label>
            <input
              type="datetime-local"
              value={form.date}
              min={minDate}
              onChange={(e) => updateField("date", e.target.value)}
              className="form-field w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 transition"
            />
            {form.date && (
              <div className="mt-2.5 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-500 shrink-0">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="text-xs text-blue-700 font-medium">
                  {new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  {" at "}
                  {new Date(form.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 min-w-[160px] py-3.5 bg-blue-500 text-white font-bold text-sm rounded-xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm shadow-blue-200"
            >
              {submitting ? "Submitting…" : "Submit for Approval"}
            </button>
            <button
              onClick={() => navigate("/faculty/events")}
              className="px-6 py-3.5 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            All events are reviewed by the administrator before publication.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}