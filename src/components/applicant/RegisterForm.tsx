import React, { FormEvent, useState } from "react";
import Input from "../shared/Input.tsx";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
};

const RegisterForm = () => {
  const [errors, setErrors] = useState({} as RegisterFormErrors);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const formData = Object.fromEntries(fd.entries());

    console.log("Provided data:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/3 mx-auto bg-adp-gray p-large rounded-xl shadow-md"
    >
      <h2 className="text-xl m-medium">Register</h2>
      <div className="flex gap-4 justify-items-stretch">
        <div className="flex-grow">
          <Input
            title="First Name"
            placeholder="First Name"
            type="text"
            isTextArea={false}
            error={errors.firstName}
          />
        </div>
        <div className="flex-grow">
          <Input
            title="Last Name"
            placeholder="Last Name"
            type="text"
            isTextArea={false}
            error={errors.lastName}
          />
        </div>
      </div>
      <Input
        title="Email"
        placeholder="example@example.com"
        type="email"
        isTextArea={false}
        error={errors.email}
      />
      <Input
        title="Password"
        placeholder="Password"
        type="password"
        isTextArea={false}
        error={errors.password}
      />
      <Input
        title="Confirm password"
        placeholder="Confirm password"
        type="password"
        isTextArea={false}
        error={errors.confirmPassword}
      />
      <div className="flex justify-end">
        <button className="mt-4 btn-primary" type="submit">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
