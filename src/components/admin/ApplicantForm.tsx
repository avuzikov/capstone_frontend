import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Input from "../shared/Input.tsx";
import BackButton from "../shared/BackButton.tsx";
import { User } from "../../mocks/types";

interface ApplicantFormProps {
  isEditing: boolean;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ isEditing }) => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<User>({
    id: 0,
    fullName: "",
    email: "",
    address: "",
    phone: "",
    resume: "",
    role: "applicant",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    resume: "",
  });

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const loginResponse = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: 'admin@example.com',
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
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch applicant data:", error);
      }
    };

    if (id) {
      fetchApplicant();
    }
  }, [id]);

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
      email: "",
      address: "",
      phone: "",
      resume: "",
    };

    if (!formData.fullName) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    }
    if (!formData.resume) {
      errors.resume = "Resume is required";
    }

    setFormErrors(errors);

    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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
            <h1 className="text-large border-b-2 p-small">Applicant Form</h1>

            <Input
              name="fullName"
              placeholder="Enter full name"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              error={formErrors.fullName}
            />
            <Input
              name="email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            <Input
              name="address"
              placeholder="Enter address"
              type="text"
              value={formData.address || ""}
              onChange={handleChange}
              error={formErrors.address}
            />
            <Input
              name="phone"
              placeholder="Enter phone number"
              type="text"
              value={formData.phone || ""}
              onChange={handleChange}
              error={formErrors.phone}
            />
            <Input
              name="resume"
              placeholder="Enter resume"
              isTextArea={true}
              value={formData.resume || ""}
              onChange={handleChange}
              error={formErrors.resume}
            />

            <div className="flex gap-3 mt-4 justify-end">
              {isEditing && (
                <button type="button" className="btn-destructive w-full">
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

export default ApplicantForm;
