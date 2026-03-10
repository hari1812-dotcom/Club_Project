import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi } from "../../api/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    clubId: "",
    venue: "",
    date: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clubsApi
      .facultyClubs()
      .then((list) => {
        setClubs(list);
        if (list.length > 0) {
          setForm((f) => ({ ...f, clubId: list[0]._id }));
        }
      })
      .catch(() => {});
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  const inputBase = {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelBase = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  };

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <DashboardLayout title="Create Event">
      <style>{`
        .form-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }
      `}</style>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            Create New Event
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px", margin: 0 }}>
            Events must be reviewed and approved by admin before students can see them.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
            padding: "32px",
          }}
        >
          {/* Club */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelBase}>Club</label>
            <select
              value={form.clubId}
              onChange={(e) => updateField("clubId", e.target.value)}
              className="form-input"
              style={{ ...inputBase, cursor: "pointer" }}
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description / Title */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelBase}>Event Title / Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="form-input"
              style={{ ...inputBase, minHeight: "110px", resize: "vertical" }}
              placeholder="e.g. Annual Tech Symposium 2025 - 2-day innovation & coding challenge"
            />
          </div>

          {/* Venue */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelBase}>Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => updateField("venue", e.target.value)}
              className="form-input"
              style={inputBase}
              placeholder="e.g. Seminar Hall A, Academic Block - II"
            />
          </div>

          {/* Date & Time */}
          <div style={{ marginBottom: "32px" }}>
            <label style={labelBase}>Date and Time</label>
            <input
              type="datetime-local"
              value={form.date}
              min={minDate}
              onChange={(e) => updateField("date", e.target.value)}
              className="form-input"
              style={inputBase}
            />

            {form.date && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                Selected:{" "}
                <strong>
                  {new Date(form.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(form.date).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="error-box"
              style={{
                padding: "14px 18px",
                borderRadius: "10px",
                marginBottom: "24px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                flex: "1",
                minWidth: "160px",
                padding: "14px 0",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: submitting ? "#a5b4fc" : "#6366f1",
                border: "none",
                borderRadius: "10px",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>

            <button
              onClick={() => navigate("/faculty/events")}
              style={{
                padding: "14px 28px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              Cancel
            </button>
          </div>

          <p
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "13px",
              color: "#9ca3af",
            }}
          >
            All events are reviewed by the administrator before publication.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}