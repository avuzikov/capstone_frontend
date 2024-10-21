import React, { useEffect, useState } from "react";

type Applicant = {
    id: number, 
    userId: number, 
    jobId: number, 
    dateApplied: Date, 
    applicationStatus: string,
    coverLetter: string,
    customResume: string
};

const ApplicantList = () => {
    const [user, setUser] = useState<Applicant | null>(null);
    const [placeholderMessage, setPlaceholderMessage] = useState('Loading...');


    const baseUrl = '/api/application/1';
    const MyInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    //TODO: Remove console.log statements outside of error catching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl, MyInit);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);

                if (data && typeof data === 'object') {
                    setUser(data);
                } else {
                    console.error('Fetched data is not an object:', data);
                }
            } catch (error) 
            {
                console.log("Error fetching data:", error);
                if (error.message.includes('403')) {
                  console.log('Setting placeholder message for caught 403 error');
                  setPlaceholderMessage('You are not authorized to view this page.');
              }
            }
        };
        fetchData();
    }, []);


    const outputTable = (item) =>
    {
      return(
        <tr key={item.user.id} className="border-b hover:bg-adp-gray">
          <td className="px-6 py-4">{item.user.userId}</td>
          <td className="px-6 py-4">{item.user.jobId}</td>
          <td className="px-6 py-4">{item.user.dateApplied.toString()}</td>
          <td className="px-6 py-4">{item.user.applicationStatus}</td>
          <td className="px-6 py-4">{item.user.coverLetter}</td>
          <td className="px-6 py-4">{item.user.customResume}</td>
      </tr>
      );
    }

    //TODO: Map the user object for multiple users
    return (
        <div className="boxed m-medium">
            <h1 className="text-large px-6 py-4">Applicant Details</h1>      
            {user ? (
              <table>
                <thead>
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Job ID</th>
                  <th className="px-6 py-4">Date Applied</th>
                  <th className="px-6 py-4" >Application Status</th>
                  <th className="px-6 py-4" >Cover Letter</th>
                  <th className="px-6 py-4" >Resume</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b hover:bg-adp-gray">
                  <td className="px-6 py-4">{user.userId}</td>
                  <td className="px-6 py-4">{user.jobId}</td>
                  <td className="px-6 py-4">{user.dateApplied.toString()}</td>
                  <td className="px-6 py-4">{user.applicationStatus}</td>
                  <td className="px-6 py-4">{user.coverLetter}</td>
                  <td className="px-6 py-4">{user.customResume}</td>
                </tr>
                {/* {user.map(outputTable)} */}
                </tbody>
              </table>
            ) : (
              <div>
                {/* {placeholderMessage &&
                <p className="text-medium px-6 py-4">{placeholderMessage}</p>} */}
              </div>
                
            )}
        </div>
    );
};

export default ApplicantList;