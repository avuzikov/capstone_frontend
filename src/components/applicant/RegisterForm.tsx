import React, { ChangeEvent, FormEvent, useState } from "react";

import Input from "../shared/Input.tsx";
import { isNotEmpty, isValidEmail } from "../../utils/validateInput.ts";

interface RegisterFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterFormErrors = {
  [K in keyof RegisterFormType]: RegisterFormType[K] | undefined;
};

type Field = keyof RegisterFormType;

const RegisterForm = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  } as RegisterFormType);
  const [errors, setErrors] = useState({} as RegisterFormErrors);

  const checkErrors = (
    field: Field,
    value: string,
    wasError?: boolean
  ): boolean => {
    if (field === "email") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: isValidEmail(value) ? undefined : "Enter valid email address",
      }));
      return wasError || !isValidEmail(value);
    }

    if (field === "confirmPassword") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: value === data.password ? undefined : "Password must match",
      }));
      return wasError || !(value === data.password);
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: isNotEmpty(value) ? undefined : "Field cannot be empty",
    }));
    return wasError || !isNotEmpty(value);
  };

  const foundErrors = () => {
    let error = false;
    for (let key in data) {
      const field = key as Field;
      error = checkErrors(field, data[field], error);
    }
    return error;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (foundErrors()) {
      return;
    }

    const body = {
      email: data.email,
      password: data.password,
      name: data.firstName + " " + data.lastName,
    };

    // TODO: add API calls
    console.log(body);
  };

  const handleChange = (
    field: Field,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((currentData) => ({ ...currentData, [field]: event.target.value }));
    checkErrors(field, event.target.value);
  };

  return (
    <div className="p-large rounded-lg w-[28rem]">
      <h2 className="text-xl text-adp-navy text-center m-medium">
        Register a new user
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-4 justify-items-stretch">
          <div className="flex-grow">
            <Input
              title="First Name"
              placeholder="First Name"
              value={data.firstName}
              onChange={(event) => handleChange("firstName", event)}
              error={errors.firstName}
            />
          </div>
          <div className="flex-grow">
            <Input
              title="Last Name"
              placeholder="Last Name"
              value={data.lastName}
              onChange={(event) => handleChange("lastName", event)}
              error={errors.lastName}
            />
          </div>
        </div>
        <Input
          title="Email"
          placeholder="example@example.com"
          type="email"
          value={data.email}
          onChange={(event) => handleChange("email", event)}
          error={errors.email}
        />
        <Input
          title="Password"
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={(event) => handleChange("password", event)}
          error={errors.password}
        />
        <Input
          title="Confirm password"
          placeholder="Confirm password"
          type="password"
          value={data.confirmPassword}
          onChange={(event) => handleChange("confirmPassword", event)}
          error={errors.confirmPassword}
        />
        <div className="flex justify-end">
          <button className="mt-4 btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
