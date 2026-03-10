import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORY_META = {
  "Technical":           { color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" },
  "Cultural & Creative": { color: "#ec4899", bg: "#fff0f6", border: "#fce7f3" },
  "Social":              { color: "#10b981", bg: "#ecfdf5", border: "#d1fae5" },
  "Civic":               { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
};

function MemberModal({ member, meta, onClose }) {

  const fields = [
    { label: "Full Name", value: member.name },
    { label: "Email", value: member.email },
    { label: "Phone", value: member.phone },
    { label: "Year of Study", value: member.year ? `${member.year}${["st","nd","rd","th"][member.year-1]||"th"} Year` : "—" },
    { label: "Register Number", value: member.regNo },
    { label: "Reason to Join", value: member.reason },
    { label: "Joined On", value: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "—" }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,13,40,.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >

      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 24px 60px rgba(0,0,0,.18)",
          overflow: "hidden",
          animation: "modalSlide .25s cubic-bezier(.34,1.56,.64,1)",
        }}
      >

        <div
          style={{
            background: `linear-gradient(135deg,${meta.color},${meta.color}cc)`,
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <div>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 11, fontWeight: 600, margin: 0 }}>
              MEMBER DETAILS
            </p>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, margin: 0 }}>
              {member.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.2)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              width: 30,
              height: 30,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

          {fields.map(f => (
            <div
              key={f.label}
              style={{
                padding: "10px 14px",
                background: "#f8fafc",
                borderRadius: 12,
                border: "1.5px solid #e8e8f0",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  margin: "0 0 2px",
                }}
              >
                {f.label}
              </p>

              <p style={{ fontSize: 14, color: "#1e1b4b", fontWeight: 600, margin: 0 }}>
                {f.value || "—"}
              </p>
            </div>
          ))}

          <span
            style={{
              display: "inline-block",
              alignSelf: "flex-start",
              background: "#dcfce7",
              color: "#15803d",
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: 50,
              border: "1px solid #bbf7d0",
              marginTop: 4,
            }}
          >
            Active Member
          </span>

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
    clubsApi.facultyClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, []);

  const meta = cat =>
    CATEGORY_META[cat] || { color: "#6366f1", bg: "#eef2ff", border: "#e0e7ff" };

  const handleSelectClub = async club => {
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

  if (loading)
    return (
      <DashboardLayout title="My Clubs">
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
          Loading clubs…
        </div>
      </DashboardLayout>
    );

  if (selected) {

    const m = meta(selected.category);
    const members = selected.members || [];

    return (
      <DashboardLayout title="Club Detail">

        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <button
            onClick={() => setSelected(null)}
            style={{
              background: m.bg,
              border: `1.5px solid ${m.border}`,
              borderRadius: 12,
              padding: "8px 18px",
              color: m.color,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            ← Back to My Clubs
          </button>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1.5px solid #e8e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,.07)",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >

            <div
              style={{
                background: `linear-gradient(135deg,${m.color}22,${m.color}44)`,
                borderBottom: `2px solid ${m.border}`,
                padding: "24px 28px",
              }}
            >

              <h2
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#1e1b4b",
                  margin: "0 0 4px",
                }}
              >
                {selected.name}
              </h2>

              <span
                style={{
                  background: m.bg,
                  border: `1px solid ${m.border}`,
                  color: m.color,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 12px",
                  borderRadius: 50,
                }}
              >
                {selected.category}
              </span>

            </div>

            <div style={{ padding: "16px 28px" }}>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {selected.description}
              </p>
            </div>

          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1.5px solid #e8e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,.07)",
              padding: "24px 28px",
            }}
          >

            <h3
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: "#1e1b4b",
                margin: "0 0 6px",
              }}
            >
              Current Members ({members.length})
            </h3>

            {members.map((member, i) => (

              <div
                key={member._id || i}
                onClick={() => setSelectedMember(member)}
                style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  padding: "12px 18px",
                  border: "1.5px solid #e8e8f0",
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >

                <p style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b", margin: "0 0 2px" }}>
                  {member.name}
                </p>

                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                  {member.email}
                </p>

              </div>

            ))}

          </div>

        </div>

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

  return (
    <DashboardLayout title="My Clubs">

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 5px" }}>
            My Clubs
          </h1>

          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {clubs.length} clubs assigned to you
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >

          {clubs.map(club => {

            const m = meta(club.category);
            const memberCount = (club.members || []).length;

            return (
              <div
                key={club._id}
                onClick={() => handleSelectClub(club)}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: "1.5px solid #e8e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,.05)",
                  padding: "20px 22px",
                  cursor: "pointer",
                }}
              >

                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", margin: "0 0 4px" }}>
                  {club.name}
                </h3>

                <span
                  style={{
                    background: m.bg,
                    color: m.color,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 50,
                    border: `1px solid ${m.border}`,
                  }}
                >
                  {club.category}
                </span>

                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
                  Members: {memberCount}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </DashboardLayout>
  );
}