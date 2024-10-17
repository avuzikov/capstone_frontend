# Hiring Platform Frontend

[... Previous sections remain unchanged ...]

## Questions to Discuss with Backend Team

1. Media Upload/Download:
   - Should we implement a feature for applicants to upload profile pictures?
   - What file size and format restrictions should be in place?

2. CV Upload:
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
