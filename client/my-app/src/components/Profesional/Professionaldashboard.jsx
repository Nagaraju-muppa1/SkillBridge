import React, { useState } from "react";
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
              <div className="menu" onClick={() => setActiveTab("notifications")}>
                <span className="icon"><FaRegBell/>
                </span>
                {isOpen && <span className="text">Notifications</span>}
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





  // return (
  //   <><Navigationbar/>
  //   <div className="dashboard-container">
  //     {/* Top Profile Section */}
  //     <div className="profile-header">
  //       <div className="profile-left">
  //           <div className="profile-pic">PIC</div>
  //       </div>
  //       <div className="profile-right">
  //       <h2>Full Name</h2>
  //       <p><strong>Connections:</strong> 120</p>
  //       <p><strong>Rating:</strong> ⭐⭐⭐⭐☆</p>
  //       <p className="bio">
  //           Passionate music teacher with 10+ years of experience.
  //       </p>
  //       </div>
  //     </div>
  //     {/* Tabs */}
  //     <div className="tabs">
  //       <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? "active" : ""}>
  //         Posts
  //       </button>
  //       <button onClick={() => setActiveTab("courses")} className={activeTab === "courses" ? "active" : ""}>
  //         Courses & Videos
  //       </button>
  //       <button onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? "active" : ""}>
  //         Reviews / Ratings
  //       </button>
  //       <button onClick={() => setActiveTab("book")} className={activeTab === "book" ? "active" : ""}>
  //         Book Session
  //       </button>
  //     </div>

  //     {/* Dynamic Content */}
  //     <div className="tab-content">
  //         {renderContent()}
  //     </div>
  //   </div>
  //   </>
  // );
