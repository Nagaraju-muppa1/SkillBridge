import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const { UserId } = JSON.parse(localStorage.getItem("customer"));
  const learnerId = UserId;

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Fetch ALL Requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/fetchlearnerRequests/${learnerId}`
      );

      const data = response.data.data || [];
      setRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Cancel Request
    const cancelRequest = async (id) => {
    try {
        const status = "Cancelled";
        const description = "You cancelled the request";

        // 🔥 Update status in backend
        const response = await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        {
            status,
            description,
        }
        );

        const updatedData = response.data.data;
        console.log(updatedData);
        // 🔥 Update UI instantly
        const updatedRequests = requests.map((req) => {
        if (req._id === id) {
            return {
            ...req,
            status,
            description,
            };
        }
        return req;
        });

        setRequests(updatedRequests);

        // 🔥 Send Notification to Professional
        const senderName = updatedData.learnerName;
        const data = {
        receiverId: updatedData.professionalId,          // 👈 Professional gets notification
        senderId: learnerId,
        senderName: senderName,
        recieverName: updatedData.profName,
        title: "Request Cancelled",
        message: `${senderName} has cancelled the session request.`,
        type: "CANCELLED",
        };

        const res = await axios.post("http://localhost:5004/saveNotification", data);
        console.log(res);

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
            <h3>{req.profName}</h3> {/* ✅ Show Professional Name */}
            <span className={`status ${req.status?.toLowerCase()}`}>
              {req.status || "Pending"}
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

            {/* ✅ Waiting message */}
            {(!req.status || req.status === "Pending") && (
              <p className="waiting-text">
                Waiting for professional approval...
              </p>
            )}

            <p>
              <b>Description:</b> {req.description}
            </p>
          </div>

          {/* 🔹 Actions */}
          <div className="card-actions">

            {/* ✅ Show Cancel only if Pending */}
            {(!req.status || req.status === "Pending") ? (
              <button
                className="cancel-btn"
                onClick={() => cancelRequest(req._id)}
              >
                Cancel Request
              </button>
            ) : (
              <button className="disabled-btn" disabled>
                {req.status}
              </button>
            )}

          </div>

        </div>
      ))}
    </div>
  );
}

export default Requests;