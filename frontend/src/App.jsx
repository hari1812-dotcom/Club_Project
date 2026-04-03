import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import AvailableClubs from "./pages/student/AvailableClubs";
import MyClubs from "./pages/student/MyClubs";
import StudentEvents from "./pages/student/StudentEvents";
import ClubDetail from "./pages/student/ClubDetail";
import ClubActivity from "./components/ClubActivity";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyClubs from "./pages/faculty/FacultyClubs";
import FacultyRequests from "./pages/faculty/FacultyRequests";
import FacultyEvents from "./pages/faculty/FacultyEvents";
import CreateEvent from "./pages/faculty/CreateEvent";
import FacultyEventManage from "./pages/faculty/FacultyEventManage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const to = { admin: "/admin", faculty: "/faculty", student: "/student" }[user.role] || "/student";
  return <Navigate to={to} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/clubs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AvailableClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/clubs/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClubDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/clubs/:id/activities"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClubActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-clubs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/clubs"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/requests"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/events"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/events/new"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/events/:id/manage"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyEventManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
