import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

const STATUS_META = {
  Pending:  { bg: "#fef9c3", border: "#fde68a", color: "#b45309"},
  Approved: { bg: "#dcfce7", border: "#bbf7d0", color: "#15803d"},
  Rejected: { bg: "#fee2e2", border: "#fecaca", color: "#dc2626"},
};

export default function FacultyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    eventsApi.facultyEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const byStatus = (s) => events.filter(e => e.status === s);
  const tabs = ["Pending", "Approved", "Rejected"];

  return (
    <DashboardLayout title="Events">
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 5px" }}>Events</h1>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              {events.length} total event{events.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/faculty/events/new" style={{
            background: "#6366f1", color: "#fff",
            textDecoration: "none", fontWeight: 700, fontSize: 14,
            padding: "11px 22px", borderRadius: 14,
            boxShadow: "0 4px 14px #6366f144",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#4f46e5"}
            onMouseLeave={e => e.currentTarget.style.background = "#6366f1"}
          >
            + Create Event
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {tabs.map(tab => {
            const m = STATUS_META[tab];
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
                cursor: "pointer", transition: "all .2s",
                background: active ? m.bg : "#f1f5f9",
                border: `1.5px solid ${active ? m.border : "transparent"}`,
                color: active ? m.color : "#6b7280",
              }}>
                {m.icon} {tab} ({byStatus(tab).length})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading events…</div>
        ) : byStatus(activeTab).length === 0 ? (
          <div style={{
            textAlign: "center", padding: "50px 20px",
            background: "#f8fafc", borderRadius: 18,
            border: "1.5px dashed #e0e7ff",
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{STATUS_META[activeTab].icon}</div>
            <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 14 }}>No {activeTab.toLowerCase()} events</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {byStatus(activeTab).map((ev, i) => {
              const m = STATUS_META[ev.status] || STATUS_META.Pending;
              return (
                <div key={ev._id} style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1.5px solid #e8e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                  overflow: "hidden",
                  animation: `fadeUp .4s ${i * 0.07}s ease both`,
                }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${m.color}, ${m.color}66)` }} />
                  <div style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: m.bg, border: `1.5px solid ${m.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 5px" }}>{ev.description}</h3>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12.5, color: "#6b7280" }}>{ev.clubId?.name}</span>
                        <span style={{ fontSize: 12.5, color: "#6b7280" }}>{ev.venue}</span>
                        <span style={{ fontSize: 12.5, color: "#6b7280" }}>{new Date(ev.date).toLocaleString()}</span>
                      </div>
                      <span style={{
                        display: "inline-block", marginTop: 8,
                        background: m.bg, color: m.color,
                        fontSize: 11, fontWeight: 700,
                        padding: "2px 12px", borderRadius: 50,
                        border: `1px solid ${m.border}`,
                      }}>{m.icon} {ev.status}</span>
                    </div>
                    {ev.status === "Approved" && (
                      <Link to={`/faculty/events/${ev._id}/manage`} style={{
                        textDecoration: "none",
                        background: "#6366f1", color: "#fff",
                        fontWeight: 700, fontSize: 13,
                        padding: "9px 18px", borderRadius: 12,
                        flexShrink: 0, alignSelf: "center",
                        boxShadow: "0 3px 10px #6366f133",
                      }}>
                        Manage →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}