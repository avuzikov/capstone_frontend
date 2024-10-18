import React, { useState } from "react";
import Input from "../shared/Input.tsx";
import BackButton from "../shared/BackButton.tsx";

interface ApplicantFormProps {
  isEditing: boolean;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ isEditing }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Address: "",
    Phone: "",
    Resume: "",
  });
  const [formErrors, setFormErrors] = useState({
    Name: "",
    Email: "",
    Address: "",
    Phone: "",
    Resume: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.values(errors).some((error) => error !== "")) {
      setFormErrors(errors);
      return;
    }
    // TODO: Submit form logic
    console.log(formData);
  };

  const validateForm = () => {
    const errors: {
      Name: string;
      Email: string;
      Address: string;
      Phone: string;
      Resume: string;
    } = {
      Name: "",
      Email: "",
      Address: "",
      Phone: "",
      Resume: "",
    };
    if (!formData.Name) errors.Name = "Name is required";
    if (!formData.Email) errors.Email = "Email is required";
    if (!formData.Address) errors.Address = "Address is required";
    if (!formData.Phone) errors.Phone = "Phone is required";
    if (!formData.Resume) errors.Resume = "Resume is required";
    return errors;
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
            name="Name"
            placeholder="Enter full name"
            type="text"
            value={formData.Name}
            onChange={handleChange}
            error={formErrors.Name}
          />
          <Input
            name="Email"
            placeholder="Enter email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            error={formErrors.Email}
          />
          <Input
            name="Address"
            placeholder="Enter address"
            type="text"
            value={formData.Address}
            onChange={handleChange}
            error={formErrors.Address}
          />
          <Input
            name="Phone"
            placeholder="Enter phone number"
            type="text"
            value={formData.Phone}
            onChange={handleChange}
            error={formErrors.Phone}
          />
          <Input
            name="Resume"
            placeholder="Enter resume"
            isTextArea={true}
            value={formData.Resume}
            onChange={handleChange}
            error={formErrors.Resume}
          />

          <div className="flex gap-3 justify-end">
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
