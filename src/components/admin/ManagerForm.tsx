import React, { useState } from "react";
import Input from "../shared/Input.tsx";

const ManagerForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    resume: "",
    department: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <Input
        title="Full Name"
        placeholder="Enter full name"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
      />
      <Input
        title="Email"
        placeholder="Enter email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        title="Address"
        placeholder="Enter address"
        type="text"
        value={formData.address}
        onChange={handleChange}
      />
      <Input
        title="Phone"
        placeholder="Enter phone number"
        type="text"
        value={formData.phone}
        onChange={handleChange}
      />
      <Input
        title="Resume"
        placeholder="Enter resume"
        isTextArea={true}
        value={formData.resume}
        onChange={handleChange}
      />
      <Input
        title="Department"
        placeholder="Enter department"
        type="text"
        value={formData.department}
        onChange={handleChange}
      />
      <Input
        title="Role"
        placeholder="Enter role"
        type="text"
        value={formData.role}
        onChange={handleChange}
      />
      <button type="submit" className="btn-primary mt-4">
        Submit
      </button>
    </form>
  );
};

export default ManagerForm;