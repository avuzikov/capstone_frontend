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
    <button
      className="py-1.5 px-3 bg-adp-red text-adp-white border border-adp-red-light rounded-md shadow-sm hover:bg-adp-red-light transition-colors w-full mt-2 text-medium"
      onClick={() => handleApply(id)}
    >
      Apply now!
    </button>
  );
};

export default ApplyButton;
