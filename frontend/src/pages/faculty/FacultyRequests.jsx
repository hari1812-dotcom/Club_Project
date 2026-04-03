import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubRequestsApi } from "../../api/api";

const AVATAR_BG = ["bg-blue-400","bg-green-400","bg-purple-400","bg-pink-400","bg-orange-400","bg-teal-400"];

export default function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState({});
  const [updating, setUpdating] = useState(null);
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    clubRequestsApi.facultyRequests().then(setRequests).catch(() => setRequests([])).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (reqId, status) => {
    setUpdating(reqId);
    try {
      await clubRequestsApi.updateStatus(reqId, status, reason[reqId] || "");
      setRequests((prev) => prev.map((r) => (r._id === reqId ? { ...r, status } : r)));
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const matchesYear = (student) => !filterYear || (student?.yearOfStudy === Number(filterYear));
  const pending = requests.filter((r) => r.status === "Pending" && matchesYear(r.studentId));
  const done    = requests.filter((r) => r.status !== "Pending" && matchesYear(r.studentId));

  return (
    <DashboardLayout title="Join Requests">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .faculty-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .req-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
        .req-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -6px rgba(0,0,0,0.09); }
      `}</style>

      <div className="faculty-root">
        {/* Blue banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 px-7 py-6 mb-7 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Manage</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Join Requests</h1>
            <p className="text-blue-100 text-sm mt-1">
              {pending.length} pending request{pending.length !== 1 ? "s" : ""} awaiting your decision.
            </p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-7 h-7">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  Pending — {pending.length}
                </span>
              </div>

              {pending.length > 0 && (
                <div className="flex flex-col gap-3">
                  {pending.map((r, i) => (
                    <div key={r._id} className="req-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start gap-4 flex-wrap">
                        <div className={`w-11 h-11 ${AVATAR_BG[i % AVATAR_BG.length]} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {(r.studentId?.name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{r.studentId?.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {r.studentId?.email}
                            {r.studentId?.yearOfStudy && <span className="ml-1 text-slate-500">• Year {r.studentId.yearOfStudy}</span>}
                          </p>
                          <div className="flex gap-2 flex-wrap mt-2">
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100" title={`Capacity: ${r.clubId?.members?.length || 0} / ${r.clubId?.maxCapacity || 100}`}>
                              {r.clubId?.name} ({r.clubId?.members?.length || 0}/{r.clubId?.maxCapacity || 100})
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-500 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-orange-100">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                              Pending
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Reason (optional for reject)"
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full"
                            value={reason[r._id] || ""}
                            onChange={(e) => setReason((prev) => ({ ...prev, [r._id]: e.target.value }))}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatus(r._id, "Approved")}
                              disabled={updating === r._id || (r.clubId?.members && r.clubId.members.length >= (r.clubId.maxCapacity || 100))}
                              title={r.clubId?.members && r.clubId.members.length >= (r.clubId.maxCapacity || 100) ? "Club members capacity reached" : "Approve request"}
                              className="flex-1 py-2 bg-green-50 border border-green-200 text-green-600 font-semibold text-xs rounded-xl hover:bg-green-100 disabled:opacity-50 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatus(r._id, "Rejected")}
                              disabled={updating === r._id}
                              className="flex-1 py-2 bg-red-50 border border-red-200 text-red-500 font-semibold text-xs rounded-xl hover:bg-red-100 disabled:opacity-50 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Processed section */}
            {done.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">
                    Processed — {done.length}
                  </span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {done.map((r, i) => (
                    <div
                      key={r._id}
                      className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition ${i !== done.length - 1 ? "border-b border-slate-50" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${r.status === "Approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {r.status === "Approved" ? "✓" : "✕"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{r.studentId?.name}</p>
                        <p className="text-slate-400 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                          {r.clubId?.name}
                          {r.studentId?.yearOfStudy && <span className="ml-1 text-slate-500">• Year {r.studentId.yearOfStudy}</span>}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === "Approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.status === "Approved" ? "bg-green-400" : "bg-red-400"}`} />
                        {r.status}
                      </span>
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