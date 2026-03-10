import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { name: "Technical"  },
  { name: "Cultural & Creative"},
  { name: "Social" },
  { name: "Civic" },
];

const TIPS = [
  "Attend 3 events this month to unlock a badge!",
  "You're only 50 points away from Gold tier!",
  "New clubs just opened for applications!",
  "Check out upcoming events in your clubs",
];

const STAT_CONFIG = [
  {
    label: "My Clubs",
    key: "clubs",
    link: "/student/my-clubs",
   
    accent: "#6366f1",
    frontBg: "linear-gradient(145deg,#eef2ff,#f5f3ff)",
    frontBorder: "#e0e7ff",
    frontShadow: "rgba(99,102,241,0.10)",
    backMsg: "Clubs you've joined appear here. Explore and join clubs that match your interests!",
  },
  {
    label: "Upcoming Events",
    key: "events",
    link: "/student/events",
  
    accent: "#8b5cf6",
    frontBg: "linear-gradient(145deg,#f5f3ff,#faf5ff)",
    frontBorder: "#ede9fe",
    frontShadow: "rgba(139,92,246,0.10)",
    backMsg: "Events from your clubs will show here. Stay tuned for exciting activities ahead!",
  },
  {
    label: "Pending Requests",
    key: "requests",
    link: "/student/my-clubs",
     
    accent: "#f59e0b",
    frontBg: "linear-gradient(145deg,#fffbeb,#fef9ee)",
    frontBorder: "#fde68a",
    frontShadow: "rgba(245,158,11,0.12)",
    backMsg: "Your pending membership requests are shown here. Approvals usually take 1–2 days.",
  },
];

function FlipCard({ label, link, icon, accent, frontBg, frontBorder, frontShadow, backMsg, value }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 900, cursor: "pointer", flex: "1 1 0", minWidth: 0 }}
    >
      <div
        style={{
          position: "relative",
          height: 160,
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: frontBg,
            border: `1px solid ${frontBorder}`,
            borderRadius: 18,
            padding: "20px 22px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: `0 4px 18px ${frontShadow}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${accent}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 21,
              }}
            >
              {icon}
            </div>
            <span style={{ fontSize: 10.5, color: "#b0b0c0", fontWeight: 500 }}>flip ↻</span>
          </div>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 5 }}>
              {label}
            </p>
            <p style={{ fontSize: 46, fontWeight: 800, color: accent, lineHeight: 1 }}>
              {value}
            </p>
          </div>
        </div>

        {/* BACK */}
        <Link to={link} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg,#1e1b4b,#312e81)",
              borderRadius: 18,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "18px 20px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 26 }}>{icon}</span>
            <p style={{ fontSize: 12.5, color: "#c7d2fe", lineHeight: 1.55, margin: 0 }}>{backMsg}</p>
            <div
              style={{
                marginTop: 4,
                background: accent,
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 700,
                padding: "6px 18px",
                borderRadius: 50,
              }}
            >
              View →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clubs: 0, events: 0, requests: 0 });
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Promise.all([
      clubsApi.myClubs(),
      eventsApi.myEvents(),
      clubRequestsApi.myRequests(),
    ])
      .then(([clubs, events, requests]) => {
        setStats({
          clubs: clubs.length,
          events: events.length,
          requests: requests.filter((r) => r.status === "Pending").length,
        });
      })
      .catch(() => {});
  }, []);

  const points = user?.rewardPoints ?? 0;
  const maxPoints = 500;
  const progress = Math.min((points / maxPoints) * 100, 100);
  const tier =
    points >= 400
      ? { label: "Gold",  text: "#92400e", bg: "#fde68a" }
      : points >= 200
      ? { label: "Silver", text: "#374151", bg: "#f3f4f6" }
      : { label: "Bronze", text: "#92400e", bg: "#fef3c7" };

  return (
    <DashboardLayout title="Student Dashboard">
      <>
        <style>{`
          @keyframes sdFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .sd-cat-link { display:flex; align-items:center; gap:10px; padding:13px 16px; background:#fff; border:1px solid #ededf5; border-radius:14px; font-size:13.5px; font-weight:600; color:#374151; text-decoration:none; transition:all 0.18s; }
          .sd-cat-link:hover { border-color:#c7d2fe; background:#f5f3ff; }
          .sd-action-btn { display:flex; align-items:center; gap:8px; padding:10px 18px; background:#fff; border:1px solid #ededf5; border-radius:50px; font-size:13.5px; font-weight:600; color:#374151; text-decoration:none; box-shadow:0 1px 4px rgba(0,0,0,0.05); transition:all 0.18s; }
          .sd-action-btn:hover { background:#eef2ff; border-color:#c7d2fe; }
        `}</style>

        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Welcome Banner */}
          <div
            style={{
              background: "linear-gradient(130deg,#6366f1 0%,#7c3aed 55%,#a78bfa 100%)",
              borderRadius: 20,
              padding: "22px 28px",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              boxShadow: "0 6px 24px rgba(99,102,241,0.28)",
              animation: "sdFadeUp 0.35s ease both",
            }}
          >
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 5 }}>
                Welcome back, {user?.name || "Student"} 
              </p>
              <p style={{ fontSize: 13.5, opacity: 0.82, fontWeight: 400 }}>
                Explore clubs, join events, and earn rewards — your campus journey starts here.
              </p>
            </div>
            <Link
              to="/student/events"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: 50,
                padding: "9px 20px",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
               View Events
            </Link>
          </div>

          {/* Tip Banner */}
          <div
            style={{
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: 14,
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "sdFadeUp 0.4s 0.05s ease both",
            }}
          >
            <span style={{ fontSize: 16 }}></span>
            <p key={tipIndex} style={{ fontSize: 13.5, color: "#4338ca", fontWeight: 500, margin: 0 }}>
              {TIPS[tipIndex]}
            </p>
          </div>

          {/* Flip Stat Cards */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              animation: "sdFadeUp 0.4s 0.1s ease both",
            }}
          >
            {STAT_CONFIG.map((cfg) => (
              <FlipCard key={cfg.key} {...cfg} value={stats[cfg.key]} />
            ))}
          </div>

          {/* Reward Points */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #ededf5",
              padding: "24px 28px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              animation: "sdFadeUp 0.4s 0.15s ease both",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                  Reward Points
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 46, fontWeight: 800, color: "#6366f1", lineHeight: 1 }}>{points}</span>
                  <span style={{ fontSize: 16, color: "#9ca3af" }}>/ {maxPoints}</span>
                </div>
              </div>
              <div
                style={{
                  background: tier.bg,
                  color: tier.text,
                  padding: "8px 18px",
                  borderRadius: 50,
                  fontSize: 13.5,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: `1px solid ${tier.text}22`,
                  alignSelf: "flex-start",
                }}
              >
                {tier.icon} {tier.label}
              </div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, color: "#6b7280" }}>Progress to next tier</span>
                <span style={{ fontSize: 12.5, color: "#6366f1", fontWeight: 700 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 8, background: "#f0f0f8", borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                    borderRadius: 100,
                    transition: "width 1s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: "#f5f3ff",
                borderRadius: 10,
                padding: "9px 14px",
                fontSize: 13,
                color: "#6366f1",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginTop: 10,
              }}
            >
              <span></span>
              Participate in club events to earn more points and climb the tiers!
            </div>
          </div>

          {/* Browse by Category */}
          <div style={{ animation: "sdFadeUp 0.4s 0.2s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Browse by Category</h2>
              <Link to="/student/clubs" style={{ fontSize: 12.5, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
                View all →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/student/clubs?category=${encodeURIComponent(cat.name)}`}
                  className="sd-cat-link"
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ animation: "sdFadeUp 0.4s 0.25s ease both" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 12 }}>Quick Actions</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "Explore Clubs", link: "/student/clubs"  },
                { label: "My Events", link: "/student/events" },
                { label: "My Clubs", link: "/student/my-clubs"  },
              ].map((action) => (
                <Link key={action.label} to={action.link} className="sd-action-btn">
                  <span style={{ fontSize: 15 }}>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </>
    </DashboardLayout>
  );
}