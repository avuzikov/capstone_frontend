# Hiring Platform Frontend

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Running without Docker](#running-without-docker)
   - [Running with Docker](#running-with-docker)
5. [Routes and Components](#routes-and-components)
6. [API Endpoints](#api-endpoints)
7. [Error Handling](#error-handling)
8. [Team Responsibilities](#team-responsibilities)
9. [Next Steps](#next-steps)
10. [Contributing](#contributing)
11. [License](#license)
12. [Questions to Discuss with Backend Team](#questions-to-discuss-with-backend-team)

## Project Overview
This project is a full-stack hiring platform with a React + TypeScript frontend. The frontend can be run standalone or containerized using Docker. It provides functionalities for job applicants, hiring managers, and administrators to interact with the hiring process efficiently.

## Technology Stack
- React 18.3.1 with TypeScript
- Tailwind CSS 3.4.13 for styling
- Context API for state management
- react-router for routing
- JWT for authentication

## Project Structure
```plaintext
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
├── tailwind.config.js
└── README.md
```

## Getting Started

### Running without Docker

1. Clone the repository
2. Navigate to the `frontend-service` directory
3. Run `npm install` to install dependencies
4. Use `npm start` to run the development server
5. Access the application at `http://localhost:3000` in your web browser

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

The `Dockerfile` in the `frontend-service` directory is used to containerize the frontend application. The `docker-compose.yml` file in the root of the project will orchestrate all services, including the frontend.

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
     - ApplicationStatusFilter
   - Functionality:
     - Display list of user's job applications with status
     - Filter applications by status

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
     - ManagerStats
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
     - Sort applicants by date or status
     - View applicant statistics on hover (number of applications with each status)

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

## API Endpoints

The frontend relies on the following backend API endpoints for functionality:

### Authentication

#### POST /users/login
- Description: Authenticate user and receive JWT token
- Request:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response:
  - Body: Empty
  - Cookie: JWT token containing claims with `userId` and `role`

### Users

#### POST /users/registration
- Description: Register a new user (for normal users)
- Request:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- Response:
  - Body: Empty
  - Cookie: JWT token containing claims with `userId` and `role`

#### POST /users/registration/admin
- Description: Register a new hiring manager (Admin only)
- Request:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- Response:
  - Body: Empty
- Authorization: Requires JWT token in a cookie. The role must be admin.

#### GET /users/{id}
- Description: Retrieve user details by ID
- Path Parameters:
  - `id` (required) – The ID of the user
- Response:
  ```json
  {
    "id": "int",
    "fullName": "varchar(50)",
    "email": "varchar(50)",
    "address": "varchar(100)",
    "phone": "varchar(25)",
    "resume": "text",
    "department": "varchar(50)",
    "role": "varchar(50)"
  }
  ```
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `id` in the request.

#### PUT /users/{id}
- Description: Update user details
- Path Parameters:
  - `id` (required) – The ID of the user
- Request Body:
  ```json
  {
    "fullName": "varchar(50)",
    "email": "varchar(50)",
    "address": "varchar(100)",
    "phone": "varchar(25)",
    "resume": "text",
    "department": "varchar(50)",
    "role": "varchar(50)"
  }
  ```
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `id` in the request.

#### DELETE /users/{id}
- Description: Delete a user
- Path Parameters:
  - `id` (required) – The ID of the user
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `id` in the request or the role must be admin.
- Response: HTTP status `204 No Content`

### Jobs

#### GET /api/job/{id}
- Description: Retrieve job details by ID
- Path Parameters:
  - `id` (required) – The ID of the job
- Response:
  ```json
  {
    "id": "int",
    "userId": "int",
    "department": "varchar(25)",
    "listingTitle": "varchar(100)",
    "dateListed": "timestamp",
    "dateClosed": "timestamp",
    "jobTitle": "varchar(45)",
    "jobDescription": "text",
    "additionalInformation": "text",
    "listingStatus": "varchar(25)",
    "experienceLevel": "varchar(100)"
  }
  ```
- Authorization: Requires JWT token in a cookie.

#### POST /api/job
- Description: Create a new job listing (Hiring Manager only)
- Request Body:
  ```json
  {
    "userId": "int",
    "department": "varchar(25)",
    "listingTitle": "varchar(100)",
    "dateListed": "timestamp",
    "dateClosed": "timestamp",
    "jobTitle": "varchar(45)",
    "jobDescription": "text",
    "additionalInformation": "text",
    "listingStatus": "varchar(25)",
    "experienceLevel": "varchar(100)",
    "modelResume": "text",
    "modelCoverLetter": "text"
  }
  ```
- Response: Same as the request body with created values
- Authorization: Requires JWT token in a cookie with role "hiring-manager".

#### PUT /api/job/{id}
- Description: Update an existing job listing
- Path Parameters:
  - `id` (required) – The ID of the job
- Request Body: Same as POST /api/job
- Response: Same as the request body with updated values
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `userId` of the job listing.

#### PUT /api/job/transfer
- Description: Transfer job ownership from one hiring manager to another
- Request Body:
  ```json
  {
    "jobId": "int",
    "fromUserId": "int",
    "toUserId": "int"
  }
  ```
- Response: Updated job details
- Authorization: Requires JWT token in a cookie. The role in the JWT must be "admin".

#### DELETE /api/job/{id}
- Description: Delete a job listing
- Path Parameters:
  - `id` (required) – The ID of the job
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `userId` of the job listing.
- Response: HTTP status `204 No Content`

#### GET /api/job/page={page}/items={items}
- Description: Retrieve job listings based on pagination
- Path Parameters:
  - `page` (required) – Page number
  - `items` (optional) – Number of items per page (default: 20)
- Response: Paginated list of jobs
- Authorization: Requires JWT token in a cookie.

### Applications

#### POST /application
- Description: Submit a new job application
- Request Body:
  ```json
  {
    "userId": "int",
    "jobId": "int",
    "dateApplied": "timestamp",
    "coverLetter": "text",
    "customResume": "text",
    "applicationStatus": "varchar(45)"
  }
  ```
- Response: Same as the request body with created values
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `userId` in the request.

#### GET /application/{id}
- Description: Retrieve application details by ID
- Path Parameters:
  - `id` (required) – The ID of the application
- Response:
  ```json
  {
    "id": "int",
    "userId": "int",
    "jobId": "int",
    "dateApplied": "timestamp",
    "coverLetter": "text",
    "customResume": "text",
    "applicationStatus": "varchar(45)"
  }
  ```
- Authorization: Requires JWT token in a cookie. Applicants can only view their own applications. Hiring managers and admins can view any application.

#### PUT /application/{id}
- Description: Update an existing job application (Applicant only)
- Path Parameters:
  - `id` (required) – The ID of the application
- Request Body:
  ```json
  {
    "id": "int",
    "userId": "int",
    "dateApplied": "timestamp",
    "coverLetter": "text",
    "customResume": "text"
  }
  ```
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `id` in the request.

#### PUT /application/manager/{id}
- Description: Update application status (Hiring Manager only)
- Path Parameters:
  - `id` (required) – The ID of the application
- Request Body:
  ```json
  {
    "applicationStatus": "varchar(45)"
  }
  ```
- Authorization: Requires JWT token

#### PUT /application/manager/{id}
- Description: Update application status (Hiring Manager only)
- Path Parameters:
  - `id` (required) – The ID of the application
- Request Body:
  ```json
  {
    "applicationStatus": "varchar(45)"
  }
  ```
- Authorization: Requires JWT token in a cookie with role "hiring-manager".

#### DELETE /application/{id}
- Description: Delete a job application
- Path Parameters:
  - `id` (required) – The ID of the application
- Authorization: Requires JWT token in a cookie. The `userId` in the token must match the `userId` of the application.
- Response: HTTP status `204 No Content`

## Error Handling

- Display error messages on the frontend side when API calls fail or other errors occur.
- Implement a global error boundary to catch and display unexpected errors.
- Use try-catch blocks in async functions to handle potential errors gracefully.
- If a user tries to access a route they don't have permission for, redirect them to the login page.
- Implement input validation on forms to prevent invalid data submission.
- Use HTTP status codes to determine the type of error and display appropriate messages to the user.

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

## Next Steps
1. Set up the project structure and install necessary dependencies
2. Implement basic routing and create placeholder components for each page
3. Set up the Context API for state management
4. Implement authentication logic and protected routes
5. Start building out individual features, beginning with the job listing and job description pages
6. Integrate with the backend API as it becomes available
7. Implement styling using Tailwind CSS
8. Conduct thorough testing and bug fixing
9. Implement error handling and form validation
10. Optimize performance and conduct security audits
11. Prepare documentation for deployment and maintenance

## Contributing
Please refer to the team responsibilities section for guidelines on contributing to this project. When contributing, please follow these steps:

1. Create a new branch for your feature or bugfix.
2. Write clear, commented code following the established project style guide.
3. Write unit tests for your code where applicable.
4. Update documentation as necessary.
5. Submit a pull request for review before merging changes into the main branch.
6. Participate in code reviews and address any feedback.

## Code Style and Best Practices
- Use TypeScript for type safety and better developer experience.
- Follow the Airbnb JavaScript Style Guide for consistent code formatting.
- Use functional components and hooks in React.
- Keep components small and focused on a single responsibility.
- Use meaningful variable and function names.
- Comment complex logic and include JSDoc comments for functions.
- Use async/await for handling asynchronous operations.
- Implement proper error handling and logging.

## Testing
- Write unit tests for individual components and functions using Jest and React Testing Library.
- Implement integration tests for critical user flows.
- Use Cypress for end-to-end testing of key features.
- Aim for high test coverage, especially for critical business logic.

## Performance Optimization
- Use React.memo for components that don't need frequent re-rendering.
- Implement lazy loading for routes and heavy components.
- Optimize images and assets for web delivery.
- Use performance profiling tools to identify and fix bottlenecks.

## Accessibility
- Ensure the application is keyboard navigable.
- Use semantic HTML elements.
- Include proper ARIA labels and roles where necessary.
- Maintain sufficient color contrast for text and interactive elements.
- Test the application with screen readers and other assistive technologies.

## Security Considerations
- Implement proper authentication and authorization checks.
- Use HTTPS for all API communications.
- Sanitize user inputs to prevent XSS attacks.
- Implement CSRF protection for form submissions.
- Regularly update dependencies to patch known vulnerabilities.
- Conduct security audits and penetration testing.

## Deployment
- Use environment variables for configuration.
- Implement a CI/CD pipeline for automated testing and deployment.
- Use Docker for consistent deployment across different environments.
- Implement proper logging and monitoring in production.

## License
This project is proprietary and confidential. Unauthorized copying, transferring or reproduction of the contents of this project, via any medium, is strictly prohibited.

## Questions to Discuss with Backend Team

1. Media Upload/Download:
   - Should we implement a feature for applicants to upload profile pictures?
   - What file size and format restrictions should be in place?

2. CV Upload:
   - Should there be a CV upload or is it too complicated for the backend side?
   - Should CV upload be part of the initial application process or a separate feature in the applicant's profile?
   - What file formats should be supported for CV uploads (e.g., PDF, DOCX)?
   - Are there any file size limitations?

3. Application Form:
   - What specific fields should be included in the standard application form?
   - Are there any field validations or restrictions we need to implement?

4. Error Handling:
   - What error codes and messages can we expect from the backend for various scenarios?

5. API Structure:
   - Confirm the changes to the application status update endpoint (`PUT /application/manager/{id}`)
   - Discuss the separation of user types into distinct endpoints (`GET /users/admin/{id}` and `GET /users/{id}`)
   - Are there any other endpoints that need restructuring to better fit the application's needs?

6. Authentication:
   - How long should JWT tokens be valid?
   - Should we implement refresh tokens?
   - How should we handle token expiration on the frontend?

7. Rate Limiting:
   - Are there any rate limits on API endpoints we should be aware of?
   - How should we handle rate limit errors on the frontend?

8. Pagination:
   - Confirm the structure of paginated responses for job listings and applications.
   - Are there any other endpoints that should support pagination?

9. Search and Filtering:
   - What search and filtering capabilities does the backend support for job listings and applications?
   - How should these be implemented in the API requests?

10. Data Validation:
    - What data validation is performed on the backend?
    - Should we implement matching validation on the frontend, or rely on backend validation responses?

11. Websockets:
    - Is there a plan to implement real-time features using websockets?
    - If so, which features would benefit from real-time updates?

These questions will help ensure smooth integration between the frontend and backend, and clarify any ambiguities in the API documentation or feature requirements.

