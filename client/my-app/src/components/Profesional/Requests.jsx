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

  // 🔹 Fetch ALL Requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/fetchRequests/${professionalId}`
      );

      const data = response.data.data || [];
      setRequests(data);

    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Update Status (Accept / Reject)
  const updateStatus = async (id, status, req) => {
    try {
      const description =
        status === "Accepted"
          ? "You accepted the request"
          : "You rejected the request";

      // 🔥 Update status in backend
      const response = await axios.put(
        `http://localhost:5004/updateRequestStatus/${id}`,
        {
          status,
          description,
        }
      );

      const updatedData = response.data.data;

      // 🔥 Update UI instantly
      const updatedRequests = requests.map((r) => {
        if (r._id === id) {
          return {
            ...r,
            status,
            description,
          };
        }
        return r;
      });

      setRequests(updatedRequests);

      // 🔔 Send Notification to Learner
      const senderName = updatedData.profName;

      const notificationData = {
        receiverId: updatedData.learnerId,        // ✅ learner gets notification
        senderId: professionalId,
        senderName: senderName,
        recieverName: updatedData.learnerName,
        title:
          status === "Accepted"
            ? "Request Accepted"
            : "Request Rejected",
        message:
          status === "Accepted"
            ? `${senderName} has accepted your request.`
            : `${senderName} has rejected your request.`,
        type: status === "Accepted" ? "ACCEPTED" : "REJECTED",
      };

      console.log("Notification Data:", notificationData);

      await axios.post(
        "http://localhost:5004/saveNotification",
        notificationData
      );

    } catch (error) {
      console.log("ERROR:", error.response?.data || error);
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
            <p>
              <b>Description:</b> {req.description}
            </p>
          </div>

          {/* 🔹 Actions */}
          <div className="card-actions">

            {(req.status === "Pending" || !req.status) ? (
              <>
                <button
                  className="accept-btn"
                  onClick={() => updateStatus(req._id, "Accepted", req)}
                >
                  Accept
                </button>

                <button
                  className="reject-btn"
                  onClick={() => updateStatus(req._id, "Rejected", req)}
                >
                  Reject
                </button>
              </>
            ) : (
              <button className="disabled-btn" disabled>
                Action Completed
              </button>
            )}

          </div>

        </div>
      ))}
    </div>
  );
}

export default Requests;