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
    clubsApi.facultyClubs().then(list => {
      setClubs(list);
      if (list.length) setForm(f => ({ ...f, clubId: list[0]._id }));
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.clubId || !form.venue || !form.date || !form.description) {
      setError("All fields are required."); return;
    }
    setSubmitting(true);
    try {
      await eventsApi.create(form);
      navigate("/faculty/events");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid #e8e8f0", borderRadius: 12,
    fontSize: 14, color: "#1e1b4b", outline: "none",
    background: "#f8fafc", boxSizing: "border-box",
    transition: "border-color .2s",
  };

  const labelStyle = {
    display: "block", fontWeight: 700,
    fontSize: 13, color: "#374151", marginBottom: 6,
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <DashboardLayout title="Create Event">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .ev-input:focus { border-color: #6366f1 !important; background: #fff !important; }
      `}</style>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 5px" }}>Create Event</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            Fill in the details — admin will review and approve before students see it.
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "#fff", borderRadius: 22,
          border: "1.5px solid #e8e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,.07)",
          padding: "32px 32px",
          animation: "fadeUp .4s ease both",
        }}>
          {/* Club selector */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>🏫 Select Club</label>
            <select
              value={form.clubId}
              onChange={e => set("clubId", e.target.value)}
              className="ev-input"
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select club</option>
              {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>📝 Event Title / Description</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              className="ev-input"
              style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
              placeholder="e.g. Annual Hackathon 2025 — 24-hour coding event for all members"
            />
          </div>

          {/* Venue */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>📍 Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={e => set("venue", e.target.value)}
              className="ev-input"
              style={inputStyle}
              placeholder="e.g. Main Auditorium, Room 204"
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>🗓️ Date & Time</label>
            <input
              type="datetime-local"
              value={form.date}
              min={minDate}
              onChange={e => set("date", e.target.value)}
              className="ev-input"
              style={inputStyle}
            />
            {form.date && (
              <p style={{ fontSize: 12, color: "#6366f1", marginTop: 6, fontWeight: 600 }}>
                📅 {new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {new Date(form.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {error && (
            <div style={{
              background: "#fee2e2", border: "1.5px solid #fecaca",
              borderRadius: 12, padding: "12px 16px",
              color: "#dc2626", fontSize: 13, fontWeight: 600,
              marginBottom: 20,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                flex: 1, padding: "13px 0",
                background: submitting ? "#a5b4fc" : "#6366f1",
                color: "#fff", fontWeight: 800, fontSize: 15,
                border: "none", borderRadius: 14, cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px #6366f133",
                transition: "all .2s",
              }}
            >
              {submitting ? "Submitting…" : "🚀 Submit for Approval"}
            </button>
            <button
              onClick={() => navigate("/faculty/events")}
              style={{
                padding: "13px 22px",
                background: "#f1f5f9", color: "#374151",
                fontWeight: 700, fontSize: 14,
                border: "1.5px solid #e8e8f0", borderRadius: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16, textAlign: "center" }}>
            Events are reviewed by admin before becoming visible to students.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}