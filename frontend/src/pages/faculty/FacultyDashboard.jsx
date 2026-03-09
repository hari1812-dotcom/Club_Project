import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi, eventsApi } from "../../api/api";

const STAT_CARDS = [
  {
    key: "clubs",
    label: "Clubs I Manage",
    icon: "🏫",
    to: "/faculty/clubs",
    gradient: "linear-gradient(135deg,#6366f1,#818cf8)",
    light: "#eef2ff",
    border: "#e0e7ff",
    accent: "#6366f1",
    desc: "Active clubs under your supervision",
  },
  {
    key: "requests",
    label: "Pending Requests",
    icon: "📋",
    to: "/faculty/requests",
    gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    light: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
    desc: "Join requests awaiting your approval",
  },
  {
    key: "events",
    label: "Events",
    icon: "📅",
    to: "/faculty/events",
    gradient: "linear-gradient(135deg,#10b981,#34d399)",
    light: "#ecfdf5",
    border: "#d1fae5",
    accent: "#10b981",
    desc: "Upcoming & ongoing club events",
  },
];

function StatCard({ card, value, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={card.to}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: "#fff",
          border: `2px solid ${hovered ? card.accent : "#ececf4"}`,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: hovered
            ? `0 14px 40px ${card.accent}28`
            : "0 2px 12px rgba(0,0,0,.06)",
          transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "all .26s cubic-bezier(.4,.2,.2,1)",
          animation: `fadeUp .5s ${index * 0.1}s ease both`,
          cursor: "pointer",
        }}
      >
        {/* Gradient top */}
        <div
          style={{
            background: card.gradient,
            padding: "26px 24px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", right: -20, top: -20,
            width: 90, height: 90, borderRadius: "50%",
            background: "rgba(255,255,255,.12)",
          }} />
          <div style={{
            position: "absolute", right: 24, bottom: -28,
            width: 55, height: 55, borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
          }} />

          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", position: "relative",
          }}>
            <span style={{ fontSize: 38, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.18))" }}>
              {card.icon}
            </span>
            <span style={{
              background: "rgba(255,255,255,.22)",
              color: "#fff",
              fontSize: 32,
              fontWeight: 900,
              padding: "2px 14px",
              borderRadius: 14,
              letterSpacing: "-1px",
              lineHeight: 1.3,
            }}>
              {value}
            </span>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ padding: "16px 22px 20px" }}>
          <p style={{
            fontWeight: 800, fontSize: 15,
            color: "#1e1b4b", margin: "0 0 5px",
            letterSpacing: "-.3px",
          }}>
            {card.label}
          </p>
          <p style={{
            fontSize: 12, color: "#9ca3af",
            margin: "0 0 14px", lineHeight: 1.5,
          }}>
            {card.desc}
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            color: card.accent, fontWeight: 700, fontSize: 13,
          }}>
            View all
            <span style={{
              display: "inline-block",
              transform: hovered ? "translateX(5px)" : "translateX(0)",
              transition: "transform .2s",
              fontSize: 15,
            }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ clubs: 0, requests: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clubsApi.facultyClubs(),
      clubRequestsApi.facultyRequests(),
      eventsApi.facultyEvents(),
    ])
      .then(([clubs, requests, events]) => {
        const pending = requests.filter((r) => r.status === "Pending");
        setStats({ clubs: clubs.length, requests: pending.length, events: events.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Faculty Dashboard">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
          borderRadius: 22,
          padding: "28px 32px",
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 8px 32px rgba(30,27,75,.28)",
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp .4s ease both",
        }}>
          {/* BG decorations */}
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }} />
          <div style={{
            position: "absolute", right: 80, bottom: -50,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,255,255,.04)",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
            }}>
              <span style={{ fontSize: 28 }}>👨‍🏫</span>
              <span style={{
                background: "rgba(165,180,252,.18)",
                color: "#a5b4fc",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 50,
                letterSpacing: ".5px",
                textTransform: "uppercase",
              }}>
                Faculty Portal
              </span>
            </div>
            <h2 style={{
              color: "#fff", fontWeight: 900,
              fontSize: 22, margin: "0 0 6px",
              letterSpacing: "-.5px",
            }}>
              Welcome back! 👋
            </h2>
            <p style={{ color: "#a5b4fc", fontSize: 13.5, margin: 0 }}>
              Here's a snapshot of your club activities
            </p>
          </div>

          {/* Live badge */}
          <div style={{
            background: "rgba(255,255,255,.08)",
            border: "1.5px solid rgba(255,255,255,.16)",
            borderRadius: 14,
            padding: "12px 20px",
            textAlign: "center",
            position: "relative",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 0 3px rgba(52,211,153,.25)",
                display: "inline-block",
              }} />
              <span style={{ color: "#6ee7b7", fontSize: 11, fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>
              {stats.clubs + stats.requests + stats.events}
            </p>
            <p style={{ color: "#a5b4fc", fontSize: 11, margin: "2px 0 0" }}>Total items</p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div style={{
            textAlign: "center", padding: 60,
            color: "#9ca3af", fontSize: 14,
          }}>
            Loading dashboard…
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 22,
          }}>
            {STAT_CARDS.map((card, i) => (
              <StatCard
                key={card.key}
                card={card}
                value={stats[card.key]}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div style={{
          marginTop: 32,
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #e8e8f0",
          padding: "22px 26px",
          boxShadow: "0 2px 12px rgba(0,0,0,.05)",
          animation: "fadeUp .5s .35s ease both",
        }}>
          <h3 style={{
            fontWeight: 800, fontSize: 14,
            color: "#1e1b4b", marginBottom: 16,
            letterSpacing: "-.2px",
          }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Manage Clubs", to: "/faculty/clubs", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff", icon: "🏫" },
              { label: "Review Requests", to: "/faculty/requests", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "📋" },
              { label: "View Events", to: "/faculty/events", color: "#10b981", bg: "#ecfdf5", border: "#d1fae5", icon: "📅" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                style={{
                  textDecoration: "none",
                  background: action.bg,
                  border: `1.5px solid ${action.border}`,
                  borderRadius: 12,
                  padding: "10px 18px",
                  color: action.color,
                  fontWeight: 700,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all .2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 6px 16px ${action.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}