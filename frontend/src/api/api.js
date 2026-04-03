const BASE = "https://club-project-4f5b.onrender.com/api";
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const authApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),
};

export const clubsApi = {
  getAll: (category) =>
    request(category ? `/clubs?category=${encodeURIComponent(category)}` : "/clubs"),
  getById: (id) => request(`/clubs/${id}`),
  myClubs: () => request("/clubs/student-clubs"),
  facultyClubs: () => request("/clubs/my-clubs"),
  clubMembers: (id) => request(`/clubs/${id}/members`),  
};

export const clubRequestsApi = {
  create: (body) =>
    request("/club-requests", { method: "POST", body: JSON.stringify(body) }),
  myRequests: () => request("/club-requests/my"),
  facultyRequests: () => request("/club-requests/faculty"),
  updateStatus: (id, status, reason) =>
    request(`/club-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    }),
};

export const eventsApi = {
  myEvents: () => request("/events/my-events"),
  facultyEvents: () => request("/events/faculty-events"),
  facultyFeedback: () => request("/events/faculty-feedback"),
  getClubPastEvents: (clubId) => request(`/events/club/${clubId}/past`),
  getById: (id) => request(`/events/${id}`),
  create: (body) =>
    request("/events", { method: "POST", body: JSON.stringify(body) }),
  updateAttendance: (id, body) =>
    request(`/events/${id}/attendance`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  submitFeedback: (id, body) =>
    request(`/events/${id}/feedback`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const notificationsApi = {
  getAll: (unread) =>
    request(unread ? "/notifications?unread=true" : "/notifications"),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
};

export const adminApi = {
  stats: () => request("/admin/stats"),
  users: (role) =>
    request(role ? `/admin/users?role=${role}` : "/admin/users"),
  updateUser: (id, isActive) =>
    request(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),
  events: (status) =>
    request(status ? `/admin/events?status=${status}` : "/admin/events"),
  updateEventStatus: (id, status, rejectionReason) =>
    request(`/admin/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, rejectionReason }),
    }),
};
