// src\components\admin\TableDisplay.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../shared/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { data } from '@remix-run/router';
import { table } from 'console';

const TableDisplay = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { token } = useAuth();

  const fetchTableData = useCallback(async () => {
    try {
      let url: string;

      switch (name) {
        case 'jobs':
          url = 'http://localhost:8000/api/job';
          break;
        case 'users':
          url = 'http://localhost:8180/users/admin/1';
          break;
        case 'applications':
          url = 'http://localhost:8000/api/application/';
          break;
        default:
          url = '/api/default';
          break;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();


      if (name === 'applications') {
        data.forEach((application: any) => {
          delete application.job;
        });
        setTableData(data);
      } else {
        setTableData(data);
      }

      console.log(tableData);
      

      const keys = (Array.isArray(data.jobs || data) ? data.jobs || data : []).reduce(
        (acc: string[], row: Record<string, any>) => {
          Object.keys(row).forEach(key => {
            if (!acc.includes(key) && key !== 'password') {
              acc.push(key);
            }
            if (key.includes('date')) {
              row[key] = new Date(row[key]).toLocaleDateString();
            }
          });
          return acc;
        },
        []
      );
      setAllKeys(keys);

      console.log(keys);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch table data:', error);
    }
  }, [name, token]);

  useEffect(() => {
    if (token) {
      fetchTableData();

      console.log(data);
    }
  }, [token, fetchTableData]);

  const handleNavigation = (row: Record<string, any>) => {
    if (name === 'users') {
      if (row.role === 'admin') {
        alert('Admins cannot be modified!');
      } else if (row.role === 'applicant') {
        navigate(`/admin/user/${row.id}`);
      } else if (row.role === 'hiring-manager') {
        navigate(`/admin/manager/${row.id}`);
      }
    } else if (name === 'jobs') {
      navigate(`/jobs/${row.id}`);
    } else if (name === 'applications') {
      navigate(`/applications/${row.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 m-medium">
        <BackButton />
        <h1 className="text-large">
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Default Name'}
        </h1>
        <div>Loading...</div>
      </div>
    );
  }

  const renderTable = (data: Record<string, any>[], title: string) => (
    <div className="overflow-x-auto w-full mb-4">
      <h2 className="text-normal  mb-1 pl-small">{title}</h2>
      <table className="table-auto w-full" style={{ emptyCells: 'show' }}>
        <thead>
          <tr className="bg-gray-100">
            {allKeys.map(key => (
              <th key={key} className="border font-normal px-4 py-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              className="text-center hover:underline cursor-pointer"
              key={rowIndex}
              onClick={() => handleNavigation(row)}
            >
              {allKeys.map((key, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {row[key] !== null && row[key] !== undefined && row[key] !== '' ? row[key] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const admins = tableData.filter(row => row.role === 'admin');
  const applicants = tableData.filter(row => row.role === 'applicant');
  const managers = tableData.filter(row => row.role === 'hiring-manager');

  return (
    <div className="flex flex-col gap-3 m-medium">
      <BackButton />
      <h1 className="text-large">
        {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Default Name'}
      </h1>
      {name === 'jobs' && renderTable(tableData, '')}
      {name === 'applications' && renderTable(tableData, '')}
      {name === 'users' && (
        <>
          {renderTable(admins, 'Admins')}
          {renderTable(applicants, 'Applicants')}
          {renderTable(managers, 'Hiring Managers')}
        </>
      )}
    </div>
  );
};

export default TableDisplay;
