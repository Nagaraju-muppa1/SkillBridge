import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

function Upcoming() {

  const [sessions, setSessions] = useState([]);
  const { UserId } = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5004/fetchRequests/${UserId}`
      );
      console.log(response.data.data);
      const data = response.data.data || [];

      // filter accepted sessions
      const acceptedSessions = data.filter(
        (session) => session.Status === "Accepted"
      );

      setSessions(acceptedSessions);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="requests-container">

      {sessions.length === 0 && <p>No upcoming sessions</p>}

      {sessions.map((session) => (
        <div key={session._id} className="request-card">

          <div className="request-info">
            <p><b>Learner:</b> {session.learnerId}</p>
            <p><b>Day:</b> {session.day}</p>
            <p><b>Time:</b> {session.startTime} - {session.endTime}</p>
            <p><b>Status:</b> {session.status}</p>
          </div>

        </div>
      ))}

    </div>
  );
}

export default Upcoming;