import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi } from "../../api/api";

export default function MyClubs() {
  const [clubs, setClubs] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    clubsApi.myClubs().then(setClubs).catch(() => setClubs([]));
    clubRequestsApi.myRequests().then(setRequests).catch(() => setRequests([]));
  }, []);

  const pending = requests.filter((r) => r.status === "Pending");

  return (
    <DashboardLayout title="My Clubs">
      {pending.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="font-medium text-amber-800">Pending requests</h3>
          <ul className="mt-2 space-y-2">
            {pending.map((r) => (
              <li key={r._id} className="flex items-center justify-between">
                <span className="text-amber-700">{r.clubId?.name}</span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-sm">Pending</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <Link
            key={club._id}
            to={`/student/clubs/${club._id}`}
            className="block bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-slate-800">{club.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{club.category}</p>
            <span className="inline-block mt-3 text-indigo-600 text-sm font-medium">View →</span>
          </Link>
        ))}
      </div>
      {clubs.length === 0 && pending.length === 0 && (
        <p className="text-slate-500">You haven’t joined any clubs yet. Browse <Link to="/student/clubs" className="text-indigo-600">Available Clubs</Link>.</p>
      )}
    </DashboardLayout>
  );
}
