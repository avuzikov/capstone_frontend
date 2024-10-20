# Frontend Routes to API Requests Mapping

This document maps the frontend routes (page URLs) to the API requests that can be made from each page in the hiring platform application, based on the updated API documentation.

## Unprotected Routes (Applicant Section)

### 1. `/jobs` (JobListingPage)
- **GET /api/job/page?={page}&items?={items}**
  - Retrieves paginated list of job listings

### 2. `/jobs/:id` (JobDetailsPage)
- **GET /api/job/{id}**
  - Retrieves details of a specific job
- **POST /api/application** (if user is logged in)
  - Submits a new job application

### 3. `/register` (RegisterPage)
- **POST /users/registration**
  - Registers a new user account

### 4. `/login` (LoginPage)
- **POST /users/login**
  - Authenticates user and receives JWT token

## Protected Routes - Applicant

### 5. `/applications` (ApplicationsPage)
- **GET /api/application/{id}** (multiple times)
  - Retrieves details of user's applications
- **PUT /api/application/{id}**
  - Updates an existing job application
- **DELETE /api/application/{id}**
  - Deletes a job application

### 6. `/profile` (ProfilePage)
- **GET /users/{id}**
  - Retrieves user's profile information
- **PUT /users/{id}**
  - Updates user's profile information
- **DELETE /users/{id}**
  - Deletes user's account

## Protected Routes - Hiring Manager

### 7. `/manager/console` (ManagerDashboard)
- **GET /api/job/page?={page}&items?={items}**
  - Retrieves paginated list of job listings (can be filtered by the manager's userId)

### 8. `/manager/jobs` (ManageJobsPage)
- **POST /api/job**
  - Creates a new job listing
- **PUT /api/job/{id}**
  - Updates an existing job listing
- **DELETE /api/job/{id}**
  - Deletes a job listing

### 9. `/manager/job/:id` (JobApplicantsPage)
- **GET /api/job/{id}**
  - Retrieves details of a specific job
- **GET /api/job/{id}/applications**
  - Retrieves applications for a specific job
- **PUT /api/application/manager/{id}**
  - Updates status of an application
- **GET /api/job/{id}/filter={filter}**
  - Retrieves filtered list of applications for a job

## Protected Routes - Admin

### 10. `/admin/dashboard` (AdminDashboard)
- **GET /api/job/page?={page}&items?={items}**
  - Retrieves paginated list of all job listings

### 11. `/admin/hiring-managers` (ManageManagersPage)
- **POST /users/registration/admin**
  - Registers a new hiring manager
- **GET /users/admin/{id}** 
  - Retrieves details of hiring managers associated with the admin
- **PUT /users/admin/{id}**
  - Updates a hiring manager's details
- **DELETE /users/admin/{id}**
  - Deletes a hiring manager account

### 12. `/admin/jobs` (ManageAllJobsPage)
- **GET /api/job/page?={page}&items?={items}**
  - Retrieves paginated list of all job listings
- **PUT /api/job/transfer**
  - Transfers job ownership between managers
- **DELETE /api/job/{id}**
  - Deletes a job listing

### 13. `/admin/applications` (ManageApplicationsPage)
- **GET /api/application/{id}/statistics**
  - Retrieves detailed statistics for an application

This mapping provides an overview of what API requests can be made from each page in the frontend application based on the updated API documentation. Note that some pages might make additional API requests based on user interactions or specific features not explicitly mentioned in the documentation.
