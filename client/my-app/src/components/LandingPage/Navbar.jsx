// src/components/Navbar.jsx (MODIFIED)
import React from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"; // <-- IMPORT useUser
import { Link } from 'react-router-dom';

function Navbar() {
  const { isLoaded } = useUser(); // <-- Use the hook

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
          <Link to="/sign-in" className="nav-login-btn">
            Login / Register
          </Link>
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