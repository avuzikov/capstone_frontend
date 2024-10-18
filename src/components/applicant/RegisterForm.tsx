import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../shared/Input.tsx";
import { isNotEmpty, isValidEmail } from "../../utils/validateInput.ts";
import useFetch from "../../hooks/useFetch.tsx";
import { register } from "../../services/api.ts";
import { UserRegistration } from "../../types/User.ts";
import LoadingSpinner from "../shared/LoadingSpinner.tsx";

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
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  } as RegisterFormType);
  const [errors, setErrors] = useState({} as RegisterFormErrors);
  const { isPending, error, fetchDispatch } = useFetch(register);
  const [wasRegisterSend, setWasRegisterSend] = useState(false);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (foundErrors()) {
      return;
    }

    const body: UserRegistration = {
      email: data.email,
      password: data.password,
      name: data.firstName + " " + data.lastName,
    };

    setWasRegisterSend(true);
    await fetchDispatch(body);
  };

  const handleChange = (
    field: Field,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((currentData) => ({ ...currentData, [field]: event.target.value }));
    checkErrors(field, event.target.value);
  };

  useEffect(() => {
    if (wasRegisterSend && !isPending && !error) {
      setWasRegisterSend(false);
      navigate("/profile");
    }
    if (wasRegisterSend && !isPending && error) {
      setWasRegisterSend(false);
    }
  }, [isPending, error, wasRegisterSend, navigate]);

  return (
    <div className="p-large rounded-lg w-[28rem]">
      <h2 className="text-xl text-adp-navy text-center m-medium">
        Register a new user
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-4 justify-items-stretch">
          <div className="flex-grow">
            <Input
              name="First Name"
              placeholder="First Name"
              value={data.firstName}
              onChange={(event) => handleChange("firstName", event)}
              error={errors.firstName}
            />
          </div>
          <div className="flex-grow">
            <Input
              name="Last Name"
              placeholder="Last Name"
              value={data.lastName}
              onChange={(event) => handleChange("lastName", event)}
              error={errors.lastName}
            />
          </div>
        </div>
        <Input
          name="Email"
          placeholder="example@example.com"
          type="email"
          value={data.email}
          onChange={(event) => handleChange("email", event)}
          error={errors.email}
        />
        <Input
          name="Password"
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={(event) => handleChange("password", event)}
          error={errors.password}
        />
        <Input
          name="Confirm password"
          placeholder="Confirm password"
          type="password"
          value={data.confirmPassword}
          onChange={(event) => handleChange("confirmPassword", event)}
          error={errors.confirmPassword}
        />
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

            <p className="txt-danger txt-small">{error.message}</p>
          </div>
        )}
        <div className="flex justify-end">
          {isPending && <LoadingSpinner color="adp-navy-dark" size="small" />}
          {!isPending && (
            <button className="mt-4 btn-primary" type="submit">
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
