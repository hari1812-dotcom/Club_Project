import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi, eventsApi } from "../../api/api";

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ clubs: 0, requests: 0, events: 0 });

  useEffect(() => {
    Promise.all([
      clubsApi.facultyClubs(),
      clubRequestsApi.facultyRequests(),
      eventsApi.facultyEvents(),
    ])
      .then(([clubs, requests, events]) => {
        const pending = requests.filter((r) => r.status === "Pending");
        setStats({ clubs: clubs.length, requests: pending.length, events: events.length });
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/faculty/clubs" className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Clubs I Manage</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.clubs}</p>
        </Link>
        <Link to="/faculty/requests" className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Pending Join Requests</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.requests}</p>
        </Link>
        <Link to="/faculty/events" className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Events</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.events}</p>
        </Link>
      </div>
    </DashboardLayout>
  );
}
