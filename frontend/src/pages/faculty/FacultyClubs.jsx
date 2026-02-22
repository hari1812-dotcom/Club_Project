import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

export default function FacultyClubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    clubsApi.facultyClubs().then(setClubs).catch(() => setClubs([]));
  }, []);

  return (
    <DashboardLayout title="My Clubs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <div key={club._id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800">{club.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{club.category}</p>
            <p className="text-slate-600 text-sm mt-2">Members: {(club.members || []).length} / {club.maxCapacity}</p>
          </div>
        ))}
      </div>
      {clubs.length === 0 && <p className="text-slate-500">No clubs assigned.</p>}
    </DashboardLayout>
  );
}
