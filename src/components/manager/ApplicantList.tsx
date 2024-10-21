import React from 'react';
import ApplicantStatusUpdate from './ApplicantStatusUpdate';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted';

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

interface Application {
    id: number;
    userId: number;
    jobId: number;
    dateApplied: string;
    applicationStatus: ApplicationStatus;
    coverLetter: string;
    customResume: string;
}

interface ApplicantListProps {
  applicants: (Application & { user: User })[];
  onStatusChange: (applicantId: number, newStatus: ApplicationStatus) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ applicants, onStatusChange }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {applicants.map((applicant) => (
          <tr key={applicant.id}>
            <td className="px-6 py-4 whitespace-nowrap">{applicant.user.fullName}</td>
            <td className="px-6 py-4 whitespace-nowrap">{new Date(applicant.dateApplied).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap">{applicant.applicationStatus}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <ApplicantStatusUpdate
                currentStatus={applicant.applicationStatus}
                onStatusChange={(newStatus) => onStatusChange(applicant.id, newStatus)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicantList;