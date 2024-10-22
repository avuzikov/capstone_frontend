import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import UserManagementPage from "./UserManagementPage";
import { AuthProvider } from "../../contexts/AuthContext";

describe("UserManagementPage", () => {
    it("renders without error", () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                        <UserManagementPage/>
                </MemoryRouter>
            </AuthProvider>
        );
    });
});

