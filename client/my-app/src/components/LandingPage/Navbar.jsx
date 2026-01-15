// src/components/Navbar.jsx (MODIFIED)
import {useState,React} from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"; // <-- IMPORT useUser
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { isLoaded } = useUser(); // <-- Use the hook
  const [dropDown,setDropDown]=useState(false);

  // 1. If Clerk hasn't finished loading, show a simple placeholder or return null
  if (!isLoaded) {
    // You can customize this, but returning null or a placeholder is safest
    return (
        <header className="navbar-placeholder">
            <div className="logo">SkillBridge</div>
        </header>
    ); 
  }

  // 2. Once loaded, the SignedIn/SignedOut components will work reliably
  return (
    <header className="navbar-placeholder">
      <div className="logo">SkillBridge</div>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-dashboard-link">
            Dashboard
        </Link>
        <a href="/#about">About</a>
        <a href="/#how-it-works">How It Works</a>
        <a href="/#vision">Vision</a>
        <a href="/#contact">Contact</a>
      </nav>
      
      <div className="auth-buttons">
        {/* This button shows only when the user is logged OUT */}
        <SignedOut>
        <div className="login-container">
          <button className="login-btn" onClick={() => setDropDown(!dropDown)}>
            Login / Register
          </button>

          {dropDown && (
            <div className="login-dropdown">
              <Link to="/sign-up" className="navlogin-btn" onClick={() => setDropDown(false)} state={{role:"learner"}}>
                Learner
              </Link>

              <Link to="/sign-up" className="navlogin-btn" onClick={() => setDropDown(false)} state={{ role: "professional" }}>
                Professional
              </Link>
            </div>
          )}
        </div>
      </SignedOut>
        {/* This profile icon shows only when the user is logged IN */}
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>
      </div>
    </header>
  );
}

export default Navbar;