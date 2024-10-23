// src\components\applicant\ApplyButton.tsx

import React from 'react';
import { useNavigate } from 'react-router';

const ApplyButton = ({ id }: { id: string | undefined }) => {
  const navigate = useNavigate();

  const handleApply = (id: string | undefined) => {
    if (id) {
      navigate(`/apply/${id}`);
    }
  };

  return (
    <button className="btn-primary mt-3 w-full" onClick={() => handleApply(id)}>
      Apply now!
    </button>
  );
};

export default ApplyButton;
