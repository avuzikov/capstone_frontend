import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManagerForm from './components/admin/ManagerForm';
import RegisterPage from './pages/applicant/RegisterPage';
import UserForm from './components/admin/UserForm';
import UserManagementPage from './pages/admin/UserManagementPage';
import ManagerManagementPage from './pages/admin/ManagerManagementPage';
import DataTableManagementPage from './pages/admin/DataTableManagementPage';
import TableDisplay from './components/admin/TableDisplay';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProfilePage from './pages/applicant/ProfilePage';
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import JobManagementPage from './pages/manager/JobManagementPage';
import JobDetailsPage from './pages/applicant/JobDetailsPage';
import JobPage from './pages/JobPage';
import ApplicationForm from './components/applicant/ApplicationForm';
import AdminJobManagementPage from './pages/admin/AdminJobManagementPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailsPage from './pages/applicant/ApplicationDetailsPage';

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
            <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />}></Route>

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
              element={
                <ProtectedRoute element={<ApplicationForm />} allowedRoles={['applicant']} />
              }
            />
            <Route
              path="/admin"
              element={<ProtectedRoute element={<AdminDashboardPage />} allowedRoles={['admin']} />}
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute element={<AdminJobManagementPage />} allowedRoles={['admin']} />
              }
            />
            <Route
              path="/admin/newManager"
              element={
                <ProtectedRoute
                  element={<ManagerForm isEditing={false} />}
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
              element={
                <ProtectedRoute element={<ManagerManagementPage />} allowedRoles={['admin']} />
              }
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
                  element={<ManagerForm isEditing={true} />}
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
                <ProtectedRoute
                  element={<ManagerDashboardPage />}
                  allowedRoles={['hiring-manager']}
                />
              }
            />
            <Route
              path="/manager/:jobId"
              element={
                <ProtectedRoute element={<JobManagementPage />} allowedRoles={['hiring-manager']} />
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
