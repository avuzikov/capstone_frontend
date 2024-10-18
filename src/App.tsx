import React from "react";
import Header from "./components/shared/Header.tsx";
import Footer from "./components/shared/Footer.tsx";
import TestMockAPI from "./TestMockAPI.tsx";

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Content / Routes Go Here */}
        <h1>Mock API Test</h1>
        <TestMockAPI />
      </main>
      <Footer />
    </div>
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
