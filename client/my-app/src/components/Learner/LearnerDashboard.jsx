import React, { useState } from "react";
import "./LearnerDb.css";
import "../../pages/Navigation.css";
import axios from 'axios';
import Home from "./Home"
import Messages from "./MessagesL";
import Courses from "./CoursesL";
import Sessions from "./SessionsL"
import Notifications from "./NotificationsL";
import {  FaRegNewspaper,FaBookOpen, FaCalendarAlt,FaRegEnvelope,FaRegBell,FaSun, FaMoon,FaBars,FaThLarge,FaChartLine,FaTachometerAlt } from "react-icons/fa";


const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [theme,setTheme] = useState("dark");
  const [isOpen,setOpen]= useState(true);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);


  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home searchResults={searchResults}
      openProfessional={(pro) => {
        setSelectedProfessional(pro);
        setActiveTab("courses");}} />
      case "courses":
        return <Courses professional={selectedProfessional}></Courses>;
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
  const handleSearch = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5001/api/videos/search?skill=${searchSkill}`
    );
    setSearchResults(res.data.professionals);
    console.log(res.data.professionals);
    setActiveTab("home"); // show results in home tab
  } catch (err) {
    console.error(err);
  }
};


  return(
    <>
        <div className={`dashboard-wrapper ${theme}`}>
        <div className="dashboard">
            <div className={`sidebar ${isOpen ? "open" : "close"}`}>
              <button className="toggle" onClick={() => setOpen(!isOpen)} style={{ color: theme === "dark" ? "#fff" : "#000" }}>☰</button>
              {isOpen && <span className="text">SkillBridge</span>}
              <div className="menu" onClick={() => setActiveTab("home")}>
                <span className="icon"><FaThLarge /></span>
                {isOpen && <span  className="text">Home</span>}
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
                      <input
                          type="text"
                          placeholder="Search skill (dance, coding, music...)"
                          className="search"
                          value={searchSkill}
                          onChange={(e) => setSearchSkill(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
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

export default LearnerDashboard;





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
