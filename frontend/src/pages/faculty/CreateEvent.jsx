import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, eventsApi } from "../../api/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clubsApi.facultyClubs().then((list) => {
      setClubs(list);
      if (list.length && !clubId) setClubId(list[0]._id);
    }).catch(() => setClubs([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!clubId || !venue || !date || !description) {
      setError("All fields are required.");
      return;
    }
    setSubmitting(true);
    eventsApi
      .create({ clubId, venue, date, description })
      .then(() => navigate("/faculty/events"))
      .catch((err) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  return (
    <DashboardLayout title="Create Event">
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Club</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select club</option>
              {clubs.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Main Hall"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date & time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for approval"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/faculty/events")}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="text-slate-500 text-sm mt-4">Events are sent to Admin for approval before students can see them.</p>
      </div>
    </DashboardLayout>
  );
}
