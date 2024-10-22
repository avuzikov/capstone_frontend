import React, { useState, FormEvent } from 'react';

const JobSearchForm = ({ setSearchQuery }: { setSearchQuery: (query: string) => void }) => {
  const [input, setInput] = useState('');
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(input.toLowerCase());
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    if (event.currentTarget.value === '') {
      setSearchQuery('');
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            className="border min-w-[24rem] border-gray-300 transition-colors hover:border-adp-navy py-2 pr-2 pl-11 shadow-sm text-small rounded-md"
            placeholder="Search..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>
    </div>
  );
};

export default JobSearchForm;
