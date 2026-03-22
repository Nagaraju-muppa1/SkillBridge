import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notification.css";

function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const { UserId } = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5004/getNotifications/${UserId}`
      );
      setNotifications(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5004/markAsRead/${id}`);

      const updated = notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );

      setNotifications(updated);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 Filter like sessions
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  return (
    <div className="notifications-wrapper">

      {/* 🔹 TOP CARD (same as sessions header box) */}
      <div className="notifications-top-card">
        <div className="tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            className={activeTab === "unread" ? "active" : ""}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </button>

          <button
            className={activeTab === "read" ? "active" : ""}
            onClick={() => setActiveTab("read")}
          >
            Read
          </button>
        </div>
      </div>

      {/* 🔹 CONTENT CARD (same as sessions content box) */}
      <div className="notifications-content-card">

        {filtered.length === 0 ? (
          <p>No notifications</p>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.isRead ? "read" : "unread"}`}
            >
              <div className="notification-header">
                <h4>{n.title || "Notification"}</h4>
                <span className={`status ${n.isRead ? "read" : "unread"}`}>
                  {n.isRead ? "Read" : "New"}
                </span>
              </div>

              <p>{n.message}</p>

              <small>
                {new Date(n.createdAt).toLocaleString()}
              </small>

              {!n.isRead && (
                <button onClick={() => markAsRead(n._id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Notifications;