import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_CONFIG = {
  "Technical":           { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600", bannerFrom: "from-indigo-500", bannerTo: "to-indigo-400" },
  "Cultural & Creative": { bg: "bg-pink-50",   iconBg: "bg-pink-100",   text: "text-pink-600",   badge: "bg-pink-100 text-pink-600",   bannerFrom: "from-pink-500",   bannerTo: "to-rose-400"    },
  "Social":              { bg: "bg-green-50",  iconBg: "bg-green-100",  text: "text-green-600",  badge: "bg-green-100 text-green-600",  bannerFrom: "from-green-500",  bannerTo: "to-emerald-400" },
  "Civic":               { bg: "bg-orange-50", iconBg: "bg-orange-100", text: "text-orange-500", badge: "bg-orange-100 text-orange-500", bannerFrom: "from-orange-500", bannerTo: "to-amber-400"   },
};
const DEFAULT_CONFIG = CATEGORY_CONFIG["Technical"];

function JoinModal({ club, onClose, onSuccess }) {
  const { user } = useAuth();
  const [myClubCount, setMyClubCount] = useState(0);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", year: "", regNo: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const c = CATEGORY_CONFIG[club?.category] || DEFAULT_CONFIG;

  useEffect(() => {
    clubsApi.myClubs().then((list) => setMyClubCount(list.length)).catch(() => setMyClubCount(0));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (myClubCount >= 4) {
      setError("You can join maximum 4 clubs only.");
      return;
    }
    if (!form.phone || !form.year || !form.regNo || !form.reason) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    clubRequestsApi.create({ clubId: club._id, phone: form.phone, year: Number(form.year), regNo: form.regNo, reason: form.reason })
      .then(() => onSuccess())
      .catch((err) => setError(err.message || "Submission failed."))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(15,13,40,.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className={`bg-gradient-to-r ${c.bannerFrom} ${c.bannerTo} px-6 py-4 flex justify-between items-center`}>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">Request to Join</p>
            <h3 className="text-white font-bold text-base">{club.name}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-lg text-white flex items-center justify-center hover:bg-white/30 transition text-sm">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name</label>
              <input value={form.name} readOnly className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
              <input value={form.email} readOnly className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" type="tel" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Year <span className="text-red-400">*</span></label>
              <select name="year" value={form.year} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
                <option value="">Select</option>
                <option value="1">1st Year</option><option value="2">2nd Year</option>
                <option value="3">3rd Year</option><option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Register Number <span className="text-red-400">*</span></label>
            <input name="regNo" value={form.regNo} onChange={handleChange} placeholder="e.g. 22CS001" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Reason to Join <span className="text-red-400">*</span></label>
            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Tell us why you want to join…" rows={3} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-100 transition">Cancel</button>
            <button type="submit" disabled={submitting || myClubCount >= 4} className={`flex-[2] py-3 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-60 bg-gradient-to-r ${c.bannerFrom} ${c.bannerTo}`}>
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clubsApi.getById(id), clubRequestsApi.myRequests()])
      .then(([clubData, requests]) => {
        setClub(clubData);
        const r = requests.find((x) => x.clubId?._id === id || x.clubId === id);
        setRequestStatus(r?.status || null);
      })
      .catch(() => setClub(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashboardLayout title="Club Detail"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" /></div></DashboardLayout>;
  if (!club) return <DashboardLayout title="Club Detail"><div className="text-center py-20 text-slate-400">Club not found.</div></DashboardLayout>;

  const c = CATEGORY_CONFIG[club.category] || DEFAULT_CONFIG;
  const isMember = club.members?.some((m) => (m._id || m) === user?.id) || false;
  const faculty = club.facultyIncharge;
  const activityList =
    club.activities?.length > 0
      ? club.activities
      : [
          `Weekly ${club.category} workshop`,
          `${club.name} team collaboration sessions`,
          `Monthly showcase and peer learning`,
        ];
  const equipmentPhotos = (club.equipment || []).filter(
    (item) => /^https?:\/\//i.test(item) || /\.(png|jpg|jpeg|webp|gif)$/i.test(item)
  );

  return (
    <DashboardLayout title={club.name}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .student-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .detail-card { transition: box-shadow 0.18s ease; }
        .detail-card:hover { box-shadow: 0 8px 24px -4px rgba(0,0,0,0.08); }
        .join-btn:hover { filter: brightness(1.06); transform: translateY(-2px); }
        .join-btn { transition: all 0.18s ease; }
      `}</style>

      <div className="student-root" style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Back */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${c.bg} border border-${c.text.replace("text-","")} ${c.text} text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-80 transition`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>

          <button
            onClick={() => navigate(`/student/clubs/${id}/activities`)}
            className={`flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4m-4 0V9a2 2 0 1 1 4 0v2m-4 0v2a2 2 0 0 0 4 0v-2"/>
            </svg>
            View Activities
          </button>
        </div>

        {/* Hero banner */}
        <div className={`rounded-2xl bg-gradient-to-r ${c.bannerFrom} ${c.bannerTo} px-7 py-6 mb-5 flex items-start justify-between gap-4 flex-wrap`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{club.category}</p>
                <h1 className="text-white font-bold text-xl leading-tight">{club.name}</h1>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{club.description}</p>
          </div>
          <div className="bg-white/20 border border-white/30 rounded-2xl px-5 py-4 text-center shrink-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide mb-1">Members</p>
            <p className="text-white text-3xl font-extrabold leading-none">{club.members?.length ?? 0}</p>
            {(club.maxCapacity || 100) && <p className="text-white/60 text-xs mt-1">/ {club.maxCapacity || 100} max</p>}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-800">{club.members?.length ?? 0}</p>
            <p className="text-xs text-slate-500 font-medium">Active Members</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-800">{club.equipment?.length ?? 0}</p>
            <p className="text-xs text-slate-500 font-medium">Equipment Items</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-800">{club.activities?.length ?? 3}</p>
            <p className="text-xs text-slate-500 font-medium">Activities</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${c.text}`}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-800">{club.upcomingEvents?.length ?? 0}</p>
            <p className="text-xs text-slate-500 font-medium">Upcoming Events</p>
          </div>
        </div>

        {/* Equipment & Resources & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className={`detail-card ${c.bg} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${c.text}`}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <p className={`font-bold text-sm ${c.text}`}>Equipment & Resources</p>
            </div>
            {club.equipment?.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {club.equipment.map((item, i) => (
                    <span key={i} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>{item}</span>
                  ))}
                </div>
                {equipmentPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentPhotos.slice(0, 4).map((src, idx) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt="Equipment"
                        className="w-full h-24 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : <p className="text-slate-400 text-sm">No equipment listed yet.</p>}
          </div>

          <div className={`detail-card ${c.bg} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${c.text}`}>
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <p className={`font-bold text-sm ${c.text}`}>Club Activities</p>
            </div>
            <ul className="flex flex-col gap-2">
              {activityList.map((act, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.text.replace("text-","bg-")}`} />
                  {act}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Faculty Incharge */}
        <div className="detail-card bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-sm">Faculty Incharge</p>
          </div>
          {faculty ? (
            <div className="bg-gradient-to-r from-blue-50 to-blue-25 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${c.iconBg} rounded-xl flex items-center justify-center ${c.text} font-bold text-xl shrink-0 shadow-sm`}>
                  {faculty.name?.[0]?.toUpperCase() || "F"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-slate-800 text-base">{faculty.name}</p>
                    {faculty.name?.includes('Dr.') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Faculty
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {faculty.department && (
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 flex-shrink-0">
                          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                        </svg>
                        <p className="text-sm text-slate-600">{faculty.department}</p>
                      </div>
                    )}

                    {faculty.email && (
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 flex-shrink-0">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <p className="text-sm text-slate-600">{faculty.email}</p>
                      </div>
                    )}

                    {faculty.phone && (
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 flex-shrink-0">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <p className="text-sm text-slate-600">{faculty.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 mx-auto mb-2 text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <p className="text-sm text-gray-500">Faculty incharge details not available.</p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        {club.upcomingEvents?.length > 0 && (
          <div className="detail-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-purple-500">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p className="font-bold text-slate-800 text-sm">Upcoming Events</p>
            </div>
            <div className="flex flex-col gap-2">
              {club.upcomingEvents.map((ev) => (
                <div key={ev._id} className={`flex items-center justify-between gap-4 ${c.bg} rounded-xl px-4 py-3 flex-wrap`}>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{ev.title || ev.description}</p>
                    {ev.venue && <p className="text-slate-400 text-xs mt-0.5">{ev.venue}</p>}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${c.badge}`}>
                    {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join / Status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          {isMember || requestStatus === "Approved" ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-500">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-green-700 text-sm">You're a member!</p>
                <p className="text-slate-400 text-xs mt-0.5">You can view upcoming events from My Clubs.</p>
              </div>
            </div>
          ) : requestStatus === "Pending" ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-500">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-amber-700 text-sm">Request Pending</p>
                <p className="text-slate-400 text-xs mt-0.5">Your join request is awaiting approval from the club incharge.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-slate-800 text-sm">Interested in joining?</p>
                <p className="text-slate-400 text-xs mt-0.5">Submit a request and the club incharge will review it.</p>
              </div>
              <button
                className={`join-btn flex items-center gap-2 px-6 py-3 text-white font-bold text-sm rounded-xl shadow-sm bg-gradient-to-r ${c.bannerFrom} ${c.bannerTo} disabled:opacity-50`}
                onClick={() => setShowModal(true)}
                disabled={club.members?.length >= (club.maxCapacity || 100)}
                title={club.members?.length >= (club.maxCapacity || 100) ? "Club has reached maximum capacity" : "Request to Join"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {club.members?.length >= (club.maxCapacity || 100) ? "Club Full" : "Request to Join"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <JoinModal club={club} onClose={() => setShowModal(false)} onSuccess={() => { setRequestStatus("Pending"); setShowModal(false); }} />
      )}
    </DashboardLayout>
  );
}