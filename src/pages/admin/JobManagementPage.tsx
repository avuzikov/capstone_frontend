import React from "react";
import { Link } from "react-router-dom";
import AdminJobList from "../../components/admin/AdminJobList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const JobManagementPage = () => {
    return (
        <div className="flex flex-col gap-3 p-large">
            <div className="flex justify-between items-center">
                <BackButton />
            </div>
            <div className="flex justify-between">
                <h1 className="text-large">Jobs</h1>
            </div>
            <AdminJobList />
        </div>
    );
};

export default JobManagementPage;
