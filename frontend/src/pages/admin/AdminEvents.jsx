import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { adminApi } from "../../api/api";

export default function AdminEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminApi.events(status || undefined).then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, [status]);

  const handleStatus = async (eventId, newStatus) => {
    setUpdating(eventId);
    const reason = newStatus === "Rejected" ? rejectionReason[eventId] : "";
    try {
      await adminApi.updateEventStatus(eventId, newStatus, reason);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout title="Event Approval">
      <div className="flex gap-2 mb-4">
        {["", "Pending", "Approved", "Rejected"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setSearchParams(s ? { status: s } : {})}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              (s || "all") === (status || "all")
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
            >
              <p className="font-semibold text-slate-800">{ev.description}</p>
              <p className="text-slate-600 text-sm mt-1">
                Club: {ev.clubId?.name} · By: {ev.createdBy?.name} · Venue: {ev.venue} · {new Date(ev.date).toLocaleString()}
              </p>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  ev.status === "Pending" ? "bg-amber-100 text-amber-800" :
                  ev.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {ev.status}
                </span>
                {ev.status === "Pending" && (
                  <>
                    <input
                      type="text"
                      placeholder="Rejection reason (optional)"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-56"
                      value={rejectionReason[ev._id] || ""}
                      onChange={(e) => setRejectionReason((prev) => ({ ...prev, [ev._id]: e.target.value }))}
                    />
                    <button
                      onClick={() => handleStatus(ev._id, "Approved")}
                      disabled={updating === ev._id}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(ev._id, "Rejected")}
                      disabled={updating === ev._id}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-slate-500">No events found.</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
