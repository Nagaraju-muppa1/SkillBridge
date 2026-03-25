import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotificationL.css";

function NotificationsL() {
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

  // 🔥 Filter Tabs
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  return (
    <div className="notifications-wrapper">

      {/* 🔹 Tabs */}
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

      {/* 🔹 Notifications List */}
      <div className="notifications-content-card">

        {filtered.length === 0 ? (
          <p>No notifications</p>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.isRead ? "read" : "unread"} ${n.type?.toLowerCase()}`}
            >
              {/* 🔹 Header */}
              <div className="notification-header">
                <h4>{n.title || "Notification"}</h4>

                <span className={`status ${n.isRead ? "read" : "unread"}`}>
                  {n.isRead ? "Read" : "New"}
                </span>
              </div>

              {/* 🔹 Sender Info */}
              <p className="sender">
                From: <b>{n.senderName}</b>
              </p>

              {/* 🔹 Message */}
              <p>{n.message}</p>

              {/* 🔹 Time */}
              <small>
                {new Date(n.createdAt).toLocaleString()}
              </small>

              {/* 🔹 Mark as Read */}
              {!n.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(n._id)}
                >
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

export default NotificationsL;