import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import profileImg from "../assets/profile.jpg";
import "./Navigation.css";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
    setOpenMenu(false);
  };

  const handleLogout = () => {
    // TODO: clear auth / token
    console.log("Logged out");
    //navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <h2 className="logo" onClick={() => navigate("/")}>SkillBridge</h2>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search professionals, skills..."
          className="search-input"
        />
      </div>

      {/* Right */}
      <div className="navbar-right">
        <span className="icon">🔔</span>

        {/* Profile */}
        <img
          src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-No-Background.png"
          alt="Profile"
          className="profile-img"
          onClick={handleProfileClick}
        />

        {/* Menu Icon */}
        <span className="menu-icon" onClick={() => setOpenMenu(!openMenu)}>
          ☰
        </span>

        {/* Dropdown */}
        {openMenu && (
          <div className="dropdown">
            <div onClick={handleProfileClick}>Profile</div>
            <div onClick={handleLogout} className="logout">Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
