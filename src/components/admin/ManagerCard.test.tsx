import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManagerCard from "./ManagerCard";
import { User } from "../types/User.ts";


const mockManager: User = {
  id: 1,
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: 'password',
  role: 'hiring-manager',
  phone: "123-456-7890",
  department: "Engineering"
};

describe("ManagerCard", () => {
  it("renders the manager's full name, email, phone, and department", () => {
    const { getByText } = render(
      <Router>
        <ManagerCard link="/manager/1" manager={mockManager} />
      </Router>
    );

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("john.doe@example.com")).toBeInTheDocument();
    expect(getByText("123-456-7890")).toBeInTheDocument();
    expect(getByText("Engineering")).toBeInTheDocument();
  });

  it("renders the correct link", () => {
    const { container } = render(
      <Router>
        <ManagerCard link="/manager/1" manager={mockManager} />
      </Router>
    );

    const linkElement = container.querySelector("a");
    expect(linkElement).toHaveAttribute("href", "/manager/1");
  });
});
