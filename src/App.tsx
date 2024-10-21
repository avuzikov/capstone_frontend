import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/shared/Header.tsx";
import Footer from "./components/shared/Footer.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import ManagerForm from "./components/admin/ManagerForm.tsx";
import RegisterPage from "./pages/applicant/RegisterPage.tsx";
import UserForm from "./components/admin/UserForm.tsx";
import UserManagementPage from "./pages/admin/UserManagementPage.tsx";
import ManagerManagementPage from "./pages/admin/ManagerManagementPage.tsx";
import DataTableManagementPage from "./pages/admin/DataTableManagementPage.tsx";
import TableDisplay from "./components/admin/TableDisplay.tsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import ProfilePage from "./pages/applicant/ProfilePage.tsx";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage.tsx";
import JobManagementPage from "./pages/manager/JobManagementPage.tsx";
import JobDetailsPage from "./pages/applicant/JobDetailsPage.tsx";
import JobPage from "./pages/JobPage.tsx";
import ApplicationForm from "./components/applicant/ApplicationForm.tsx";
import ApplicationDetailsPage from "./pages/applicant/ApplicationDetailsPage.tsx";

const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && allowedRoles.includes(role)) {
    return element;
  }

  return <Navigate to="/jobs" replace />;
};

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col justify-between min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Redirect from root to /jobs */}
            <Route path="/" element={<Navigate to="/jobs" replace />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route
              path="/applications/:id"
              element={<ApplicationDetailsPage />}
            />
            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={<ProfilePage />}
                  allowedRoles={["applicant", "hiring-manager", "admin"]}
                />
              }
            />
            <Route
              path="/apply/:jobId"
              element={
                <ProtectedRoute
                  element={<ApplicationForm />}
                  allowedRoles={["applicant"]}
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashboardPage />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/newManager"
              element={
                <ProtectedRoute
                  element={<ManagerForm isEditing={false} />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/newUser"
              element={
                <ProtectedRoute
                  element={<UserForm isEditing={false} />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  element={<UserManagementPage />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/managers"
              element={
                <ProtectedRoute
                  element={<ManagerManagementPage />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/tables"
              element={
                <ProtectedRoute
                  element={<DataTableManagementPage />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <ProtectedRoute
                  element={<UserForm isEditing={true} />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/manager/:id"
              element={
                <ProtectedRoute
                  element={<ManagerForm isEditing={true} />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/admin/tables/:name"
              element={
                <ProtectedRoute
                  element={<TableDisplay />}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route
              path="/manager/console"
              element={
                <ProtectedRoute
                  element={<ManagerDashboardPage />}
                  allowedRoles={["hiring-manager"]}
                />
              }
            />
            <Route
              path="/manager/:jobId"
              element={
                <ProtectedRoute
                  element={<JobManagementPage />}
                  allowedRoles={["hiring-manager"]}
                />
              }
            />

            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
