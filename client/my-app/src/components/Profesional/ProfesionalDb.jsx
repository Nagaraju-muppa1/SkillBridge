import React from "react";
import "./Profesional.css";

function ProfesionalDb() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SkillBridge</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Appointments</li>
            <li>Messages</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, Professional</h1>
          <p>Here's an overview of your activity</p>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Sessions</h3>
            <p>12 this week</p>
          </div>
          <div className="card">
            <h3>Messages</h3>
            <p>5 unread</p>
          </div>
          <div className="card">
            <h3>Rating</h3>
            <p>4.8 / 5</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfesionalDb;
