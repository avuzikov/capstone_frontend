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
    const [users, setUsers] = useState<Applicant[]>([]);
    const [placeholderMessage, setPlaceholderMessage] = useState('Loading...');

    const baseUrl = '/api/application';
    const MyInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl, MyInit);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.message.includes('403') || error.message.includes('401')) {
                    setPlaceholderMessage('You are not authorized to view this page.');
                }
            }
        };
        fetchData();
    }, []);

    const outputTable = (item: Applicant) => {
        return (
            <tr key={item.id} className="border-b hover:bg-adp-gray">
                <td className="px-6 py-4">{item.userId}</td>
                <td className="px-6 py-4">{item.jobId}</td>
                <td className="px-6 py-4">{item.dateApplied.toString()}</td>
                <td className="px-6 py-4">{item.applicationStatus}</td>
                <td className="px-6 py-4">{item.coverLetter}</td>
                <td className="px-6 py-4">{item.customResume}</td>
            </tr>
        );
    };

    return (
        <div className="boxed m-medium">
            <h1 className="text-large px-6 py-4">Applicant Details</h1>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Job ID</th>
                            <th className="px-6 py-4">Date Applied</th>
                            <th className="px-6 py-4">Application Status</th>
                            <th className="px-6 py-4">Cover Letter</th>
                            <th className="px-6 py-4">Resume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(outputTable)}
                    </tbody>
                </table>
            ) : (
                <div>
                    <p className="text-medium px-6 py-4">{placeholderMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ApplicantList;
