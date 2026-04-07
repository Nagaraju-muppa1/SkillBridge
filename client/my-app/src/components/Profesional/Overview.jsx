import React, { useState, useEffect } from "react";
import "./Overview.css";
import axios from "axios";

function Overview() {
  const [name, setName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0); // ✅ NEW STATE

  const userData = JSON.parse(localStorage.getItem("customer"));
  const clerkUserId = userData.clerkUserId;
  const UserId = userData.UserId;

  useEffect(() => {
    const getData = async () => {
      try {
        // ✅ Get Name
        const nameRes = await axios.get(
          `http://localhost:5005/userdetails/${clerkUserId}`
        );
        setName(nameRes.data.message.fullname);

        // ✅ Get Unread Notifications
        const notifyRes = await axios.get(
          `http://localhost:5004/getUnreadCount/${UserId}`
        );
        setUnreadCount(notifyRes.data.count);

        // ✅ Get All Requests
        const response = await axios.get(
        `http://localhost:5004/fetchRequests/${UserId}`
      );

      const data = response.data.data || [];

      const acceptedSessions = data.filter(
        (session) => session.status === "Accepted"
      );
      //console.log(acceptedSessions.length);
        setAcceptedCount(acceptedSessions.length);

      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <>
      <h2>Welcome {name}.</h2>

      <div className="overview-cards">
        <div className="card">
          <div className="card-title">Total Students</div>
          <div className="card-value">124</div>
        </div>

        <div className="card">
          <div className="card-title">Active Courses</div>
          <div className="card-value">6</div>
        </div>

        {/* ✅ UPDATED UPCOMING SESSIONS */}
        <div className="card">
          <div className="card-title">Upcoming Sessions</div>
          <div className="card-value">{acceptedCount}</div>
        </div>

        <div className="card">
          <div className="card-title">Unread Notifications</div>
          <div className="card-value">{unreadCount}</div>
        </div>
      </div>
    </>
  );
}

export default Overview;