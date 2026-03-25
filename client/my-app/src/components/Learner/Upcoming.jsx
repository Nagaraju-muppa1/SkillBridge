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
        `http://localhost:5004/fetchlearnerRequests/${UserId}`
      );

      const data = response.data.data || [];

      // ✅ Only Accepted sessions
      const acceptedSessions = data.filter(
        (session) => session.status === "Accepted"
      );

      setSessions(acceptedSessions);

    } catch (error) {
      console.log(error);
    }
  };

  // 🔴 Cancel Session (Learner side)
  const cancelSession = async (id, session) => {
    try {
     const response = await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        {
          status: "Cancelled",
          description: "Session cancelled by learner",
        }
      );

      // 🔥 Remove from UI
      const updated = sessions.filter((s) => s._id !== id);
      setSessions(updated);

      // 🔔 Notify Professional
      const data = {
        receiverId: session.profId,
        senderId: UserId,
        senderName: session.learnerName,
        recieverName: session.profName,
        title: "Session Cancelled",
        message: `${session.learnerName} has cancelled the session.`,
        type: "CANCELLED",
      };

      await axios.post("http://localhost:5004/saveNotification", data);

    } catch (error) {
      console.log(error);
    }
  };

  // 🟢 Join Session (Learner side)
  const joinSession = (session) => {
    // 👉 later you can integrate Zoom / Google Meet link
    alert(`Joining session with ${session.profName} 🚀`);
  };

  return (
    <div className="requests-container">

      {sessions.length === 0 && <p>No upcoming sessions</p>}

      {sessions.map((session) => (
        <div key={session._id} className="request-card">

          {/* 🔹 Header */}
          <div className="card-header">
            <h3>{session.profName}</h3> {/* ✅ Show Professional */}
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

            {/* ✅ Only for Accepted sessions */}
            {session.status === "Accepted" && (
              <>
                <button
                  className="accept-btn"
                  onClick={() => joinSession(session)}
                >
                  Join
                </button>

                <button
                  className="reject-btn"
                  onClick={() => cancelSession(session._id, session)}
                >
                  Cancel
                </button>
              </>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}

export default Upcoming;