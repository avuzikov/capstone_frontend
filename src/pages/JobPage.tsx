import React, { useState } from "react";
import JobList from "../components/applicant/JobList";
import {fetchJobs} from "../contexts/JobApi";
import { useAuth } from "../contexts/AuthContext";

const JobPage: React.FC = () => {
    
    const {token} = useAuth();
    const {id} = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10); 
    const [searchQuery, setSearchQuery] = useState('');
    
    React.useEffect(() => {
        const loadJobs = async () => {
          setLoading(true);
          try {
            const data = await fetchJobs(page, itemsPerPage, searchQuery, token);
            setJobs(data.jobs);
          } catch (error) {
            console.error('Error fetching jobs:', error);
          } finally {
            setLoading(false);
          }
        };
        loadJobs();
      }, [page, itemsPerPage, searchQuery]);

    return (
        <div>
          <div className="container mx-auto p-4">
            
            {loading ? (<p>Loading jobs...</p>) : (<JobList jobs={jobs} token={token} userId={id}/>)}

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
      );
}

export default JobPage;