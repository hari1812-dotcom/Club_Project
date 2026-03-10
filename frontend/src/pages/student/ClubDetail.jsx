import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_META = {
  "Technical":          {  accent: "#6366f1", light: "#eef2ff", border: "#e0e7ff" },
  "Cultural & Creative":{ accent: "#ec4899", light: "#fff0f6", border: "#fce7f3" },
  "Social":             { accent: "#10b981", light: "#ecfdf5", border: "#d1fae5" },
  "Civic":              { accent: "#f59e0b", light: "#fffbeb", border: "#fde68a" },
};

// ── Join Modal ────────────────────────────────────────────────────────────────
function JoinModal({ club, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    year: "",
    regNo: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const meta = CATEGORY_META[club?.category] || CATEGORY_META["Technical"];

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.phone || !form.year || !form.regNo || !form.reason) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    clubRequestsApi
      .create({
        clubId: club._id,
        phone: form.phone,
        year: Number(form.year),
        regNo: form.regNo,
        reason: form.reason,
      })
      .then(() => onSuccess())
      .catch((err) => setError(err.message || "Submission failed. Please try again."))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,13,40,.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 16,
        animation: "modalBg .2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff", borderRadius: 22,
          width: "100%", maxWidth: 500,
          boxShadow: "0 24px 60px rgba(0,0,0,.18)",
          overflow: "hidden",
          animation: "modalSlide .25s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg,${meta.accent},${meta.accent}cc)`,
            padding: "22px 24px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
              REQUEST TO JOIN
            </p>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{club.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.2)", border: "none",
              color: "#fff", borderRadius: 8, width: 30, height: 30,
              cursor: "pointer", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Name + Email (pre-filled, read-only) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input name="name" value={form.name} readOnly style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280" }} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" value={form.email} readOnly style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280" }} />
            </div>
          </div>

          {/* Phone + Year */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Phone Number <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="e.g. 9876543210" type="tel"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Year of Study <span style={{ color: "#ef4444" }}>*</span></label>
              <select name="year" value={form.year} onChange={handleChange} style={inputStyle}>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          {/* Register Number */}
          <div>
            <label style={labelStyle}>Register Number <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              name="regNo" value={form.regNo} onChange={handleChange}
              placeholder="e.g. 22CS001"
              style={inputStyle}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={labelStyle}>Reason to Join <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              name="reason" value={form.reason} onChange={handleChange}
              placeholder="Tell us why you want to join this club…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: "11px 0", background: "#f3f4f6",
                border: "none", borderRadius: 12, fontWeight: 600,
                color: "#374151", cursor: "pointer", fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              style={{
                flex: 2, padding: "11px 0",
                background: submitting ? `${meta.accent}88` : meta.accent,
                border: "none", borderRadius: 12, fontWeight: 700,
                color: "#fff", cursor: submitting ? "not-allowed" : "pointer",
                fontSize: 14, transition: "background .2s",
              }}
            >
              {submitting ? "Submitting…" : "Submit Request "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 };
const inputStyle = {
  width: "100%", padding: "9px 12px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 13.5, color: "#1f2937",
  background: "#fff", outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color .2s",
};

// ── Info Pill ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 17, marginTop: 1 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clubsApi.getById(id),
      clubRequestsApi.myRequests(),
    ]).then(([clubData, requests]) => {
      setClub(clubData);
      const r = requests.find((x) => x.clubId?._id === id || x.clubId === id);
      setRequestStatus(r?.status || null);
    }).catch(() => setClub(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isMember = club?.members?.some((m) => (m._id || m) === user?.id) || false;
  const meta = CATEGORY_META[club?.category] || CATEGORY_META["Technical"];
  const faculty = club?.facultyIncharge;

  if (loading) {
    return (
      <DashboardLayout title="Club Detail">
        <div style={{ textAlign: "center", padding: 80, color: "#9ca3af" }}>Loading club details…</div>
      </DashboardLayout>
    );
  }

  if (!club) {
    return (
      <DashboardLayout title="Club Detail">
        <div style={{ textAlign: "center", padding: 80, color: "#9ca3af" }}>Club not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={club.name}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalBg { from{opacity:0} to{opacity:1} }
        @keyframes modalSlide { from{opacity:0;transform:scale(.94) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .detail-card { animation: fadeUp .4s ease both; }
        .join-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Hero banner ── */}
        <div
          className="detail-card"
          style={{
            background: `linear-gradient(135deg,${meta.accent},${meta.accent}bb)`,
            borderRadius: 20, padding: "26px 28px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: 16,
            boxShadow: `0 8px 28px ${meta.accent}33`,
            animationDelay: "0s",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, background: "rgba(255,255,255,.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {meta.icon}
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {club.category}
                </p>
                <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>{club.name}</h1>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: 13.5, lineHeight: 1.6, maxWidth: 500 }}>
              {club.description}
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.15)",
              borderRadius: 14, padding: "12px 18px",
              textAlign: "center", border: "1px solid rgba(255,255,255,.25)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>MEMBERS</p>
            <p style={{ color: "#fff", fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
              {club.members?.length ?? 0}
            </p>
            {club.memberLimit && (
              <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11.5, marginTop: 3 }}>/ {club.memberLimit} max</p>
            )}
          </div>
        </div>

        {/* ── Two column layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          {/* Equipment */}
          <div
            className="detail-card"
            style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8f0", padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.04)", animationDelay: "0.08s" }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
               Equipment & Resources
            </h3>
            {club.equipment?.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {club.equipment.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: meta.light, border: `1px solid ${meta.border}`,
                      color: meta.accent, borderRadius: 50,
                      padding: "5px 13px", fontSize: 12.5, fontWeight: 600,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>No equipment listed yet.</p>
            )}
          </div>

          {/* Activities */}
          <div
            className="detail-card"
            style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8f0", padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.04)", animationDelay: "0.12s" }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
               Club Activities
            </h3>
            {club.activities?.length > 0 ? (
              <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {club.activities.map((act, i) => (
                  <li
                    key={i}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151" }}
                  >
                    <span style={{ color: meta.accent, fontSize: 16, marginTop: 1, flexShrink: 0 }}></span>
                    {act}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>No activities listed yet.</p>
            )}
          </div>
        </div>

        {/* ── Faculty Incharge ── */}
        <div
          className="detail-card"
          style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8f0", padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.04)", animationDelay: "0.16s" }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
            👤 Faculty Incharge
          </h3>
          {faculty ? (
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {/* Avatar */}
              <div
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `linear-gradient(135deg,${meta.accent},${meta.accent}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 20, flexShrink: 0,
                }}
              >
                {faculty.name?.[0]?.toUpperCase() || "F"}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", marginBottom: 10 }}>{faculty.name}</p>
                <InfoRow label="Department" value={faculty.department} />
                <InfoRow label="Email" value={faculty.email} />
                <InfoRow label="Phone" value={faculty.phone} />
              </div>
            </div>
          ) : (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Incharge details not available.</p>
          )}
        </div>

        {/* ── Upcoming Events (if member) ── */}
        {club.upcomingEvents?.length > 0 && (
          <div
            className="detail-card"
            style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8f0", padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.04)", animationDelay: "0.2s" }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", marginBottom: 14 }}>📆 Upcoming Events</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {club.upcomingEvents.map((ev) => (
                <div
                  key={ev._id}
                  style={{
                    background: meta.light, border: `1px solid ${meta.border}`,
                    borderRadius: 12, padding: "12px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13.5, color: "#1e1b4b" }}>{ev.title || ev.description}</p>
                    {ev.venue && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>  {ev.venue}</p>}
                  </div>
                  <span style={{ background: meta.accent, color: "#fff", fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 50 }}>
                    {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Join / Status section ── */}
        <div
          className="detail-card"
          style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8f0", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,.04)", animationDelay: "0.24s" }}
        >
          {isMember || requestStatus === "Approved" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, background: "#ecfdf5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}> </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#065f46" }}>You're a member!</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>You can view upcoming events from My Clubs.</p>
              </div>
            </div>
          ) : requestStatus === "Pending" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, background: "#fffbeb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#92400e" }}>Request Pending</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>Your join request is awaiting approval from the club incharge.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", marginBottom: 4 }}>Interested in joining?</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>Submit a request and the club incharge will review it.</p>
              </div>
              <button
                className="join-btn"
                onClick={() => setShowModal(true)}
                style={{
                  background: `linear-gradient(135deg,${meta.accent},${meta.accent}cc)`,
                  color: "#fff", border: "none", borderRadius: 14,
                  padding: "13px 28px", fontWeight: 800, fontSize: 14.5,
                  cursor: "pointer", boxShadow: `0 4px 16px ${meta.accent}44`,
                  transition: "all .2s",
                  whiteSpace: "nowrap",
                }}
              >
                  Request to Join
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Join Modal ── */}
      {showModal && (
        <JoinModal
          club={club}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setRequestStatus("Pending");
            setShowModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}