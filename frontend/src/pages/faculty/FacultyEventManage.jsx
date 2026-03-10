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
    eventsApi.getById(id).then(data => {
      setEvent(data);
      setCoordinatorId(data.studentCoordinator?._id || data.studentCoordinator || "");
      const members = data.clubMembers || [];
      setAttendees(members.map(m => ({
        studentId: m._id, name: m.name, email: m.email,
        present: false, points: 0, reason: "participation",
      })));
    }).catch(() => setEvent(null));
  }, [id]);

  const updateAttendee = (idx, field, value) => {
    setAttendees(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    setMessage(""); setSubmitting(true);
    try {
      const payload = {
        coordinatorId: coordinatorId || undefined,
        attendees: attendees.map(a => ({
          studentId: a.studentId,
          present: !!a.present,
          points: Number(a.points) || 0,
          reason: a.reason || "participation",
        })),
      };
      await eventsApi.updateAttendance(id, payload);
      setMessage(" Saved successfully! Attendance and coordinator updated.");
      setMsgType("success");
    } catch (err) {
      setMessage(err.message || "Failed to save.");
      setMsgType("error");
    } finally { setSubmitting(false); }
  };

  if (!event) return (
    <DashboardLayout title="Manage Event">
      <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading event…</div>
    </DashboardLayout>
  );

  const members = event.clubMembers || [];

  return (
    <DashboardLayout title="Manage Event">
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Back */}
        <button onClick={() => navigate("/faculty/events")} style={{
          background: "#eef2ff", border: "1.5px solid #e0e7ff",
          borderRadius: 12, padding: "8px 18px",
          color: "#6366f1", fontWeight: 700, fontSize: 13,
          cursor: "pointer", marginBottom: 24,
        }}>← Back to Events</button>

        {/* Event info card */}
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1.5px solid #e8e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,.07)",
          overflow: "hidden", marginBottom: 24,
          animation: "fadeUp .4s ease both",
        }}>
          <div style={{ height: 5, background: "linear-gradient(90deg,#6366f1,#818cf8)" }} />
          <div style={{ padding: "22px 26px" }}>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: "#5f5c93", margin: "0 0 8px" }}>{event.description}</h2>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{event.clubId?.name}</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{event.venue}</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{new Date(event.date).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Coordinator */}
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1.5px solid #e8e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,.07)",
          padding: "22px 26px", marginBottom: 20,
          animation: "fadeUp .4s .1s ease both",
        }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 14px" }}>
             Student Coordinator
          </h3>
          <select
            value={coordinatorId}
            onChange={e => setCoordinatorId(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px",
              border: "1.5px solid #e8e8f0", borderRadius: 12,
              fontSize: 14, color: "#1e1b4b", background: "#f8fafc",
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="">— No coordinator —</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
          </select>
        </div>

        {/* Attendance */}
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1.5px solid #e8e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,.07)",
          padding: "22px 26px", marginBottom: 20,
          animation: "fadeUp .4s .2s ease both",
        }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 6px" }}>
            📋 Attendance & Reward Points
          </h3>
          <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 18px" }}>
            Mark present students and assign reward points.
          </p>

          {attendees.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "30px 20px",
              background: "#f8fafc", borderRadius: 14,
              border: "1.5px dashed #e0e7ff",
            }}>
              <p style={{ color: "#6366f1", fontWeight: 700 }}>No members yet</p>
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Approve join requests to add students.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {attendees.map((a, idx) => (
                <div key={a.studentId} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: a.present ? "#f0fdf4" : "#f8fafc",
                  border: `1.5px solid ${a.present ? "#bbf7d0" : "#e8e8f0"}`,
                  borderRadius: 14, padding: "12px 16px",
                  flexWrap: "wrap", transition: "all .2s",
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: a.present ? "#dcfce7" : "#eef2ff",
                    border: `2px solid ${a.present ? "#bbf7d0" : "#e0e7ff"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14,
                    color: a.present ? "#15803d" : "#6366f1",
                    flexShrink: 0,
                  }}>
                    {a.name[0].toUpperCase()}
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ fontWeight: 700, fontSize: 13.5, color: "#1e1b4b", margin: "0 0 2px" }}>{a.name}</p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{a.email}</p>
                  </div>

                  {/* Present toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={!!a.present}
                      onChange={e => updateAttendee(idx, "present", e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: a.present ? "#15803d" : "#6b7280" }}>
                      {a.present ? "Present ✓" : "Absent"}
                    </span>
                  </label>

                  {/* Points */}
                  <input
                    type="number" min={0} max={100}
                    placeholder="Points"
                    value={a.points || ""}
                    onChange={e => updateAttendee(idx, "points", e.target.value)}
                    style={{
                      width: 80, padding: "7px 10px",
                      border: "1.5px solid #e8e8f0", borderRadius: 10,
                      fontSize: 13, color: "#1e1b4b", background: "#fff",
                      outline: "none", textAlign: "center",
                    }}
                  />

                  {/* Reason */}
                  <select
                    value={a.reason}
                    onChange={e => updateAttendee(idx, "reason", e.target.value)}
                    style={{
                      padding: "7px 10px",
                      border: "1.5px solid #e8e8f0", borderRadius: 10,
                      fontSize: 13, color: "#1e1b4b", background: "#fff",
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="participation">Participation</option>
                    <option value="organizer">Organizer</option>
                    <option value="winner">Winner 🏆</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: msgType === "success" ? "#dcfce7" : "#fee2e2",
            border: `1.5px solid ${msgType === "success" ? "#bbf7d0" : "#fecaca"}`,
            borderRadius: 14, padding: "14px 18px",
            color: msgType === "success" ? "#15803d" : "#dc2626",
            fontWeight: 600, fontSize: 14, marginBottom: 16,
          }}>
            {message}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%", padding: "14px 0",
            background: submitting ? "#a5b4fc" : "#6366f1",
            color: "#fff", fontWeight: 800, fontSize: 16,
            border: "none", borderRadius: 16, cursor: submitting ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px #6366f133",
            transition: "all .2s",
          }}
        >
          {submitting ? "Saving…" : " Save Attendance & Coordinator"}
        </button>
      </div>
    </DashboardLayout>
  );
}