import React, { useState } from "react";
import "./ProfessionalDashboard.css";
import "../../pages/Navigation.css";
import axios from 'axios';
import Posts from "../Profesional/Posts"
import Courses from "./Courses";
import Navigationbar from "../../pages/Navigationbar";

const ProfessionalDashboard = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [content,setContent]=useState('');
  const [popup,setPopUpOpen]=useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <Posts/>
      case "courses":
        return <Courses></Courses>;
      case "reviews":
        return <div className="content-box">⭐ Reviews & ratings shown here</div>;
      case "book":
        return <div className="content-box">📅 Booking sessions UI here</div>;
      default:
        return null;
    }
  };

  return (
    <><Navigationbar/>
    <div className="dashboard-container">
      {/* Top Profile Section */}
      <div className="profile-header">
        <div className="profile-left">
            <div className="profile-pic">PIC</div>
        </div>
        <div className="profile-right">
        <h2>Full Name</h2>
        <p><strong>Connections:</strong> 120</p>
        <p><strong>Rating:</strong> ⭐⭐⭐⭐☆</p>
        <p className="bio">
            Passionate music teacher with 10+ years of experience.
        </p>
        </div>
      </div>
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? "active" : ""}>
          Posts
        </button>
        <button onClick={() => setActiveTab("courses")} className={activeTab === "courses" ? "active" : ""}>
          Courses & Videos
        </button>
        <button onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? "active" : ""}>
          Reviews / Ratings
        </button>
        <button onClick={() => setActiveTab("book")} className={activeTab === "book" ? "active" : ""}>
          Book Session
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="tab-content">
          {renderContent()}
      </div>
    </div>
    </>
  );
};

export default ProfessionalDashboard;
