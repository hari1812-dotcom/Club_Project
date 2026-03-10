import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORY_COLORS = {
  "Technical":           { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600" },
  "Cultural & Creative": { bg: "bg-pink-50",   iconBg: "bg-pink-100",   text: "text-pink-600",   badge: "bg-pink-100 text-pink-600"   },
  "Social":              { bg: "bg-green-50",  iconBg: "bg-green-100",  text: "text-green-600",  badge: "bg-green-100 text-green-600"  },
  "Civic":               { bg: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-500", badge: "bg-orange-100 text-orange-500" },
};
const DEFAULT_COLOR = { bg: "bg-blue-50", iconBg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-100 text-blue-600" };

function MemberModal({ member, onClose }) {
  const fields = [
    { label: "Full Name",       value: member.name },
    { label: "Email",           value: member.email },
    { label: "Phone",           value: member.phone },
    { label: "Year of Study",   value: member.year ? `${member.year}${["st","nd","rd","th"][member.year-1]||"th"} Year` : "—" },
    { label: "Register Number", value: member.regNo },
    { label: "Reason to Join",  value: member.reason },
    { label: "Joined On",       value: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "—" },
  ];
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(15,13,40,.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-0.5">Member Details</p>
            <h3 className="text-white font-bold text-base">{member.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-lg text-white flex items-center justify-center hover:bg-white/30 transition text-sm"
          >✕</button>
        </div>
        {/* Modal body */}
        <div className="p-5 flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto">
          {fields.map((f) => (
            <div key={f.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">{f.label}</p>
              <p className="text-sm text-slate-800 font-semibold">{f.value || "—"}</p>
            </div>
          ))}
          <span className="self-start bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-100 mt-1">
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
    clubsApi.facultyClubs().then(setClubs).catch(() => setClubs([])).finally(() => setLoading(false));
  }, []);

  const getColors = (cat) => CATEGORY_COLORS[cat] || DEFAULT_COLOR;

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

  if (loading)
    return (
      <DashboardLayout title="My Clubs">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );

  /* ── Detail view ── */
  if (selected) {
    const c = getColors(selected.category);
    const members = selected.members || [];
    return (
      <DashboardLayout title="Club Detail">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>
        <div className="faculty-root" style={{ maxWidth: 860, margin: "0 auto" }}>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl mb-6 hover:bg-blue-100 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to My Clubs
          </button>

          {/* Club info card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className={`${c.bg} px-6 py-5 border-b border-slate-100`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">{selected.name}</h2>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${c.badge}`}>
                    {selected.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-slate-500 text-sm leading-relaxed">{selected.description}</p>
            </div>
          </div>

          {/* Members card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-500">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="font-bold text-slate-800 text-sm">Current Members ({members.length})</p>
            </div>
            {members.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No members yet.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {members.map((member, i) => (
                  <div
                    key={member._id || i}
                    onClick={() => setSelectedMember(member)}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                      <p className="text-slate-400 text-xs">{member.email}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-300 ml-auto">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </DashboardLayout>
    );
  }

  /* ── List view ── */
  return (
    <DashboardLayout title="My Clubs">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; } .club-card { transition: transform 0.18s ease, box-shadow 0.18s ease; } .club-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -6px rgba(0,0,0,0.1); }`}</style>
      <div className="faculty-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Manage</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">My Clubs</h1>
            <p className="text-blue-100 text-sm mt-1">{clubs.length} club{clubs.length !== 1 ? "s" : ""} assigned to you.</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
        </div>

        {clubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-blue-300">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">No clubs assigned</p>
            <p className="text-slate-400 text-sm mt-1">Contact your administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => {
              const c = getColors(club.category);
              const memberCount = (club.members || []).length;
              return (
                <div
                  key={club._id}
                  onClick={() => handleSelectClub(club)}
                  className={`club-card ${c.bg} rounded-2xl p-5 cursor-pointer`}
                >
                  <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className={`font-extrabold text-base ${c.text}`}>{club.name}</p>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${c.badge}`}>
                    {club.category}
                  </span>
                  <p className="text-slate-400 text-xs mt-3 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    </svg>
                    {memberCount} member{memberCount !== 1 ? "s" : ""}
                  </p>
                  <p className={`text-xs font-semibold flex items-center gap-1 mt-3 ${c.text}`}>
                    View details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}