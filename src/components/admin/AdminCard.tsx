import {Link } from "react-router-dom";
import React from "react";

const AdminCard = (link) => {
        return (
            <Link to={link} className="w-full">
            <div className="card-bordered cursor-pointer flex flex-col gap-2 h-48 text-center  justify-center items-center  ">
                <h1>{'Tom'}</h1>
                <p>Tom@example.com</p>
                <p>0712345678</p>
            </div>
            </Link>
        );
    }


