import React from "react";
import { useState, useEffect } from "react";
import ApplicantCard from "./ApplicantCard.tsx";
import { User } from '../../mocks/types';


const ApplicantList = () => {
    const [applicants, setApplicants] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchApplicants = async () => {
          try {
            const loginResponse = await fetch('/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password'
              }),
            });
    
            if (!loginResponse.ok) {
              throw new Error('Failed to login');
            }
    
            const token = loginResponse.headers.get('Authorization');
            console.log(token)
    
            if (!token) {
              throw new Error('No token received');
            }
    
            const response = await fetch('/users', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch users');
            }
    
            const data: User[] = await response.json();
            const managers = data.filter(user => user.role === 'applicant');
    
            setApplicants(managers);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchApplicants();
      }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div className="flex flex-col gap-4">
        {applicants.map(applicant => (
          <ApplicantCard key={applicant.id} applicant={applicant} link={`/admin/applicant/${applicant.id}`} />
        ))}
      </div>
    );
};

export default ApplicantList;
