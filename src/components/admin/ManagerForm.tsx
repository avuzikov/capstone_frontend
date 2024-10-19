import React, { useState, useEffect } from "react";
import Input from "../shared/Input.tsx";
import BackButton from "../shared/BackButton.tsx";
import { User } from "../../mocks/types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface ManagerFormProps {
  isEditing: boolean;
}

export interface RegistrationData extends User {
  password: string;
}

const ManagerForm: React.FC<ManagerFormProps> = ({ isEditing }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<RegistrationData>({
    id: 0,
    fullName: "",
    password: "",
    email: "",
    phone: "",
    department: "",
    role: "hiring-manager",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    password: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    const fetchManager = async () => {
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
        console.log(token);

        if (!token) {
          throw new Error("No token received");
        }

        const response = await fetch(`/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User = await response.json();
        setFormData((prevData) => ({
          ...data,
          password: prevData.password,
        }));
      } catch (error) {
        console.error("Failed to fetch manager data:", error);
      }
    };

    if (id) {
      fetchManager();
    }
  }, [id]);

  const createManager = async () => {
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
      console.log(token);

      if (!token) {
        throw new Error("No token received");
      }

      const response = await fetch("/users/registration/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create applicant");
      }

      const data = await response.json();
      console.log("Applicant created:", data);
    } catch (error) {
      console.error("Failed to create applicant:", error);
    }
  };

  const updateManager = async () => {
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

      const response = await fetch(`/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Forbidden: You do not have permission to update this applicant."
          );
        }
        throw new Error("Failed to update applicant");
      }

      const data = await response.json();
      console.log("Applicant updated:", data);
    } catch (error) {
      console.error("Failed to update applicant:", error);
    }
  };

  const deleteManager = async () => {
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

      const response = await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      navigate(-1);

      if (!response.ok) {
        throw new Error("Failed to delete applicant");
      }
    } catch (error) {
      console.error("Failed to delete applicant:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {
      fullName: "",
      password: "",
      email: "",
      phone: "",
      department: "",
    };

    if (!formData.fullName) {
      errors.fullName = "Full name is required";
    }
    if (!formData.password && !isEditing) {
      errors.password = "Password is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.phone && isEditing) {
      errors.phone = "Phone number is required";
    }
    if (!formData.department && isEditing) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);

    return Object.values(errors).every((err) => err === "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        updateManager();
      } else {
        createManager();
      }

      navigate(-1);
    }
  };

  return (
    <div className="m-medium">
      <BackButton />
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="card-bordered m-medium w-full lg:w-1/2"
        >
          <div className="p-large flex flex-col gap-4">
            <h1 className="text-large border-b-2 p-small">Manager Form</h1>

            <Input
              name="fullName"
              placeholder="Enter full name"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              error={formErrors.fullName}
            />
            {!isEditing && (
              <Input
                name="password"
                placeholder="Enter password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
              />
            )}
            <Input
              name="email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            {isEditing && (
              <>
                <Input
                  name="phone"
                  placeholder="Enter phone number"
                  type="text"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  error={formErrors.phone}
                />
                <Input
                  name="department"
                  placeholder="Enter department"
                  type="text"
                  value={formData.department || ""}
                  onChange={handleChange}
                  error={formErrors.department}
                />
              </>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              {isEditing && (
                <button
                  type="button"
                  onClick={deleteManager}
                  className="btn-destructive w-full"
                >
                  Delete
                </button>
              )}
              <button type="submit" className="btn-primary w-full">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerForm;
