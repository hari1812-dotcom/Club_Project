import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

export default function FacultyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi.facultyEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const byStatus = (status) => events.filter((e) => e.status === status);

  return (
    <DashboardLayout title="Events">
      <div className="mb-4">
        <Link
          to="/faculty/events/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
        >
          Create Event
        </Link>
      </div>
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Pending approval</h2>
          <div className="space-y-3">
            {byStatus("Pending").length === 0 ? (
              <p className="text-slate-500 text-sm">None</p>
            ) : (
              byStatus("Pending").map((ev) => (
                <div key={ev._id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-medium text-slate-800">{ev.description}</p>
                  <p className="text-slate-600 text-sm">Club: {ev.clubId?.name} · Venue: {ev.venue} · {new Date(ev.date).toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs">Pending</span>
                </div>
              ))
            )}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Approved</h2>
          <div className="space-y-3">
            {byStatus("Approved").map((ev) => (
              <div key={ev._id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-800">{ev.description}</p>
                  <p className="text-slate-600 text-sm">Club: {ev.clubId?.name} · Venue: {ev.venue} · {new Date(ev.date).toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                </div>
                <Link to={`/faculty/events/${ev._id}/manage`} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                  Manage (add students / coordinator)
                </Link>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Rejected</h2>
          <div className="space-y-3">
            {byStatus("Rejected").map((ev) => (
              <div key={ev._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="font-medium text-slate-800">{ev.description}</p>
                <p className="text-slate-600 text-sm">Club: {ev.clubId?.name}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">Rejected</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
