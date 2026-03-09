import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubRequestsApi } from "../../api/api";

export default function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState({});
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    clubRequestsApi.facultyRequests()
      .then(setRequests).catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (reqId, status) => {
    setUpdating(reqId);
    try {
      await clubRequestsApi.updateStatus(reqId, status, reason[reqId] || "");
      setRequests(prev => prev.map(r => r._id === reqId ? { ...r, status } : r));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const pending = requests.filter(r => r.status === "Pending");
  const done = requests.filter(r => r.status !== "Pending");

  return (
    <DashboardLayout title="Join Requests">
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 5px" }}>Join Requests</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {pending.length} pending request{pending.length !== 1 ? "s" : ""} awaiting your decision
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading…</div>
        ) : (
          <>
            {/* Pending */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  background: "#fef9c3", border: "1.5px solid #fde68a",
                  borderRadius: 10, padding: "4px 14px",
                  fontSize: 12, fontWeight: 700, color: "#b45309",
                }}>
                  ⏳ Pending — {pending.length}
                </div>
              </div>

              {pending.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "50px 20px",
                  background: "#f8fafc", borderRadius: 18,
                  border: "1.5px dashed #e0e7ff",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 14 }}>All caught up!</p>
                  <p style={{ color: "#9ca3af", fontSize: 13 }}>No pending join requests.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {pending.map((r, i) => (
                    <div key={r._id} style={{
                      background: "#fff",
                      borderRadius: 18,
                      border: "1.5px solid #e8e8f0",
                      boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                      padding: "20px 24px",
                      animation: `fadeUp .4s ${i * 0.07}s ease both`,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                        {/* Avatar */}
                        <div style={{
                          width: 46, height: 46, borderRadius: "50%",
                          background: "#eef2ff", border: "2px solid #e0e7ff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 18, color: "#6366f1", flexShrink: 0,
                        }}>
                          {(r.studentId?.name || "?")[0].toUpperCase()}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 3px" }}>
                            {r.studentId?.name}
                          </h3>
                          <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 6px" }}>{r.studentId?.email}</p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{
                              background: "#eef2ff", color: "#6366f1",
                              fontSize: 11, fontWeight: 700,
                              padding: "2px 12px", borderRadius: 50,
                              border: "1px solid #e0e7ff",
                            }}>🏫 {r.clubId?.name}</span>
                            <span style={{
                              background: "#fef9c3", color: "#b45309",
                              fontSize: 11, fontWeight: 700,
                              padding: "2px 12px", borderRadius: 50,
                              border: "1px solid #fde68a",
                            }}>⏳ Pending</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                          <input
                            type="text"
                            placeholder="Reason (optional for reject)"
                            style={{
                              padding: "8px 12px",
                              border: "1.5px solid #e8e8f0",
                              borderRadius: 10, fontSize: 12.5,
                              color: "#374151", outline: "none",
                              width: "100%", boxSizing: "border-box",
                            }}
                            value={reason[r._id] || ""}
                            onChange={e => setReason(prev => ({ ...prev, [r._id]: e.target.value }))}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => handleStatus(r._id, "Approved")}
                              disabled={updating === r._id}
                              style={{
                                flex: 1, padding: "9px 0",
                                background: "#dcfce7", border: "1.5px solid #bbf7d0",
                                borderRadius: 10, color: "#15803d",
                                fontWeight: 700, fontSize: 13, cursor: "pointer",
                                opacity: updating === r._id ? .6 : 1,
                                transition: "all .2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#bbf7d0"}
                              onMouseLeave={e => e.currentTarget.style.background = "#dcfce7"}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleStatus(r._id, "Rejected")}
                              disabled={updating === r._id}
                              style={{
                                flex: 1, padding: "9px 0",
                                background: "#fee2e2", border: "1.5px solid #fecaca",
                                borderRadius: 10, color: "#dc2626",
                                fontWeight: 700, fontSize: 13, cursor: "pointer",
                                opacity: updating === r._id ? .6 : 1,
                                transition: "all .2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#fecaca"}
                              onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Done requests */}
            {done.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{
                    background: "#f1f5f9", borderRadius: 10, padding: "4px 14px",
                    fontSize: 12, fontWeight: 700, color: "#64748b",
                  }}>
                    📋 Processed — {done.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {done.map((r, i) => (
                    <div key={r._id} style={{
                      background: "#f8fafc",
                      borderRadius: 14,
                      border: "1.5px solid #e8e8f0",
                      padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 12,
                      animation: `fadeUp .3s ${i * 0.05}s ease both`,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: r.status === "Approved" ? "#dcfce7" : "#fee2e2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0,
                      }}>
                        {r.status === "Approved" ? "✓" : "✕"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 13.5, color: "#374151", margin: "0 0 2px" }}>{r.studentId?.name}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{r.clubId?.name}</p>
                      </div>
                      <span style={{
                        background: r.status === "Approved" ? "#dcfce7" : "#fee2e2",
                        color: r.status === "Approved" ? "#15803d" : "#dc2626",
                        fontSize: 11, fontWeight: 700,
                        padding: "3px 12px", borderRadius: 50,
                      }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}