import React, { ChangeEvent, FormEvent, useState } from "react";
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
  const [data, setData] = useState({} as RegisterForm);
  const [errors, setErrors] = useState({} as RegisterFormErrors);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const formData = Object.fromEntries(fd.entries());

    console.log("Provided data:", formData);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/3 mx-auto my-10 bg-adp-gray p-large rounded-xl shadow-md"
    >
      <h2 className="text-xl m-medium">Register</h2>
      <div className="flex gap-4 justify-items-stretch">
        <div className="flex-grow">
          <Input
            name="First Name"
            placeholder="First Name"
            value={data.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
        </div>
        <div className="flex-grow">
          <Input
            name="Last Name"
            placeholder="Last Name"
            value={data.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>
      </div>
      <Input
        name="Email"
        placeholder="example@example.com"
        type="email"
        value={data.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="Password"
        placeholder="Password"
        type="password"
        value={data.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        name="Confirm password"
        placeholder="Confirm password"
        type="password"
        value={data.confirmPassword}
        onChange={handleChange}
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
