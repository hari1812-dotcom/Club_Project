import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubRequestsApi } from "../../api/api";

export default function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState({});
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    clubRequestsApi.facultyRequests().then(setRequests).catch(() => setRequests([])).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (reqId, status) => {
    setUpdating(reqId);
    const r = reason[reqId] || "";
    try {
      await clubRequestsApi.updateStatus(reqId, status, r);
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <DashboardLayout title="Join Requests"><p className="text-slate-500">Loading…</p></DashboardLayout>;

  const pending = requests.filter((r) => r.status === "Pending");

  return (
    <DashboardLayout title="Join Requests">
      <div className="space-y-4">
        {pending.length === 0 ? (
          <p className="text-slate-500">No pending requests.</p>
        ) : (
          pending.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-slate-800">{r.studentId?.name}</h3>
                <p className="text-slate-600 text-sm">{r.studentId?.email}</p>
                <p className="text-slate-500 text-sm mt-1">Club: {r.clubId?.name}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Reason (optional for reject)"
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-48"
                  value={reason[r._id] || ""}
                  onChange={(e) => setReason((prev) => ({ ...prev, [r._id]: e.target.value }))}
                />
                <button
                  onClick={() => handleStatus(r._id, "Approved")}
                  disabled={updating === r._id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatus(r._id, "Rejected")}
                  disabled={updating === r._id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
