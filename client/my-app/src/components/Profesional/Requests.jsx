import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const { UserId } = JSON.parse(localStorage.getItem("customer"));
  const professionalId = UserId;

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Fetch Requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/fetchRequests/${professionalId}`
      );

      const data = response.data.data || [];

      // Show only pending requests
      const pendingRequests = data.filter(
        (req) => req.status === "Pending" || !req.status
      );

      setRequests(pendingRequests);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Update Status (Accept / Reject)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        { status }
      );

      // Remove card after action
      const updatedRequests = requests.filter((req) => req._id !== id);
      setRequests(updatedRequests);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="requests-container">
      {requests.length === 0 && <p>No request sessions</p>}

      {requests.map((req) => (
        <div key={req._id} className="request-card">
          
          {/* 🔹 Header */}
          <div className="card-header">
            <h3>{req.learnerName}</h3>
            <span className={`status ${req.status?.toLowerCase()}`}>
              {req.status}
            </span>
          </div>

          {/* 🔹 Body */}
          <div className="card-body">
            <p>
              <b>Date:</b>{" "}
              {new Date(req.date).toLocaleDateString()}
            </p>
            <p>
              <b>Time:</b> {req.startTime} - {req.endTime}
            </p>
            <p>
              <b>Description:</b> {req.description}
            </p>
          </div>

          {/* 🔹 Actions */}
          <div className="card-actions">
            <button
              className="accept-btn"
              onClick={() => updateStatus(req._id, "Accepted")}
            >
              Accept
            </button>

            <button
              className="reject-btn"
              onClick={() => updateStatus(req._id, "Rejected")}
            >
              Reject
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Requests;