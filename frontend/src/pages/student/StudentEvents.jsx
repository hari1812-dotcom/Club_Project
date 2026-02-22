import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { eventsApi } from "../../api/api";

export default function StudentEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi.myEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());

  return (
    <DashboardLayout title="Events">
      <div className="space-y-4">
        {upcoming.length === 0 ? (
          <p className="text-slate-500">No upcoming events from your clubs.</p>
        ) : (
          upcoming.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-800">{ev.description}</h3>
              <p className="text-slate-600 text-sm mt-1">Club: {ev.clubId?.name}</p>
              <p className="text-slate-600 text-sm">Venue: {ev.venue}</p>
              <p className="text-slate-600 text-sm">Date: {new Date(ev.date).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
