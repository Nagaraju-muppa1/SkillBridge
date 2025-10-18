// src/components/Navbar.jsx
import React from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar-placeholder">
      <div className="logo">SkillBridge</div>
      <nav className="nav-links">
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