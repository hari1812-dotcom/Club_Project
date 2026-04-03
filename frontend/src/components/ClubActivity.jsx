import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { clubsApi } from '../api/api';

const ClubActivity = () => {
  const { id } = useParams();
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clubsApi.getById(id)
      .then((clubData) => {
        setClub(clubData);
      })
      .catch(() => {
        setClub(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Sample data for activities - in real app, this would come from API
  const activitiesData = {
    '2025-2026': [
      { sno: 1, activity: 'Code Circle Hackathon 2025', date: '15-Mar-2026' },
      { sno: 2, activity: 'Python Workshop Series', date: '22-Feb-2026' },
      { sno: 3, activity: 'Web Development Bootcamp', date: '10-Feb-2026' },
      { sno: 4, activity: 'AI/ML Study Group', date: '28-Jan-2026' },
      { sno: 5, activity: 'Open Source Contribution Drive', date: '15-Jan-2026' },
      { sno: 6, activity: 'Tech Talk: Future of Programming', date: '05-Jan-2026' },
      { sno: 7, activity: 'Coding Competition - Intra College', date: '20-Dec-2025' },
    ],
    '2024-2025': [
      { sno: 1, activity: 'Annual Tech Fest 2025', date: '18-Mar-2025' },
      { sno: 2, activity: 'JavaScript Masterclass', date: '25-Feb-2025' },
      { sno: 3, activity: 'Database Design Workshop', date: '12-Feb-2025' },
      { sno: 4, activity: 'Git & GitHub Training', date: '30-Jan-2025' },
      { sno: 5, activity: 'Mobile App Development Session', date: '18-Jan-2025' },
      { sno: 6, activity: 'Cybersecurity Awareness Program', date: '08-Jan-2025' },
    ]
  };

  const currentActivities = activitiesData[selectedYear] || [];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading club activities...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="text-sm text-gray-500">Club not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .club-activity * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .activity-table { border-collapse: collapse; width: 100%; }
        .activity-table th { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; font-weight: 600; padding: 10px 12px; text-align: left; border: 1px solid #e2e8f0; font-size: 14px; }
        .activity-table th:nth-child(1), .activity-table th:nth-child(3) { text-align: center; width: 60px; }
        .activity-table th:nth-child(3) { width: 100px; }
        .activity-table td { padding: 10px 12px; border: 1px solid #e2e8f0; background-color: #ffffff; font-size: 14px; }
        .activity-table td:nth-child(1), .activity-table td:nth-child(3) { text-align: center; }
        .activity-table tr:nth-child(even) td { background-color: #f8fafc; }
        .activity-table tr:hover td { background-color: #eff6ff; transition: background-color 0.2s ease; }
        @media (max-width: 768px) {
          .activity-table { font-size: 13px; }
          .activity-table th, .activity-table td { padding: 8px; }
        }
      `}</style>

      <div className="club-activity">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{club.name} Activities</h1>
              <h2 className="text-lg font-semibold text-blue-600">Academic Year {selectedYear}</h2>
            </div>

            {/* Year Selector */}
            <div className="flex flex-col w-full sm:w-auto">
              <label htmlFor="year-select" className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                Select Academic Year
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              >
                <option value="">---- SELECT YEAR ----</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-25">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-blue-600">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Club Activities - {selectedYear}</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Activity Conducted</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentActivities.map((activity) => (
                  <tr key={activity.sno}>
                    <td className="font-medium text-gray-600">{activity.sno}</td>
                    <td className="font-medium text-gray-800">{activity.activity}</td>
                    <td className="font-medium text-gray-600">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentActivities.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mx-auto mb-3 opacity-50">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p className="text-sm">No activities found for the selected year.</p>
            </div>
          )}
        </div>

        {/* Previous Year Section */}
        {selectedYear === '2025-2026' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-25">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-blue-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Club Activities - 2024-2025</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Activity Conducted</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activitiesData['2024-2025'].map((activity) => (
                    <tr key={activity.sno}>
                      <td className="font-medium text-gray-600">{activity.sno}</td>
                      <td className="font-medium text-gray-800">{activity.activity}</td>
                      <td className="font-medium text-gray-600">{activity.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubActivity;