import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationsApi } from "../api/api";

const studentNav = [
  { to: "/student", label: "Dashboard", icon: "home" },
  { to: "/student/clubs", label: "Available Clubs", icon: "clubs" },
  { to: "/student/my-clubs", label: "My Clubs", icon: "members" },
  { to: "/student/events", label: "Events", icon: "calendar" },
];

const facultyNav = [
  { to: "/faculty", label: "Dashboard", icon: "home" },
  { to: "/faculty/clubs", label: "My Clubs", icon: "clubs" },
  { to: "/faculty/requests", label: "Join Requests", icon: "requests" },
  { to: "/faculty/events", label: "Events", icon: "calendar" },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: "home" },
  { to: "/admin/users", label: "Users", icon: "members" },
  { to: "/admin/events", label: "Event Approval", icon: "requests" },
];

function NavIcon({ type }) {
  if (type === "clubs") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>;
  }
  if (type === "members") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>;
  }
  if (type === "calendar") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  }
  if (type === "requests") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.5z" /></svg>;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = getInitials(user?.name || "U");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: open ? "2px solid #6366f1" : "2px solid #e0e7ff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.03em",
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          outline: "none",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.5)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 2px 8px rgba(99,102,241,0.3)")
        }
        aria-label="Profile menu"
      >
        {initials}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
            minWidth: 215,
            border: "1px solid #ededf5",
            overflow: "hidden",
            zIndex: 50,
            animation: "pdFadeDown 0.18s ease",
          }}
        >
          {/* User info row */}
          <div
            style={{
              padding: "14px 16px 12px",
              borderBottom: "1px solid #f0f0f5",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#1e1b4b",
                  lineHeight: 1.3,
                }}
              >
                {user?.name || "Student"}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "#9ca3af",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "student"}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            style={{
              width: "100%",
              padding: "11px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13.5,
              color: "#ef4444",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#fff5f5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "none")
            }
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children, navLinks, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const links =
    navLinks ||
    (user?.role === "student"
      ? studentNav
      : user?.role === "faculty"
      ? facultyNav
      : adminNav);

  useEffect(() => {
    notificationsApi
      .getAll()
      .then((list) => {
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.readStatus).length);
      })
      .catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    notificationsApi.markAllRead().then(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readStatus: true }))
      );
      setUnreadCount(0);
    });
  };

  const markOneRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readStatus: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (_) {}
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes pdFadeDown {
          from { opacity: 0; transform: translateY(-7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sidebar-brand { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
      `}</style>

      <div className="min-h-screen bg-gray-50 flex">
        {/* ── Sidebar ── */}
        <aside className="w-64 bg-gradient-to-b from-blue-500 via-blue-500 to-blue-400 text-white flex flex-col fixed h-full shadow-xl">
          <div className="p-4 border-b border-white/15">
            <div className="sidebar-brand rounded-xl px-3 py-3 shadow-sm">
              <h2 className="font-bold text-white text-base">Club Manager</h2>
              <p className="text-xs text-blue-100 mt-0.5">{user?.name || "Student"}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="p-3 flex-1">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  location.pathname === item.to
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-blue-100 hover:bg-white/15"
                }`}
              >
                <NavIcon type={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-white/15">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-red-100 bg-red-500/20 border border-red-200/20 hover:bg-red-500/30 rounded-xl transition"
            >
              <span aria-hidden="true">↪</span>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 ml-64">
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>

            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="p-2 rounded-lg hover:bg-slate-100 relative"
                  aria-label="Notifications"
                >
                  <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m-6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-1 w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
                    <div className="px-4 py-2 flex justify-between items-center border-b border-slate-100 gap-3">
                      <span className="font-medium text-slate-700">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-slate-400 text-sm">
                          No notifications
                        </p>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <div
                            key={n._id}
                            className={`rounded-2xl p-4 mb-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                              !n.readStatus
                                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                                : "bg-gradient-to-r from-blue-100 to-blue-50 text-slate-700 border border-blue-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-2 h-2 rounded-full ${!n.readStatus ? "bg-white" : "bg-blue-500"}`}></div>
                                  <p className={`text-xs font-medium ${!n.readStatus ? "text-blue-100" : "text-blue-600"}`}>
                                    Notification
                                  </p>
                                </div>
                                <p className={`leading-relaxed ${!n.readStatus ? "text-white" : "text-slate-700"}`}>
                                  {n.message}
                                </p>
                                <p className={`text-xs mt-2 ${!n.readStatus ? "text-blue-100" : "text-slate-500"}`}>
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!n.readStatus && (
                                <button
                                  onClick={() => markOneRead(n._id)}
                                  className="shrink-0 text-xs bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile avatar + dropdown */}
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </>
  );
}