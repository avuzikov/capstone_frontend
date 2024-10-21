// src\layouts\App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import MainLayout from './MainLayout';

// Shared Pages
import LoginPage from '../pages/shared/LoginPage';
import JobPage from '../pages/shared/JobPage';

// Applicant Pages
import RegisterPage from '../pages/applicant/RegisterPage';
import JobDetailsPage from '../pages/applicant/JobDetailsPage';
import ProfilePage from '../pages/applicant/ProfilePage';
import ApplicationForm from '../components/applicant/ApplicationForm';

// Manager Pages
import ManagerDashboardPage from '../pages/manager/ManagerDashboardPage';
import JobManagementPage from '../pages/manager/JobManagementPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminJobManagementPage from '../pages/admin/AdminJobManagementPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ManagerManagementPage from '../pages/admin/ManagerManagementPage';
import DataTableManagementPage from '../pages/admin/DataTableManagementPage';
import ManagerFormPage from '../pages/admin/ManagerFormPage';
import UserForm from '../components/admin/UserForm';
import TableDisplay from '../components/admin/TableDisplay';

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<ProfilePage />}
              allowedRoles={['applicant', 'hiring-manager', 'admin']}
            />
          }
        />
        <Route
          path="/apply/:jobId"
          element={<ProtectedRoute element={<ApplicationForm />} allowedRoles={['applicant']} />}
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboardPage />} allowedRoles={['admin']} />}
        />
        <Route
          path="/admin/jobs"
          element={<ProtectedRoute element={<AdminJobManagementPage />} allowedRoles={['admin']} />}
        />
        <Route
          path="/admin/newManager"
          element={
            <ProtectedRoute
              element={<ManagerFormPage isEditing={false} />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/admin/newUser"
          element={
            <ProtectedRoute element={<UserForm isEditing={false} />} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute element={<UserManagementPage />} allowedRoles={['admin']} />}
        />
        <Route
          path="/admin/managers"
          element={<ProtectedRoute element={<ManagerManagementPage />} allowedRoles={['admin']} />}
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute element={<DataTableManagementPage />} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute element={<UserForm isEditing={true} />} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/admin/manager/:id"
          element={
            <ProtectedRoute
              element={<ManagerFormPage isEditing={true} />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/admin/tables/:name"
          element={<ProtectedRoute element={<TableDisplay />} allowedRoles={['admin']} />}
        />
        <Route
          path="/manager/console"
          element={
            <ProtectedRoute element={<ManagerDashboardPage />} allowedRoles={['hiring-manager']} />
          }
        />
        <Route
          path="/manager/:jobId"
          element={
            <ProtectedRoute element={<JobManagementPage />} allowedRoles={['hiring-manager']} />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
