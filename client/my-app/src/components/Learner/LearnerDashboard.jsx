import React from "react";
import "./LearnerDb.css";

function LearnerDashboard() {
  return (
    <div className="learner-dashboard-container">
      <aside className="learner-sidebar">
        <h2>SkillBridge</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>My Courses</li>
            <li>Sessions</li>
            <li>Messages</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="learner-main-content">
        <header className="learner-header">
          <h1>Welcome, Learner</h1>
          <p>Your progress overview</p>
        </header>

        <section className="learner-cards">
          <div className="learner-card">
            <h3>Enrolled Courses</h3>
            <p>4 courses</p>
          </div>
          <div className="learner-card">
            <h3>Upcoming Sessions</h3>
            <p>2 this week</p>
          </div>
          <div className="learner-card">
            <h3>Messages</h3>
            <p>3 unread</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LearnerDashboard;
