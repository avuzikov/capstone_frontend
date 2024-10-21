import React from "react";
import UserForm from "../../components/admin/UserForm.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Link } from "react-router-dom";


const ProfilePage = () => {

    const { id } = useAuth();

    return (
        <UserForm isEditing={true} userId={id || ""} />
    )

}

export default ProfilePage;