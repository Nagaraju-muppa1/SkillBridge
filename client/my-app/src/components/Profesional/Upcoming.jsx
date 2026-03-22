import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

function Upcoming() {

  const [sessions, setSessions] = useState([]);
  const { UserId } = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  // 🔹 Fetch Accepted Sessions
  const fetchUpcomingSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/fetchRequests/${UserId}`
      );

      const data = response.data.data || [];

      const acceptedSessions = data.filter(
        (session) => session.status === "Accepted"
      );

      setSessions(acceptedSessions);

    } catch (error) {
      console.log(error);
    }
  };

  // 🔴 Cancel Session
  const cancelSession = async (id) => {
    try {
      await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        {
          status: "Cancelled",
          description: "Session cancelled by professional",
        }
      );

      // remove from UI
      const updated = sessions.filter((s) => s._id !== id);
      setSessions(updated);

    } catch (error) {
      console.log(error);
    }
  };

  // 🟢 Start Session
  const startSession = async (id) => {
    try {
      await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        {
          status: "Ongoing",
          description: "Session started",
        }
      );

      // 🔥 Update UI
      const updated = sessions.map((s) => {
        if (s._id === id) {
          return {
            ...s,
            status: "Ongoing",
            description: "Session started",
          };
        }
        return s;
      });

      setSessions(updated);

      alert("Session Started 🚀");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="requests-container">

      {sessions.length === 0 && <p>No upcoming sessions</p>}

      {sessions.map((session) => (
        <div key={session._id} className="request-card">

          {/* 🔹 Header */}
          <div className="card-header">
            <h3>{session.learnerName}</h3>
            <span className="status accepted">
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

          {/* 🔹 Actions */}
          <div className="card-actions">

            {session.status === "Accepted" && (
              <>
                <button
                  className="accept-btn"
                  onClick={() => startSession(session._id)}
                >
                  Start
                </button>

                <button
                  className="reject-btn"
                  onClick={() => cancelSession(session._id)}
                >
                  Cancel
                </button>
              </>
            )}

            {session.status === "Ongoing" && (
              <button className="disabled-btn" disabled>
                Session In Progress
              </button>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}

export default Upcoming;