import React, { useState, useEffect } from "react";
import "./ProfessionalDashboard.css";
import "../../pages/Navigation.css";
import axios from 'axios';
import Posts from "../Profesional/Posts"
import Messages from "./Messages";
import Courses from "./Courses";
import Sessions from "./Sessions"
import Notifications from "./Notifications";
import Overview from "./Overview";
import Navigationbar from "../../pages/Navigationbar";
import {  FaRegNewspaper,FaBookOpen, FaCalendarAlt,FaRegEnvelope,FaRegBell,FaSun, FaMoon,FaBars,FaThLarge,FaChartLine,FaTachometerAlt } from "react-icons/fa";


const ProfessionalDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [theme,setTheme] = useState("dark");
  const [posts, setPosts] = useState([]);
  const [content,setContent]=useState('');
  const [popup,setPopUpOpen]=useState(false)
  const [isOpen,setOpen]= useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 1000); // 🔥 every 1 second

  // cleanup (VERY IMPORTANT)
  return () => clearInterval(interval);
  }, []);

    const fetchUnreadCount = async () => {
        try {
          const { UserId } = JSON.parse(localStorage.getItem("customer"));

          const res = await axios.get(
            `http://localhost:5004/getUnreadCount/${UserId}`
          );

          setNotificationCount(res.data.count);

        } catch (error) {
          console.log(error);
        }
      };
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview/>
      case "posts":
        return <Posts/>
      case "courses":
        return <Courses></Courses>;
      case "sessions":
        return <Sessions/>;
      case "messages":
        return <Messages/>;
      case "notifications":
        return <Notifications/>;
      default:
        return null;
    }
  };

  return(
    <>
        <div className={`dashboard-wrapper ${theme}`}>
        <div className="dashboard">
            <div className={`sidebar ${isOpen ? "open" : "close"}`}>
              <button className="toggle" onClick={() => setOpen(!isOpen)} style={{ color: theme === "dark" ? "#fff" : "#000" }}>☰</button>
              {isOpen && <span className="text">SkillBridge</span>}
              <div className="menu" onClick={() => setActiveTab("overview")}>
                <span className="icon"><FaThLarge /></span>
                {isOpen && <span  className="text">Overview</span>}
              </div>
              <div className="menu" onClick={() => setActiveTab("posts")}>
                <span className="icon"><FaRegNewspaper /></span>
                {isOpen && <span  className="text">Post</span>}
              </div>
              <div className="menu" onClick={() => setActiveTab("courses")}>
                <span className="icon"><FaBookOpen /></span>
                {isOpen && <span className="text">Courses</span>}
              </div>
              <div className="menu" onClick={() => setActiveTab("sessions")}>
                <span className="icon"><FaCalendarAlt /></span>
                {isOpen && <span className="text">Sessions</span>}
              </div>
              <div className="menu" onClick={() => setActiveTab("messages")}>
                <span className="icon"><FaRegEnvelope /></span>
                {isOpen && <span className="text">Messages</span>}
              </div>
              {/* <div className="menu" onClick={() => setActiveTab("notifications")}>
                <span className="icon"><FaRegBell/>
                </span>
                {isOpen && <span className="text">Notifications</span>}
              </div> */}
              <div
                className={`menu ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <span className="icon" style={{ position: "relative" }}>
                  <FaRegBell />

                  {/* 🔴 Badge */}
                  {notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </span>

                {isOpen && (
                  <span className="text">
                    Notifications
                  </span>
                )}
              </div>
            </div>

            <div className={`main ${isOpen ? "open" : "close"}`}>
                <div className="topbar">
                    <h3 className="title">Dashboard</h3>
                    <div className="topbar-center">
                      <input type="text" placeholder="Search..."className="search"/>
                    </div>
                    <div className="topbar-right">
                      <span>🔔</span>
                      <span>👤</span>
                      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                      {theme === "dark" ? <FaMoon/> : <FaSun/>}
                    </button>
                    </div>
                
                </div>
                <div className="content">
                  <div className="content-inner">
                    {renderContent()}
                  </div>
                </div>

            </div>
        </div>
        </div>
    </>
  )
};

export default ProfessionalDashboard;