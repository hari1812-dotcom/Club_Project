import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORY_META = {
  "Technical":           { icon: "⚙️",  color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" },
  "Cultural & Creative": { icon: "🎨",  color: "#ec4899", bg: "#fff0f6", border: "#fce7f3" },
  "Social":              { icon: "🤝",  color: "#10b981", bg: "#ecfdf5", border: "#d1fae5" },
  "Civic":               { icon: "🏛️", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
};

function MemberModal({ member, meta, onClose }) {
  const fields = [
    { label: "Full Name",        value: member.name,    icon: "👤" },
    { label: "Email",            value: member.email,   icon: "📧" },
    { label: "Phone",            value: member.phone,   icon: "📞" },
    { label: "Year of Study",    value: member.year ? `${member.year}${["st","nd","rd","th"][member.year-1]||"th"} Year` : "—", icon: "🎓" },
    { label: "Register Number",  value: member.regNo,   icon: "🪪" },
    { label: "Reason to Join",   value: member.reason,  icon: "💬" },
    { label: "Joined On",        value: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—", icon: "📅" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(15,13,40,.55)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 300, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 22,
        width: "100%", maxWidth: 460,
        boxShadow: "0 24px 60px rgba(0,0,0,.18)",
        overflow: "hidden",
        animation: "modalSlide .25s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg,${meta.color},${meta.color}cc)`,
          padding: "20px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "rgba(255,255,255,.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 20, color: "#fff",
            }}>
              {(member.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,.75)", fontSize: 11, fontWeight: 600, margin: 0 }}>MEMBER DETAILS</p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, margin: 0 }}>{member.name}</h3>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.2)", border: "none",
            color: "#fff", borderRadius: 8, width: 30, height: 30,
            cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Fields */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map(f => (
            <div key={f.label} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 14px",
              background: "#f8fafc", borderRadius: 12,
              border: "1.5px solid #e8e8f0",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px", margin: "0 0 2px" }}>{f.label}</p>
                <p style={{ fontSize: 14, color: "#1e1b4b", fontWeight: 600, margin: 0 }}>{f.value || "—"}</p>
              </div>
            </div>
          ))}

          <span style={{
            display: "inline-block", alignSelf: "flex-start",
            background: "#dcfce7", color: "#15803d",
            fontSize: 12, fontWeight: 700,
            padding: "4px 14px", borderRadius: 50,
            border: "1px solid #bbf7d0", marginTop: 4,
          }}>✓ Active Member</span>
        </div>
      </div>
    </div>
  );
}

export default function FacultyClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    clubsApi.facultyClubs().then(setClubs).catch(() => setClubs([])).finally(() => setLoading(false));
  }, []);

  const meta = (cat) => CATEGORY_META[cat] || { icon: "🏫", color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" };

  const handleSelectClub = async (club) => {
    setDetailLoading(true);
    try {
      const detailed = await clubsApi.clubMembers(club._id);
      setSelected(detailed);
    } catch {
      setSelected(club);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout title="My Clubs">
      <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading clubs…</div>
    </DashboardLayout>
  );

  // ── Club Detail View ──
  if (selected) {
    const m = meta(selected.category);
    const members = selected.members || [];
    return (
      <DashboardLayout title="Club Detail">
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
          @keyframes modalSlide { from{opacity:0;transform:scale(.94) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        `}</style>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Back */}
          <button onClick={() => setSelected(null)} style={{
            background: m.bg, border: `1.5px solid ${m.border}`,
            borderRadius: 12, padding: "8px 18px",
            color: m.color, fontWeight: 700, fontSize: 13,
            cursor: "pointer", marginBottom: 24,
          }}>← Back to My Clubs</button>

          {/* Club header */}
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #e8e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,.07)",
            overflow: "hidden", marginBottom: 24,
            animation: "fadeUp .4s ease both",
          }}>
            <div style={{
              background: `linear-gradient(135deg,${m.color}22,${m.color}44)`,
              borderBottom: `2px solid ${m.border}`,
              padding: "24px 28px",
              display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: m.bg, border: `2px solid ${m.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: "#1e1b4b", margin: "0 0 4px" }}>{selected.name}</h2>
                <span style={{
                  background: m.bg, border: `1px solid ${m.border}`,
                  color: m.color, fontSize: 11, fontWeight: 700,
                  padding: "2px 12px", borderRadius: 50,
                }}>{selected.category}</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Members",   value: members.length,                              bg: "#dbeafe", color: "#1d4ed8" },
                  { label: "Capacity",  value: selected.maxCapacity || 100,                 bg: "#dcfce7", color: "#15803d" },
                  { label: "Slots left",value: (selected.maxCapacity || 100) - members.length, bg: "#fef9c3", color: "#b45309" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: s.bg, borderRadius: 14,
                    padding: "10px 18px", textAlign: "center",
                  }}>
                    <div style={{ fontWeight: 900, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "16px 28px" }}>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{selected.description}</p>
            </div>
          </div>

          {/* Members list */}
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #e8e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,.07)",
            padding: "24px 28px",
            animation: "fadeUp .4s .1s ease both",
          }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1e1b4b", margin: "0 0 6px" }}>
              👥 Current Members ({members.length})
            </h3>
            <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 18px" }}>
              Click any member to view their full details
            </p>

            {members.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                background: "#f8fafc", borderRadius: 14,
                border: "1.5px dashed #e0e7ff",
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👤</div>
                <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 14 }}>No members yet</p>
                <p style={{ color: "#9ca3af", fontSize: 13 }}>Approve join requests to add students.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {members.map((member, i) => (
                  <div
                    key={member._id || i}
                    onClick={() => setSelectedMember(member)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      background: "#f8fafc", borderRadius: 14,
                      padding: "12px 18px",
                      border: "1.5px solid #e8e8f0",
                      cursor: "pointer",
                      transition: "all .2s",
                      animation: `fadeUp .3s ${i * 0.05}s ease both`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = m.bg;
                      e.currentTarget.style.borderColor = m.color;
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#e8e8f0";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: m.bg, border: `2px solid ${m.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 16, color: m.color, flexShrink: 0,
                    }}>
                      {(member.name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", margin: "0 0 2px" }}>{member.name}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{member.email}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {member.year && (
                        <span style={{
                          background: "#eef2ff", color: "#6366f1",
                          fontSize: 11, fontWeight: 700,
                          padding: "2px 10px", borderRadius: 50,
                        }}>Year {member.year}</span>
                      )}
                      {member.regNo && (
                        <span style={{
                          background: "#f1f5f9", color: "#64748b",
                          fontSize: 11, fontWeight: 700,
                          padding: "2px 10px", borderRadius: 50,
                        }}>{member.regNo}</span>
                      )}
                      <span style={{
                        background: "#dcfce7", color: "#15803d",
                        fontSize: 11, fontWeight: 700,
                        padding: "3px 12px", borderRadius: 50,
                      }}>Active ✓</span>
                      <span style={{ color: "#9ca3af", fontSize: 16 }}>→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Member detail modal */}
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            meta={m}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </DashboardLayout>
    );
  }

  // ── Clubs List View ──
  return (
    <DashboardLayout title="My Clubs">
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 5px" }}>My Clubs</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {clubs.length} club{clubs.length !== 1 ? "s" : ""} assigned to you — click any to see members
          </p>
        </div>

        {detailLoading && (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading club details…</div>
        )}

        {clubs.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "#f8fafc", borderRadius: 20,
            border: "1.5px dashed #e0e7ff",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏫</div>
            <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 15 }}>No clubs assigned yet</p>
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Contact admin to assign clubs.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {clubs.map((club, i) => {
              const m = meta(club.category);
              const memberCount = (club.members || []).length;
              const pct = Math.round((memberCount / (club.maxCapacity || 100)) * 100);
              return (
                <div
                  key={club._id}
                  onClick={() => handleSelectClub(club)}
                  style={{
                    background: "#fff", borderRadius: 20,
                    border: "1.5px solid #e8e8f0",
                    boxShadow: "0 2px 10px rgba(0,0,0,.05)",
                    overflow: "hidden", cursor: "pointer",
                    transition: "all .22s",
                    animation: `fadeUp .4s ${i * 0.08}s ease both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 10px 28px ${m.color}22`;
                    e.currentTarget.style.borderColor = m.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,.05)";
                    e.currentTarget.style.borderColor = "#e8e8f0";
                  }}
                >
                  <div style={{ height: 6, background: `linear-gradient(90deg,${m.color},${m.color}88)` }} />
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 13,
                        background: m.bg, border: `1.5px solid ${m.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, flexShrink: 0,
                      }}>{m.icon}</div>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 4px" }}>{club.name}</h3>
                        <span style={{
                          background: m.bg, color: m.color,
                          fontSize: 10, fontWeight: 700,
                          padding: "2px 10px", borderRadius: 50,
                          border: `1px solid ${m.border}`,
                        }}>{club.category}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>Members</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{memberCount} / {club.maxCapacity || 100}</span>
                      </div>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${pct}%`,
                          background: `linear-gradient(90deg,${m.color},${m.color}bb)`,
                          borderRadius: 6,
                        }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{(club.maxCapacity || 100) - memberCount} slots left</span>
                      <span style={{ color: m.color, fontWeight: 700, fontSize: 12 }}>View details →</span>
                    </div>
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