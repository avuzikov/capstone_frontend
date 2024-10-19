import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../shared/BackButton.tsx";

const TableDisplay = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);


  const fetchTableData = useCallback(async () => {
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

      let url: string;

      // Ideally this will not be hardcoded later
      switch (name) {
        case "jobs":
          url = "/api/job?page=1&items=1000";
          break;
        case "users":
          url = "/users";
          break;
        case "applications":
          url = "/api/application?page=1&items=1000";
          break;
        default:
          url = "/api/default";
          break;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const data = await response.json();

      setTableData(data);

      const keys = data.reduce((acc: string[], row: Record<string, any>) => {
        Object.keys(row).forEach((key) => {
          if (!acc.includes(key)) {
            acc.push(key);
          }
        });
        return acc;
      }, []);
      setAllKeys(keys);
    } catch (error) {
      console.error("Failed to fetch table data:", error);
    }
  }, [name]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);


  const handleNavigation = (row: Record<string, any>) => {
    if (name === "users") {
      if (row.role === "applicant") {
        navigate(`/admin/applicant/${row.id}`);
      } else if (row.role === "hiring-manager") {
        navigate(`/admin/manager/${row.id}`);
      }
    } else if (name === "jobs") {
      navigate("/jobs");
    } else if (name === "applications") {
      navigate("/applications");
    }
  };

  return (
    <div className="flex flex-col gap-3 m-medium">
      <BackButton />
      <h1 className="text-large">
        {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Default Name"}
      </h1>

      <table className="table-auto" style={{ emptyCells: "show" }}>
        <thead>
          <tr className="bg-gray-100">
            {allKeys.map((key) => (
              <th
                key={key}
                className="border text-medium font-normal px-4 py-2"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr
              className="text-center hover:underline cursor-pointer"
              key={rowIndex}
              onClick={() => handleNavigation(row)}
            >
              {allKeys.map((key, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {row[key] !== null &&
                  row[key] !== undefined &&
                  row[key] !== ""
                    ? row[key]
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDisplay;
