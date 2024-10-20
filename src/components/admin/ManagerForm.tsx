import React, { useState } from "react";
import Input from "../shared/Input";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card-bordered m-medium">
      <div className="p-large flex flex-col gap-4">
        <h1 className="text-large border-b-2 p-small">Manager Form</h1>

        <Input
          name="Full Name" 
          placeholder="Enter full name"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          name="Email"
          placeholder="Enter email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="Address" 
          placeholder="Enter address"
          type="text"
          value={formData.address}
          onChange={handleChange}
        />
        <Input
          name="Phone" 
          placeholder="Enter phone number"
          type="text"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          name="Resume" 
          placeholder="Enter resume"
          isTextArea={true} 
          value={formData.resume}
          onChange={handleChange}
        />
        <Input
          name="Department" 
          placeholder="Enter department"
          type="text"
          value={formData.department}
          onChange={handleChange}
        />
        <Input
          name="Role" 
          placeholder="Enter role"
          type="text"
          value={formData.role}
          onChange={handleChange}
        />

        <div className="flex gap-3 justify-end">
          <button className="btn-destructive mt-4" type="button">
            Delete
          </button>
          <button type="submit" className="btn-primary mt-4">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManagerForm;
