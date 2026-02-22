import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationsApi } from "../api/api";

const studentNav = [
  { to: "/student", label: "Dashboard" },
  { to: "/student/clubs", label: "Available Clubs" },
  { to: "/student/my-clubs", label: "My Clubs" },
  { to: "/student/events", label: "Events" },
];

const facultyNav = [
  { to: "/faculty", label: "Dashboard" },
  { to: "/faculty/clubs", label: "My Clubs" },
  { to: "/faculty/requests", label: "Join Requests" },
  { to: "/faculty/events", label: "Events" },
];

const adminNav = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/events", label: "Event Approval" },
];

export default function DashboardLayout({ children, navLinks, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const links = navLinks || (user?.role === "student" ? studentNav : user?.role === "faculty" ? facultyNav : adminNav);

  useEffect(() => {
    notificationsApi
      .getAll()
      .then((list) => {
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.readStatus).length);
      })
      .catch(() => {});
  }, [location.pathname]);

  const markAllRead = () => {
    notificationsApi.markAllRead().then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
      setUnreadCount(0);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Club Manager</h2>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <nav className="p-3 flex-1">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                location.pathname === item.to
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-2 rounded-lg hover:bg-slate-100 relative"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m-6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
                <div className="px-4 py-2 flex justify-between items-center border-b border-slate-100">
                  <span className="font-medium text-slate-700">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-slate-400 text-sm">No notifications</p>
                  ) : (
                    notifications.slice(0, 20).map((n) => (
                      <div
                        key={n._id}
                        className={`px-4 py-3 text-sm ${!n.readStatus ? "bg-indigo-50/50" : ""}`}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
