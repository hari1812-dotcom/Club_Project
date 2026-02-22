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

  useEffect(() => {
    eventsApi
      .getById(id)
      .then((data) => {
        setEvent(data);
        setCoordinatorId(data.studentCoordinator?._id || data.studentCoordinator || "");
        const members = data.clubMembers || [];
        setAttendees(
          members.map((m) => ({
            studentId: m._id,
            name: m.name,
            present: false,
            points: 0,
            reason: "participation",
          }))
        );
      })
      .catch(() => setEvent(null));
  }, [id]);

  const handleAttendeeChange = (idx, field, value) => {
    setAttendees((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    const payload = {};
    if (coordinatorId) payload.coordinatorId = coordinatorId;
    payload.attendees = attendees.map((a) => ({
      studentId: a.studentId,
      present: !!a.present,
      points: Number(a.points) || 0,
      reason: a.reason || "participation",
    }));
    eventsApi
      .updateAttendance(id, payload)
      .then(() => {
        setMessage("Saved. Coordinator and attendance updated.");
        setEvent((prev) => (prev ? { ...prev, studentCoordinator: payload.coordinatorId } : null));
      })
      .catch((err) => setMessage(err.message || "Failed to save"))
      .finally(() => setSubmitting(false));
  };

  if (!event) {
    return (
      <DashboardLayout title="Manage Event">
        <p className="text-slate-500">Loading… or you don’t have access to this event.</p>
        <button onClick={() => navigate("/faculty/events")} className="mt-2 text-indigo-600 text-sm">Back to Events</button>
      </DashboardLayout>
    );
  }

  const members = event.clubMembers || [];

  return (
    <DashboardLayout title="Manage Event">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800">{event.description}</h2>
          <p className="text-slate-600 text-sm mt-1">Club: {event.clubId?.name} · Venue: {event.venue} · {new Date(event.date).toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Coordinator</label>
            <select
              value={coordinatorId}
              onChange={(e) => setCoordinatorId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
            >
              <option value="">— None —</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Attendance & reward points</label>
            <p className="text-slate-500 text-xs mb-2">Mark present and optionally add points (participation / organizer / winner).</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {attendees.map((a, idx) => (
                <div key={a.studentId} className="flex flex-wrap items-center gap-3 p-2 border border-slate-100 rounded-lg">
                  <span className="font-medium text-slate-700 w-32 truncate">{a.name}</span>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={!!a.present}
                      onChange={(e) => handleAttendeeChange(idx, "present", e.target.checked)}
                    />
                    Present
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Points"
                    className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                    value={a.points || ""}
                    onChange={(e) => handleAttendeeChange(idx, "points", e.target.value)}
                  />
                  <select
                    className="px-2 py-1 border border-slate-200 rounded text-sm"
                    value={a.reason || "participation"}
                    onChange={(e) => handleAttendeeChange(idx, "reason", e.target.value)}
                  >
                    <option value="participation">Participation</option>
                    <option value="organizer">Organizer</option>
                    <option value="winner">Winner</option>
                  </select>
                </div>
              ))}
            </div>
            {attendees.length === 0 && <p className="text-slate-500 text-sm">No club members yet. Approve join requests to add students.</p>}
          </div>

          {message && <p className={`text-sm ${message.startsWith("Saved") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => navigate("/faculty/events")} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
              Back to Events
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
