import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

function Completed() {

  const [sessions, setSessions] = useState([]);
  const { UserId } = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  // 🔹 Fetch Completed + Cancelled
  const fetchCompletedSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/fetchRequests/${UserId}`
      );

      const data = response.data.data || [];

      // 🔥 Filter only Completed & Cancelled
      const completedSessions = data.filter(
        (session) =>
          session.status === "Completed" ||
          session.status === "Cancelled"
      );

      setSessions(completedSessions);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="requests-container">

      {sessions.length === 0 && <p>No sessions completed.</p>}

      {sessions.map((session) => (
        <div key={session._id} className="request-card">

          {/* 🔹 Header */}
          <div className="card-header">
            <h3>{session.learnerName}</h3>
            <span
              className={`status ${
                session.status === "Completed"
                  ? "completed"
                  : "cancelled"
              }`}
            >
              {session.status}
            </span>
          </div>

          {/* 🔹 Body */}
          <div className="card-body">
            <p>
              <b>Date:</b>{" "}
              {new Date(session.date).toLocaleDateString()}
            </p>
            <p>
              <b>Time:</b> {session.startTime} - {session.endTime}
            </p>
            <p>
              <b>Description:</b> {session.description}
            </p>
          </div>

        </div>
      ))}

    </div>
  );
}

export default Completed;