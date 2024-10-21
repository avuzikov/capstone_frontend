import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Job } from "../../mocks/types";
import JobCard from "./JobCard.tsx";

const AdminJobList = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

    const { token } = useAuth();


    // fetch jobs

    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch("/api/job", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }

            const data = await response.json();

            console.log(data);

            setJobs(data.jobs);

        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchJobs();
        }
    }, [token, fetchJobs]);


    return (
        <div className="flex flex-col gap-3">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default AdminJobList;