# Hiring Platform Frontend

## Project Overview
This project is a full-stack hiring platform with a React + TypeScript frontend. The frontend will be containerized and run alongside other services using Docker Compose.

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
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── App.tsx
├── public/
├── Dockerfile
└── package.json
```

## Routes
- Unprotected: `/jobs`, `/register`, `/login`, `/job/:id`
- Protected: `/applications`, `/admin/*`, `/hiring-manager/*`

## Features
1. Job Listing (`/jobs`)
   - Header with login and register buttons
   - List of available jobs
   - Clicking a job opens its description page

2. Job Description (`/job/:id`)
   - Detailed job information
   - Apply button (functionality based on user status)

3. User Applications (`/applications`)
   - List of user's job applications with status

4. Authentication
   - Login and Registration forms
   - Three user types: admin, hiring manager, applicant

5. Admin Dashboard (`/admin`)
   - Create and manage hiring managers

6. Hiring Manager Dashboard (`/hiring-manager`)
   - Create and manage job postings
   - Update applicant statuses

## Team Responsibilities

1. Alexander (Most Experienced):
   - Project architecture and setup
   - State management implementation (Context API)
   - Authentication and authorization logic

2. Matt:
   - Routing setup and implementation
   - Admin dashboard features
   - Integration with backend API

3. Sergio:
   - Job listing page and job search functionality
   - Job description page
   - Apply button logic

4. Piotr:
   - User applications page
   - Hiring manager dashboard features
   - Form validations

5. Abideet:
   - Login and registration forms
   - Header component with dynamic content
   - Error handling and display

6. Lalitha:
   - Tailwind CSS implementation and styling
   - Responsive design
   - Accessibility improvements

## Getting Started
1. Clone the repository
2. Navigate to the `frontend-service` directory
3. Run `npm install` to install dependencies
4. Use `npm start` to run the development server

## Docker
The `Dockerfile` in the `frontend-service` directory will be used to containerize the frontend application. The `docker-compose.yml` file in the root of the project will orchestrate all services, including the frontend.

## JSON Data Structures

Here are the key JSON data structures that will be required from the backend:

1. Job Listing:
```json
{
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "location": "string",
      "shortDescription": "string",
      "postedDate": "string (ISO date)"
    }
  ]
}
```

2. Job Details:
```json
{
  "id": "string",
  "title": "string",
  "company": "string",
  "location": "string",
  "fullDescription": "string",
  "requirements": ["string"],
  "benefits": ["string"],
  "postedDate": "string (ISO date)",
  "applicationDeadline": "string (ISO date)",
  "hiringManagerId": "string"
}
```

3. User Application:
```json
{
  "id": "string",
  "jobId": "string",
  "jobTitle": "string",
  "company": "string",
  "appliedDate": "string (ISO date)",
  "status": "string (enum: applied, passedPreInterview, passed1stInterview, passed2ndInterview, offerMade, rejected)"
}
```

4. User Profile:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string (enum: admin, hiringManager, applicant)"
}
```

5. Hiring Manager:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "department": "string"
}
```

6. Authentication Response:
```json
{
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string (enum: admin, hiringManager, applicant)"
  }
}
```

## Next Steps
1. Set up the project structure and install necessary dependencies
2. Implement basic routing and create placeholder components for each page
3. Set up the Context API for state management
4. Implement authentication logic and protected routes
5. Start building out individual features, beginning with the job listing and job description pages
6. Integrate with the backend API as it becomes available
7. Implement styling using Tailwind CSS
8. Conduct thorough testing and bug fixing

Remember to communicate regularly with your team members and the backend team to ensure smooth integration and consistent data structures.
