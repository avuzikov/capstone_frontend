import React, { useEffect, useState } from "react";
import { User, Job } from "../../mocks/types.ts";

interface JobTransferCardProps {
  currentManagerId: string;
  jobs: Job[];
}

const JobTransferCard: React.FC<JobTransferCardProps> = ({
  currentManagerId,
  jobs,
}) => {
  const [managers, setManagers] = useState<User[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");

  const fetchManagers = async () => {
    try {
      const loginResponse = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "password",
        }),
      });
      if (!loginResponse.ok) {
        throw new Error("Failed to login");
      }

      const token = loginResponse.headers.get("Authorization");

      if (!token) {
        throw new Error("No token received");
      }

      const response = await fetch("/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();

      const managers = data.filter((user) => user.role === "hiring-manager");

      setManagers(managers);
    } catch (err) {
      console.error(err);
    }
  };

  const transferJobs = async () => {
    const loginResponse = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "password",
      }),
    });
    if (!loginResponse.ok) {
      throw new Error("Failed to login");
    }

    const token = loginResponse.headers.get("Authorization");

    if (!token) {
      throw new Error("No token received");
    }

    console.log(token);

    for (const job of jobs) {
      const response = await fetch("/api/job/transfer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          jobId: job.id,
          fromUserId: currentManagerId,
          toUserId: selectedManagerId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to transfer job", job.id);
      }

      const data = await response.json();

      console.log("Job transferred:", data);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="card-bordered m-medium w-full lg:w-1/2">
      <div className="p-large">
        <h1 className="text-large border-b-2 p-small">Transfer Jobs</h1>

        <div className="flex gap-2 mt-4">
          <p>Select Manager:</p>

          <select
            name="manager"
            id="manager"
            className="input-filled"
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
          >
            {managers
              .filter((manager) => manager.id.toString() !== currentManagerId)
              .map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName}
                </option>
              ))}
          </select>
        </div>

        <button className="btn-primary mt-4 w-full" onClick={transferJobs}>
          Transfer Jobs
        </button>
      </div>
    </div>
  );
};

export default JobTransferCard;
