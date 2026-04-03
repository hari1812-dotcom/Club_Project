import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

export default function FacultyEventManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [coordinatorId, setCoordinatorId] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    eventsApi.getById(id).then((data) => {
      setEvent(data);
      setCoordinatorId(data.studentCoordinator?._id || data.studentCoordinator || "");
      const members = data.clubMembers || [];
      setAttendees(members.map((m) => ({
        studentId: m._id, name: m.name, email: m.email,
        present: false, points: 0, reason: "participation",
      })));
    }).catch(() => setEvent(null));
  }, [id]);

  const updateAttendee = (idx, field, value) => {
    setAttendees((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    setMessage("");
    setSubmitting(true);
    try {
      const payload = {
        coordinatorId: coordinatorId || undefined,
        attendees: attendees.map((a) => ({
          studentId: a.studentId,
          present: !!a.present,
          points: Number(a.points) || 0,
          reason: a.reason || "participation",
        })),
      };
      await eventsApi.updateAttendance(id, payload);
      setMessage("Saved successfully! Attendance and coordinator updated.");
      setMsgType("success");
    } catch (err) {
      setMessage(err.message || "Failed to save.");
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!event)
    return (
      <DashboardLayout title="Manage Event">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );

  const members = event.clubMembers || [];

  return (
    <DashboardLayout title="Manage Event">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .form-field:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .attendee-row { transition: background 0.15s ease; }
      `}</style>

      <div className="faculty-root" style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Back */}
        <button
          onClick={() => navigate("/faculty/events")}
          className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl mb-6 hover:bg-blue-100 transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Events
        </button>

        {/* Event info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-300" />
          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">{event.description}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <span className="text-slate-400 text-xs">{event.clubId?.name}</span>
                  <span className="text-slate-400 text-xs">{event.venue}</span>
                  <span className="text-slate-400 text-xs">{new Date(event.date).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coordinator */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-purple-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Student Coordinator</p>
          </div>
          <select
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            className="form-field w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 transition cursor-pointer"
          >
            <option value="">— No coordinator —</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
            ))}
          </select>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-500">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Attendance & Reward Points</p>
          </div>
          <p className="text-slate-400 text-xs mb-4 ml-12">Mark present students and assign reward points.</p>

          {attendees.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-semibold text-sm">No members yet</p>
              <p className="text-slate-400 text-xs mt-1">Approve join requests to add students.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {attendees.map((a, idx) => (
                <div
                  key={a.studentId}
                  className={`attendee-row flex items-center gap-3 rounded-xl px-4 py-3 border flex-wrap ${a.present ? "bg-green-50 border-green-100" : "bg-slate-50 border-slate-100"}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${a.present ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-600"}`}>
                    {a.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                    <p className="text-slate-400 text-xs">{a.email}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!a.present}
                      onChange={(e) => updateAttendee(idx, "present", e.target.checked)}
                      className="w-4 h-4 accent-green-500 cursor-pointer"
                    />
                    <span className={`text-xs font-semibold ${a.present ? "text-green-600" : "text-slate-400"}`}>
                      {a.present ? "Present" : "Absent"}
                    </span>
                  </label>
                  <input
                    type="number" min={0} max={100}
                    placeholder="Pts"
                    value={a.points || ""}
                    onChange={(e) => updateAttendee(idx, "points", e.target.value)}
                    className="form-field w-16 px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-center text-slate-700 transition"
                  />
                  <select
                    value={a.reason}
                    onChange={(e) => updateAttendee(idx, "reason", e.target.value)}
                    className="form-field px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 transition cursor-pointer"
                  >
                    <option value="participation">Participation</option>
                    <option value="organizer">Organizer</option>
                    <option value="winner">Winner</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 text-sm font-medium border ${
            msgType === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
              {msgType === "success"
                ? <polyline points="20 6 9 17 4 12" />
                : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
            </svg>
            {message}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-blue-500 text-white font-bold text-sm rounded-2xl hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm shadow-blue-200"
        >
          {submitting ? "Saving…" : "Save Attendance & Coordinator"}
        </button>
      </div>
    </DashboardLayout>
  );
}