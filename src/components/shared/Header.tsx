import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  
  // Change active state when this becomes available
  const [activeItem, setActiveItem] = useState("Home");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };


  return (
    <nav className="flex bg-adp-red text-adp-white p-large justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="adp-white.svg" alt="Logo" className="img-small mb-small" />
        <h1 className="text-large">Talent Site</h1>
      </div>

      <ul className="flex gap-4">
        {["Home", "Profile", "Applications", "Jobs", "Admin"].map((item) => (
          <li key={item} className="cursor-pointer p-small">
          <Link
            to={`/${item.toLowerCase()}`}
            className={`hover:underline p-small ${
              activeItem === item
                ? "bg-adp-white text-adp-red rounded-md"
                : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </Link>
        </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;