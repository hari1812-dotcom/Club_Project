import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi } from "../../api/api";

const CATEGORIES = ["Technical", "Cultural & Creative", "Social", "Civic"];

export default function AvailableClubs() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    clubsApi.getAll(category || undefined).then(setClubs).finally(() => setLoading(false));
  }, [category]);

  const byCategory = clubs.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});

  return (
    <DashboardLayout title="Available Clubs">
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          to="/student/clubs"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!category ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/student/clubs?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${category === cat ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {cat}
          </Link>
        ))}
      </div>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-8">
          {(category ? [category] : CATEGORIES).map((cat) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(byCategory[cat] || []).map((club) => (
                  <Link
                    key={club._id}
                    to={`/student/clubs/${club._id}`}
                    className="block bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition"
                  >
                    <h3 className="font-semibold text-slate-800">{club.name}</h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">{club.description}</p>
                    <span className="inline-block mt-3 text-indigo-600 text-sm font-medium">View Details</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
