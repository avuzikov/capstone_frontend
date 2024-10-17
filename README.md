# Hiring Platform Frontend

## Project Overview
This project is a full-stack hiring platform with a React + TypeScript frontend. The frontend can be run standalone or containerized using Docker.

## Technology Stack
- React with TypeScript
- Tailwind CSS for styling
- Context API for state management
- react-router for routing
- JWT for authentication

## Project Structure

```
frontend-service/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── applicant/
│   │   │   ├── JobList.tsx
│   │   │   ├── JobSearchForm.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   ├── ApplyButton.tsx
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   ├── ApplicationStatusFilter.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ApplicationForm.tsx
│   │   ├── hiringManager/
│   │   │   ├── ManagerStats.tsx
│   │   │   ├── ActiveJobsList.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── ApplicantList.tsx
│   │   │   ├── ApplicantStatusUpdate.tsx
│   │   │   └── ApplicantSortOptions.tsx
│   │   └── admin/
│   │       ├── AdminStats.tsx
│   │       ├── QuickActions.tsx
│   │       ├── ManagerList.tsx
│   │       ├── ManagerForm.tsx
│   │       └── JobTransferForm.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── JobContext.tsx
│   ├── pages/
│   │   ├── applicant/
│   │   │   ├── JobListingPage.tsx
│   │   │   ├── JobDetailsPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ApplicationsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hiringManager/
│   │   │   ├── ManagerDashboard.tsx
│   │   │   ├── ManageJobsPage.tsx
│   │   │   └── JobApplicantsPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageManagersPage.tsx
│   │       └── ManageAllJobsPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── job.ts
│   ├── types/
│   │   ├── User.ts
│   │   ├── Job.ts
│   │   └── Application.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── validateInput.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
│   ├── index.html
│   └── favicon.ico
├── Dockerfile
├── package.json
└── README.md
```

## Routes and Components

### Unprotected Routes (Applicant Section)
1. `/jobs`
   - Components:
     - Header (with login and register buttons)
     - JobList
     - JobSearchForm
   - Functionality:
     - Display list of available jobs
     - Search and filter jobs

2. `/job/:id`
   - Components:
     - JobDetails
     - ApplyButton
     - ManagerInfo
   - Functionality:
     - Display detailed job information
     - Show responsible manager information
     - Allow application submission (redirect to login if not authenticated)

3. `/register`
   - Components:
     - RegistrationForm
   - Functionality:
     - User registration for applicants

4. `/login`
   - Components:
     - LoginForm
   - Functionality:
     - User authentication for all user types
     - Available functionality depends on user type (Admin, Hiring Manager or Applicant)

### Protected Routes - Applicant

5. `/applications`
   - Components:
     - ApplicationList
   - Functionality:
     - Display list of user's job applications with status

6. `/profile`
   - Components:
     - ProfileForm
     - ApplicationForm (for standard application details)
   - Functionality:
     - Edit user profile information
     - Manage standard application details (experience, skills, motivation letter)

### Protected Routes - Hiring Manager

7. `/hiring-manager/dashboard`
   - Components:
     - RelatedVacanciesStats
     - ActiveJobsList
   - Functionality:
     - Overview of active job postings and applications

8. `/hiring-manager/jobs`
   - Components:
     - JobList (with CRUD operations)
     - JobForm
   - Functionality:
     - Create, read, update, and delete job postings

9. `/hiring-manager/job/:id/applicants`
   - Components:
     - ApplicantList
     - ApplicantStatusUpdate
     - ApplicantSortOptions
   - Functionality:
     - View and manage applicants for a specific job
     - Update applicant status
     - (Optional) Sort applicants by date or status
     - (Optional) View applicant statistics on hover (number of applications with each status)

### Protected Routes - Admin

10. `/admin/dashboard`
    - Components:
      - AdminStats
      - QuickActions
    - Functionality:
      - Overview of platform statistics
      - Quick access to common admin actions

11. `/admin/hiring-managers`
    - Components:
      - ManagerList
      - ManagerForm
    - Functionality:
      - CRUD operations for hiring managers
      - Transfer ownership of positions between managers

12. `/admin/jobs`
    - Components:
      - JobList (all jobs)
      - JobTransferForm
    - Functionality:
      - View all job postings
      - Transfer job ownership between managers

## Team Responsibilities

The team will work in pairs, with each pair focusing on one type of user:

1. Alexander & Lalitha (Hiring Manager):
   - Hiring manager dashboard features
   - Create and manage job postings
   - Update applicant statuses
   - Job listing page and job search functionality
   - Job description page

2. Matt & Abideet (Admin):
   - Admin dashboard features
   - Create and manage hiring managers
   - User management
   - Authentication and authorization logic
   - Project architecture and setup

3. Piotr & Sergio (Applicant):
   - User applications page
   - Apply button logic
   - Registration and login forms for applicants
   - Applicant profile management
   - Job search and filtering features

Shared Responsibilities:
- All pairs will contribute to:
  - Component development
  - State management implementation (Context API)
  - Integration with backend API
  - Styling with Tailwind CSS
  - Testing and bug fixing
  - Code reviews and documentation

## Getting Started

### Running without Docker

1. Clone the repository
2. Navigate to the `frontend-service` directory
3. Run `npm install` to install dependencies
4. Use `npm start` to run the development server

### Running with Docker

1. Make sure you have Docker installed on your machine
2. Navigate to the `frontend-service` directory
3. Build the Docker image:
   ```
   docker build -t hiring-platform-frontend .
   ```
4. Run the container:
   ```
   docker run -p 3000:3000 hiring-platform-frontend
   ```
5. Access the application at `http://localhost:3000` in your web browser

## Docker
The `Dockerfile` in the `frontend-service` directory is used to containerize the frontend application. The `docker-compose.yml` file in the root of the project will orchestrate all services, including the frontend.

## API Endpoints

### Authentication

#### POST /login
- Page: Login
- Description: Authenticate user and receive JWT token
- Request:
  ```json
  {
    "username": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- Response:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "username": "john.doe@example.com",
      "role": "applicant"
    }
  }
  ```

#### POST /registration
- Page: Registration
- Description: Register a new user (applicant)
- Request:
  ```json
  {
    "username": "jane.smith@example.com",
    "password": "securePassword456",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "applicant"
  }
  ```
- Response:
  ```json
  {
    "id": "456",
    "username": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "applicant"
  }
  ```

### Users

#### GET /users
- Page: Admin Dashboard
- Description: Get all users (admin only)
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "users": [
      {
        "id": "123",
        "username": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "applicant"
      },
      {
        "id": "789",
        "username": "alice.manager@example.com",
        "firstName": "Alice",
        "lastName": "Manager",
        "role": "hiringManager"
      }
    ]
  }
  ```

#### GET /users/{id}
- Page: User Profile
- Description: Get user details
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "id": "123",
    "username": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "applicant",
    "yearsOfExperience": 5,
    "skills": ["JavaScript", "React", "Node.js"],
    "motivationLetter": "I am passionate about..."
  }
  ```

#### PUT /users/{id}
- Page: User Profile
- Description: Update user details
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "yearsOfExperience": 6,
    "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
    "motivationLetter": "I am passionate about..."
  }
  ```
- Response:
  ```json
  {
    "id": "123",
    "username": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "applicant",
    "yearsOfExperience": 6,
    "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
    "motivationLetter": "I am passionate about..."
  }
  ```

#### DELETE /users/{id}
- Page: Admin Dashboard
- Description: Delete a user (admin only)
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "message": "User successfully deleted"
  }
  ```

### Jobs

#### GET /jobs
- Page: Job Listing
- Description: Get all jobs with optional filtering
- Query Parameters:
  - search: string
  - location: string
  - page: number
  - limit: number
- Response:
  ```json
  {
    "jobs": [
      {
        "id": "job123",
        "title": "Frontend Developer",
        "location": "New York, NY",
        "shortDescription": "Exciting opportunity for a Frontend Developer...",
        "postedDate": "2023-05-01T00:00:00Z",
        "hiringManagerId": "manager456",
        "hiringManagerName": "Alice Manager"
      }
    ],
    "totalJobs": 50,
    "currentPage": 1,
    "totalPages": 5
  }
  ```

#### GET /jobs/{id}
- Page: Job Details
- Description: Get detailed information about a specific job
- Response:
  ```json
  {
    "id": "job123",
    "title": "Frontend Developer",
    "location": "New York, NY",
    "fullDescription": "We are seeking a talented Frontend Developer...",
    "requirements": ["3+ years of experience", "Proficiency in React"],
    "benefits": ["Competitive salary", "Remote work options"],
    "postedDate": "2023-05-01T00:00:00Z",
    "applicationDeadline": "2023-06-01T00:00:00Z",
    "hiringManagerId": "manager456",
    "hiringManagerName": "Alice Manager"
  }
  ```

#### POST /jobs
- Page: Hiring Manager Dashboard
- Description: Create a new job posting
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "title": "Backend Developer",
    "location": "San Francisco, CA",
    "fullDescription": "We are seeking a talented Backend Developer...",
    "requirements": ["5+ years of experience", "Proficiency in Node.js"],
    "benefits": ["Competitive salary", "Health insurance"],
    "applicationDeadline": "2023-07-01T00:00:00Z"
  }
  ```
- Response:
  ```json
  {
    "id": "job789",
    "title": "Backend Developer",
    "location": "San Francisco, CA",
    "fullDescription": "We are seeking a talented Backend Developer...",
    "requirements": ["5+ years of experience", "Proficiency in Node.js"],
    "benefits": ["Competitive salary", "Health insurance"],
    "postedDate": "2023-05-15T00:00:00Z",
    "applicationDeadline": "2023-07-01T00:00:00Z",
    "hiringManagerId": "manager456",
    "hiringManagerName": "Alice Manager"
  }
  ```

#### PUT /jobs/{id}
- Page: Hiring Manager Dashboard
- Description: Update a job posting
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "title": "Senior Backend Developer",
    "location": "Remote",
    "fullDescription": "We are seeking a talented Senior Backend Developer...",
    "requirements": ["7+ years of experience", "Proficiency in Node.js"],
    "applicationDeadline": "2023-08-01T00:00:00Z"
  }
  ```
- Response:
  ```json
  {
    "id": "job789",
    "title": "Senior Backend Developer",
    "location": "Remote",
    "fullDescription": "We are seeking a talented Senior Backend Developer...",
    "requirements": ["7+ years of experience", "Proficiency in Node.js"],
    "benefits": ["Competitive salary", "Health insurance"],
    "postedDate": "2023-05-15T00:00:00Z",
    "applicationDeadline": "2023-08-01T00:00:00Z",
    "hiringManagerId": "manager456",
    "hiringManagerName": "Alice Manager"
  }
  ```

#### DELETE /jobs/{id}
- Page: Hiring Manager Dashboard
- Description: Delete a job posting
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "message": "Job posting successfully deleted"
  }
  ```

### Applications

#### POST /applications
- Page: Job Details
- Description: Submit a job application
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "jobId": "job123",
    "coverLetter": "I am excited to apply for this position..."
  }
  ```
- Response:
  ```json
  {
    "id": "app456",
    "jobId": "job123",
    "jobTitle": "Frontend Developer",
    "appliedDate": "2023-05-20T00:00:00Z",
    "status": "applied"
  }
  ```

#### GET /applications
- Page: Applicant Dashboard
- Description: Get all applications for the current user
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "applications": [
      {
        "id": "app456",
        "jobId": "job123",
        "jobTitle": "Frontend Developer",
        "appliedDate": "2023-05-20T00:00:00Z",
        "status": "applied"
      }
    ]
  }
  ```

#### GET /jobs/{id}/applications
- Page: Hiring Manager Dashboard
- Description: Get all applications for a specific job
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Query Parameters:
  - status: string (optional)
  - sortBy: string (date|status)
  - order: string (asc|desc)
- Response:
  ```json
  {
    "applications": [
      {
        "id": "app456",
        "applicantId": "user789",
        "applicantName": "John Doe",
        "appliedDate": "2023-05-20T00:00:00Z",
        "status": "applied"
      }
    ]
  }
  ```

#### PUT /applications/{id}
- Page: Hiring Manager Dashboard
- Description: Update application status
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "status": "passedPreInterview"
  }
  ```
- Response:
  ```json
  {
    "id": "app456",
    "jobId": "job123",
    "jobTitle": "Frontend Developer",
    "appliedDate": "2023-05-20T00:00:00Z",
    "status": "passedPreInterview"
  }
  ```

### Hiring Managers

#### POST /hiring-managers
- Page: Admin Dashboard
- Description: Create a new hiring manager
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "username": "bob.manager@example.com",
    "password": "securePassword789",
    "firstName": "Bob",
    "lastName": "Manager",
    "department": "Engineering"
  }
  ```
- Response:
  ```json
  {
    "id": "manager789",
    "username": "bob.manager@example.com",
    "firstName": "Bob",
    "lastName": "Manager",
    "department": "Engineering"
  }
  ```

#### GET /hiring-managers
- Page: Admin Dashboard
- Description: Get all hiring managers
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "hiringManagers": [
      {
        "id": "manager456",
        "username": "alice.manager@example.com",
        "firstName": "Alice",
        "lastName": "Manager",
        "department": "Sales"
      },
      {
        "id": "manager789",
        "username": "bob.manager@example.com",
        "firstName": "Bob",
        "lastName": "Manager",
        "department": "Engineering"
      }
    ]
  }
  ```

#### PUT /hiring-managers/{id}
- Page: Admin Dashboard
- Description: Update hiring manager details
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "firstName": "Robert",
    "department": "Product"
  }
  ```
- Response:
  ```json
  {
    "id": "manager789",
    "username": "bob.manager@example.com",
    "firstName": "Robert",
    "lastName": "Manager",
    "department": "Product"
  }
  ```

#### DELETE /hiring-managers/{id}
- Page: Admin Dashboard
- Description: Delete a hiring manager (if no active job postings)
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "message": "Hiring manager successfully deleted"
  }
  ```

#### PUT /jobs/{id}/transfer
- Page: Admin Dashboard
- Description: Transfer job ownership to another hiring manager
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Request:
  ```json
  {
    "newHiringManagerId": "manager789"
  }
  ```
- Response:
  ```json
  {
    "id": "job123",
    "title": "Frontend Developer",
    "hiringManagerId": "manager789",
    "hiringManagerName": "Robert Manager"
  }
  ```

### Statistics

#### GET /applicants/{id}/statistics
- Page: Hiring Manager Dashboard
- Description: Get application statistics for an applicant
- Headers: 
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- Response:
  ```json
  {
    "applicantId": "user789",
    "applicationStatuses": [
      {
        "status": "applied",
        "count": 5
      },
      {
        "status": "passedPreInterview",
        "count": 2
      },
      {
        "status": "passed1stInterview",
        "count": 1
      }
    ]
  }
  ```

## Questions to Discuss with Backend Team

1. Media Upload/Download:
   - Should we implement a feature for applicants to upload profile pictures?
   - What file size and format restrictions should be in place?

2. CV Upload:
   - Should there be a CV upload or it is too complicated for the backend side?
   - Should CV upload be part of the initial application process or a separate feature in the applicant's profile?
   - What file formats should be supported for CV uploads (e.g., PDF, DOCX)?
   - Are there any file size limitations?

3. Application Form:
   - What specific fields should be included in the standard application form?
   - Are there any field validations or restrictions we need to implement?

4. Error Handling:
   - What error codes and messages can we expect from the backend for various scenarios?

## Error Handling

- Display error messages on the frontend side when API calls fail or other errors occur.
- If a user tries to access a route they don't have permission for, redirect them to the login page.

## Next Steps
1. Set up the project structure and install necessary dependencies
2. Implement basic routing and create placeholder components for each page
3. Set up the Context API for state management
4. Implement authentication logic and protected routes
5. Start building out individual features, beginning with the job listing and job description pages
6. Integrate with the backend API as it becomes available
7. Implement styling using Tailwind CSS
8. Conduct thorough testing and bug fixing
