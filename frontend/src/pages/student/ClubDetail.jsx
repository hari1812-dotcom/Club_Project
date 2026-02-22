import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { clubsApi, clubRequestsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [formResponseUrl, setFormResponseUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clubsApi.getById(id).then(setClub).catch(() => setClub(null));
    clubRequestsApi.myRequests().then((list) => {
      const r = list.find((x) => x.clubId?._id === id || x.clubId === id);
      setRequestStatus(r?.status);
    }).catch(() => {});
  }, [id]);

  const isMember = club?.members?.some((m) => m._id === user?.id) || false;
  const canRequest = !requestStatus || requestStatus === "Rejected";

  const formOpenUrl = club?.formUrl || DEFAULT_GOOGLE_FORM_URL;

  const openGoogleForm = () => {
    window.open(formOpenUrl, "_blank", "noopener,noreferrer");
  };

  const handleRequest = (e) => {
    e.preventDefault();
    setError("");
    const url = formResponseUrl.trim();
    if (!url) {
      setError("Please open the form above, submit it, then paste the response or confirmation URL here.");
      return;
    }
    setSubmitting(true);
    clubRequestsApi
      .create({ clubId: id, formResponseUrl: url })
      .then(() => {
        setRequestStatus("Pending");
        navigate("/student/my-clubs");
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  };

  if (!club) return <DashboardLayout title="Club">Loading…</DashboardLayout>;

  const faculty = club.facultyIncharge;

  return (
    <DashboardLayout title={club.name}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">{club.category}</p>
          <h2 className="text-slate-800 font-semibold mt-1">About this club</h2>
          <p className="text-slate-700 mt-2 leading-relaxed">{club.description}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">Equipment & resources available</h3>
          {club.equipment?.length > 0 ? (
            <ul className="flex flex-wrap gap-2 mt-2">
              {club.equipment.map((item, idx) => (
                <li
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">No equipment listed for this club yet.</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800">Faculty Incharge</h3>
          {faculty && (
            <ul className="mt-2 text-slate-600 text-sm space-y-1">
              <li>Name: {faculty.name}</li>
              <li>Department: {faculty.department || "—"}</li>
              <li>Email: {faculty.email}</li>
              <li>Phone: {faculty.phone || "—"}</li>
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800">Activities & Members</h3>
          <p className="text-slate-600 text-sm mt-1">Current members: {club.memberCount ?? club.members?.length ?? 0}</p>
          {club.upcomingEvents?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-slate-700">Upcoming approved events</h4>
              <ul className="mt-2 space-y-2">
                {club.upcomingEvents.map((ev) => (
                  <li key={ev._id} className="text-sm text-slate-600">
                    {ev.description} — {new Date(ev.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          {requestStatus === "Approved" || isMember ? (
            <p className="text-green-600 font-medium">You are a member of this club.</p>
          ) : requestStatus === "Pending" ? (
            <p className="text-amber-600 font-medium">Your request is pending.</p>
          ) : (
            <>
              <h3 className="font-semibold text-slate-800 mb-2">Request to Join</h3>
              <p className="text-slate-600 text-sm mb-3">
                Open the Google Form, fill and submit it, then paste the response URL below and click Submit request.
              </p>
              <button
                type="button"
                onClick={openGoogleForm}
                className="w-full mb-4 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
              >
                <span>Open Google Form</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
              <form onSubmit={handleRequest}>
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <input
                  type="url"
                  value={formResponseUrl}
                  onChange={(e) => setFormResponseUrl(e.target.value)}
                  placeholder="Paste form response URL after submitting"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 mb-3"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit request"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
