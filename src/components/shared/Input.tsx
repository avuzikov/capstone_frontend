import React from "react";

interface InputProps {
  name: string; 
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  type = "text",
  isTextArea = false,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="txt-small pl-2.5">
        {name}
      </label>
      {isTextArea ? (
        <textarea
          name={name} 
          id={name}
          placeholder={placeholder}
          className="input-bordered"
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          name={name} // Changed to 'name'
          type={type}
          placeholder={placeholder}
          className="input-bordered"
          value={value}
          onChange={onChange}
        />
      )}
      {error && (
        <div className="input-error mt-1 flex gap-2 items-center text-small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>

          <p className="txt-danger txt-small">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
