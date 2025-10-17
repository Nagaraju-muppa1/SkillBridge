import React from 'react';

function Navbar() {
  return (
    <header className="navbar-placeholder">
      <div className="logo">SkillBridge</div>
      <nav className="nav-links">
        <a href="#introduction">About</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#vision">Vision</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="nav-login-btn">Login / Register</button>
    </header>
  );
}

export default Navbar;