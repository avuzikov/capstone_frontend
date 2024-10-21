import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import {fecthApplications} from "../contexts/JobApi.tsx";
import ApplicationList from "../components/applicant/ApplicationList.tsx";

interface Application {
    id: number;
    userId: number;
    jobId: number;
    dateApplied: string; 
    applicationStatus: 'pending' | 'accepted' | 'rejected'; 
    coverLetter: string;
    customResume: string;
  }

const ApplicationsPage: React.FC = () => {

    const [applications, setApplications] = useState<any[]>([]);
    const {token} = useAuth();
    const {id} = useAuth();
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10); 

    const [loading, setLoading] = useState(false);


    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
            const data = await fecthApplications(page, itemsPerPage, token);
            const filteredApplications = data.filter((application: Application) => application.userId.toString() === id);
            console.log(filteredApplications);
            console.log("user id: " + id) 
            setApplications(filteredApplications); 
            } catch (error) {
            console.error('Error fetching applications:', error);
            } finally{
            setLoading(false)
            }
        };

        fetchData(); 
    }, [page, itemsPerPage, token]);

    


    return(
        <div>
            <div className="container mx-auto p-4">
            {loading ? (<p>Loading applications...</p>) : (<ApplicationList applications={applications}/>)}

            <div className="flex justify-between items-center p-medium">
            <button
                className="btn-primary m-small text-normal"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >Previous</button>
            
            <span className="text-medium">Page {page}</span>
            <button
                className="btn-primary m-small text-normal"
                onClick={() => setPage((prev) => prev + 1)}
            > Next</button>
            </div>
            </div>
        </div>
    )
}
export default ApplicationsPage;