import React from "react";
import { Link } from "react-router-dom";
import UserList from "../../components/admin/UserList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const UserManagementPage = () => {
  return (
    <div className="flex flex-col gap-3 p-large">
      <div className="flex justify-between items-center">
        <BackButton />
        <Link to="/admin/newUser">
          <button className="btn-primary">New User</button>
        </Link>
      </div>
      <div className="flex justify-between">
        <h1 className="text-large">Users</h1>
      </div>

      <UserList />
    </div>
  );
};

export default UserManagementPage;
