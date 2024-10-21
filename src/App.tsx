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
import JobDetailsPage from "./pages/applicant/JobDetailsPage.tsx";
import JobPage from "./pages/JobPage.tsx";
import ApplicationForm from "./components/applicant/ApplicationForm.tsx";

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

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col justify-between min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<p>Dummy Data</p>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<JobPage />} />
      <Route path="/apply/:jobId" element={<ApplicationForm />} />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

/*
 import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';

// Applicant Pages
import JobListingPage from './pages/applicant/JobListingPage';
import JobDetailsPage from './pages/applicant/JobDetailsPage';
import RegisterPage from './pages/applicant/RegisterPage';
import LoginPage from './pages/applicant/LoginPage';
import ApplicationsPage from './pages/applicant/ApplicationsPage';
import ProfilePage from './pages/applicant/ProfilePage';

// Hiring Manager Pages
import ManagerDashboard from './pages/hiringManager/ManagerDashboard';
import ManageJobsPage from './pages/hiringManager/ManageJobsPage';
import JobApplicantsPage from './pages/hiringManager/JobApplicantsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageManagersPage from './pages/admin/ManageManagersPage';
import ManageAllJobsPage from './pages/admin/ManageAllJobsPage';

// Shared Components
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <div className="App">
            <Header />
            <Switch>
              // Unprotected Routes
              <Route exact path="/" component={JobListingPage} />
              <Route path="/jobs/:id" component={JobDetailsPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/login" component={LoginPage} />

              // Protected Routes - Applicant
              <Route path="/applications" component={ApplicationsPage} />
              <Route path="/profile" component={ProfilePage} />

              // Protected Routes - Hiring Manager 
              <Route path="/hiring-manager/dashboard" component={ManagerDashboard} />
              <Route path="/hiring-manager/jobs" component={ManageJobsPage} />
              <Route path="/hiring-manager/job/:id/applicants" component={JobApplicantsPage} />

              // Protected Routes - Admin
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/hiring-managers" component={ManageManagersPage} />
              <Route path="/admin/jobs" component={ManageAllJobsPage} />
            </Switch>
            <Footer />
          </div>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
 */
