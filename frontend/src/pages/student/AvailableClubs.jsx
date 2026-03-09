import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORY_META = {
  "Technical": {
    icon: "⚙️",
    desc: "Coding, science, math & open-source clubs",
    gradient: "linear-gradient(135deg,#6366f1,#818cf8)",
    light: "#eef2ff",
    border: "#e0e7ff",
    accent: "#6366f1",
  },
  "Cultural & Creative": {
    icon: "🎨",
    desc: "Arts, music, photography & Tamil culture",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    light: "#fff0f6",
    border: "#fce7f3",
    accent: "#ec4899",
  },
  "Social": {
    icon: "🤝",
    desc: "Community service, YRC, Rotaract & more",
    gradient: "linear-gradient(135deg,#10b981,#059669)",
    light: "#ecfdf5",
    border: "#d1fae5",
    accent: "#10b981",
  },
  "Civic": {
    icon: "🏛️",
    desc: "Women's cell, yoga, geography & leadership",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
    light: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
};

const CATEGORIES = Object.keys(CATEGORY_META);

// ── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({ category, count, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[category];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 22,
        overflow: "hidden",
        background: "#fff",
        border: `2px solid ${hovered ? meta.accent : "#ececf4"}`,
        boxShadow: hovered ? `0 12px 36px ${meta.accent}28` : "0 2px 12px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all .25s cubic-bezier(.4,.2,.2,1)",
        animation: `fadeUp .5s ${index * 0.1}s ease both`,
      }}
    >
      {/* Gradient top */}
      <div style={{
        background: meta.gradient,
        padding: "28px 24px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -18, top: -18,
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,.12)",
        }} />
        <div style={{
          position: "absolute", right: 16, bottom: -22,
          width: 50, height: 50, borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
        }} />
        <span style={{ fontSize: 42, display: "block", marginBottom: 10, position: "relative" }}>
          {meta.icon}
        </span>
        <span style={{
          color: "#fff", fontWeight: 800, fontSize: 16,
          letterSpacing: "-.3px", lineHeight: 1.2, display: "block",
          position: "relative",
        }}>
          {category}
        </span>
        <span style={{
          display: "inline-block",
          marginTop: 8,
          background: "rgba(255,255,255,.22)",
          color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "3px 12px", borderRadius: 50,
          position: "relative",
        }}>
          {count} club{count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Bottom */}
      <div style={{ padding: "16px 20px 18px" }}>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, margin: "0 0 14px" }}>
          {meta.desc}
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          color: meta.accent, fontWeight: 700, fontSize: 13,
        }}>
          Explore clubs
          <span style={{
            display: "inline-block",
            transform: hovered ? "translateX(5px)" : "translateX(0)",
            transition: "transform .2s", fontSize: 16,
          }}>→</span>
        </div>
      </div>
    </div>
  );
}

// ── Club Card ─────────────────────────────────────────────────────────────────
function ClubCard({ club, meta, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/student/clubs/${club._id}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? meta.accent : "#e8e8f0"}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        transition: "all .22s",
        boxShadow: hovered ? `0 8px 24px ${meta.accent}22` : "0 2px 8px rgba(0,0,0,.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        height: "100%",
        display: "flex", flexDirection: "column", gap: 10,
        animation: `fadeUp .4s ${index * 0.06}s ease both`,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: `linear-gradient(135deg,${meta.accent}22,${meta.accent}44)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          {meta.icon}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14.5, color: "#1e1b4b", marginBottom: 5 }}>
            {club.name}
          </h3>
          <p style={{
            fontSize: 12.5, color: "#6b7280", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {club.description}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            👥 {club.members?.length ?? 0} members
          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          color: meta.accent, fontWeight: 700, fontSize: 13,
        }}>
          View Details
          <span style={{
            fontSize: 15,
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            transition: "transform .2s", display: "inline-block",
          }}>→</span>
        </div>
      </div>
    </Link>
  );
}

// ── Clubs List View ───────────────────────────────────────────────────────────
function ClubsListView({ category, clubs, onBack }) {
  const meta = CATEGORY_META[category];

  return (
    <div style={{ animation: "fadeUp .35s ease both" }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        border: "1.5px solid #e8e8f0",
        borderRadius: 18,
        padding: "18px 24px",
        marginBottom: 24,
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
      }}>
        <button
          onClick={onBack}
          style={{
            background: meta.light,
            border: `1.5px solid ${meta.border}`,
            borderRadius: 12,
            padding: "8px 16px",
            color: meta.accent,
            fontWeight: 700, fontSize: 13,
            cursor: "pointer", flexShrink: 0,
          }}
        >
          ← Back
        </button>

        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: meta.gradient,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22, flexShrink: 0,
        }}>
          {meta.icon}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1e1b4b", margin: 0 }}>
            {category}
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
            {meta.desc} · {clubs.length} club{clubs.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div style={{
          background: meta.light, border: `1px solid ${meta.border}`,
          borderRadius: 50, padding: "5px 16px",
          fontSize: 12, color: meta.accent, fontWeight: 700, flexShrink: 0,
        }}>
          {clubs.length} clubs
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg,${meta.accent}44,transparent)`,
        borderRadius: 2, marginBottom: 20,
      }} />

      {/* Clubs grid */}
      {clubs.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: meta.light, borderRadius: 18,
          border: `1.5px dashed ${meta.border}`,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{meta.icon}</div>
          <p style={{ color: meta.accent, fontWeight: 700, fontSize: 15, marginBottom: 5 }}>
            No clubs yet
          </p>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>
            No clubs have been added to this category yet.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 18,
        }}>
          {clubs.map((club, i) => (
            <ClubCard key={club._id} club={club} meta={meta} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AvailableClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null); // null = show 4 category cards only

  useEffect(() => {
    clubsApi.getAll().then(setClubs).finally(() => setLoading(false));
  }, []);

  const byCategory = clubs.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});

  return (
    <DashboardLayout title="Available Clubs">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
          borderRadius: 22,
          padding: "24px 30px",
          marginBottom: 32,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 14,
          boxShadow: "0 6px 28px rgba(30,27,75,.28)",
          position: "relative", overflow: "hidden",
          animation: "fadeUp .4s ease both",
        }}>
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }} />
          <div>
            <h2 style={{
              color: "#fff", fontWeight: 800,
              fontSize: 20, marginBottom: 6, letterSpacing: "-.4px",
            }}>
              {selectedCat
                ? `${CATEGORY_META[selectedCat].icon} ${selectedCat} Clubs`
                : "🎓 Explore College Clubs"}
            </h2>
            <p style={{ color: "#a5b4fc", fontSize: 13.5, margin: 0 }}>
              {selectedCat
                ? `${byCategory[selectedCat]?.length ?? 0} clubs available in this category`
                : `${clubs.length} clubs across ${CATEGORIES.length} categories — find your community`}
            </p>
          </div>

          {selectedCat && (
            <button
              onClick={() => setSelectedCat(null)}
              style={{
                background: "rgba(255,255,255,.13)",
                border: "1.5px solid rgba(255,255,255,.28)",
                borderRadius: 50, padding: "8px 20px",
                color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}
            >
              ← All Categories
            </button>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 70, color: "#9ca3af", fontSize: 14 }}>
            Loading clubs…
          </div>
        ) : selectedCat ? (
          // ── Show clubs of selected category only ──
          <ClubsListView
            category={selectedCat}
            clubs={byCategory[selectedCat] || []}
            onBack={() => setSelectedCat(null)}
          />
        ) : (
          // ── Show only 4 category cards ──
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 22,
          }}>
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat}
                category={cat}
                count={byCategory[cat]?.length ?? 0}
                index={i}
                onClick={() => setSelectedCat(cat)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}