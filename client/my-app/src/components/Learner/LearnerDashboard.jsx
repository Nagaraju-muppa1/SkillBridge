import React, { useState, useEffect } from "react";
import "./LearnerDb.css";
import "../../pages/Navigation.css";
import axios from "axios";

import Home from "./Home";
import Messages from "./MessagesL";
import Courses from "./CoursesL";
import Sessions from "./SessionsL";
import Notifications from "./NotificationsL";

import {
  FaBookOpen,
  FaCalendarAlt,
  FaRegEnvelope,
  FaRegBell,
  FaSun,
  FaMoon,
  FaThLarge
} from "react-icons/fa";

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [isOpen, setOpen] = useState(true);

  // 🔥 SEARCH STATES (NEW)
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("skill");

  // 🔥 NOTIFICATION COUNT
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { UserId } = JSON.parse(localStorage.getItem("customer"));

      const res = await axios.get(
        `http://localhost:5004/getUnreadCount/${UserId}`
      );

      setNotificationCount(res.data.count || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "courses":
        return <Courses />;
      case "sessions":
        return <Sessions />;
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-wrapper ${theme}`}>
      <div className="dashboard">

        {/* 🔹 SIDEBAR */}
        <div className={`sidebar ${isOpen ? "open" : "close"}`}>
          
          <button
            className="toggle"
            onClick={() => setOpen(!isOpen)}
            style={{ color: theme === "dark" ? "#fff" : "#000" }}
          >
            ☰
          </button>

          {isOpen && <span className="text">SkillBridge</span>}

          <div className="menu" onClick={() => setActiveTab("home")}>
            <span className="icon"><FaThLarge /></span>
            {isOpen && <span className="text">Home</span>}
          </div>

          <div className="menu" onClick={() => setActiveTab("courses")}>
            <span className="icon"><FaBookOpen /></span>
            {isOpen && <span className="text">Courses</span>}
          </div>

          <div className="menu" onClick={() => setActiveTab("sessions")}>
            <span className="icon"><FaCalendarAlt /></span>
            {isOpen && <span className="text">Sessions</span>}
          </div>

          {/* 🔔 Notifications */}
          <div className="menu" onClick={() => setActiveTab("notifications")}>
            <span className="icon" style={{ position: "relative" }}>
              <FaRegBell />

              {notificationCount > 0 && (
                <span className="badge">
                  {notificationCount}
                </span>
              )}
            </span>

            {isOpen && (
              <span className="text">
                Notifications
                {notificationCount > 0 && ` (${notificationCount})`}
              </span>
            )}
          </div>
        </div>

        {/* 🔹 MAIN */}
        <div className={`main ${isOpen ? "open" : "close"}`}>

          <div className="topbar">
            <h3 className="title">Dashboard</h3>

            {/* 🔥 UPDATED SEARCH BAR ONLY */}
            <div
              className="topbar-center"
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >

              {/* 🔽 Dropdown */}
              <select
                className="filter-dropdown"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="skill">Skill</option>
                <option value="name">Name</option>
              </select>

              {/* 🔍 Search Input */}
              <input
                type="text"
                placeholder={`Search by ${filterType}...`}
                className="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

            </div>

            <div className="topbar-right">
              <span>🔔</span>
              <span>👤</span>

              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <FaMoon /> : <FaSun />}
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
  );
};

export default LearnerDashboard;

// import React, { useState, useEffect } from "react";
// import "./LearnerDb.css";
// import "../../pages/Navigation.css";
// import axios from "axios";

// import Home from "./Home";
// import Messages from "./MessagesL";
// import Courses from "./CoursesL";
// import Sessions from "./SessionsL";
// import Notifications from "./NotificationsL";

// import {
//   FaBookOpen,
//   FaCalendarAlt,
//   FaRegEnvelope,
//   FaRegBell,
//   FaSun,
//   FaMoon,
//   FaThLarge
// } from "react-icons/fa";

// const LearnerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("home");
//   const [theme, setTheme] = useState("dark");
//   const [isOpen, setOpen] = useState(true);

//   // 🔥 NEW STATE
//   const [notificationCount, setNotificationCount] = useState(0);

//   // 🔥 FETCH UNREAD COUNT
//   const fetchUnreadCount = async () => {
//     try {
//       const { UserId } = JSON.parse(localStorage.getItem("customer"));

//       const res = await axios.get(
//         `http://localhost:5004/getUnreadCount/${UserId}`
//       );

//       setNotificationCount(res.data.count || 0);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // 🔥 CALL EVERY 1 SECOND
//   useEffect(() => {
//     fetchUnreadCount();

//     const interval = setInterval(() => {
//       fetchUnreadCount();
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "home":
//         return <Home />;
//       case "courses":
//         return <Courses />;
//       case "sessions":
//         return <Sessions />;
//       case "messages":
//         return <Messages />;
//       case "notifications":
//         return <Notifications />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className={`dashboard-wrapper ${theme}`}>
//         <div className="dashboard">

//           {/* 🔹 SIDEBAR */}
//           <div className={`sidebar ${isOpen ? "open" : "close"}`}>
            
//             <button
//               className="toggle"
//               onClick={() => setOpen(!isOpen)}
//               style={{ color: theme === "dark" ? "#fff" : "#000" }}
//             >
//               ☰
//             </button>

//             {isOpen && <span className="text">SkillBridge</span>}

//             <div className="menu" onClick={() => setActiveTab("home")}>
//               <span className="icon"><FaThLarge /></span>
//               {isOpen && <span className="text">Home</span>}
//             </div>

//             <div className="menu" onClick={() => setActiveTab("courses")}>
//               <span className="icon"><FaBookOpen /></span>
//               {isOpen && <span className="text">Courses</span>}
//             </div>

//             <div className="menu" onClick={() => setActiveTab("sessions")}>
//               <span className="icon"><FaCalendarAlt /></span>
//               {isOpen && <span className="text">Sessions</span>}
//             </div>

//             {/* <div className="menu" onClick={() => setActiveTab("messages")}>
//               <span className="icon"><FaRegEnvelope /></span>
//               {isOpen && <span className="text">Messages</span>}
//             </div> */}

//             {/* 🔔 NOTIFICATIONS WITH BADGE */}
//             <div className="menu" onClick={() => setActiveTab("notifications")}>
//               <span className="icon" style={{ position: "relative" }}>
//                 <FaRegBell />

//                 {/* 🔴 Badge */}
//                 {notificationCount > 0 && (
//                   <span className="badge">
//                     {notificationCount}
//                   </span>
//                 )}
//               </span>

//               {isOpen && (
//                 <span className="text">
//                   Notifications
//                   {notificationCount > 0 && ` (${notificationCount})`}
//                 </span>
//               )}
//             </div>

//           </div>

//           {/* 🔹 MAIN */}
//           <div className={`main ${isOpen ? "open" : "close"}`}>

//             <div className="topbar">
//               <h3 className="title">Dashboard</h3>

//               <div className="topbar-center">
//                 <input type="text" placeholder="Search..." className="search" />
//               </div>

//               <div className="topbar-right">
//                 <span>🔔</span>
//                 <span>👤</span>

//                 <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//                   {theme === "dark" ? <FaMoon /> : <FaSun />}
//                 </button>
//               </div>
//             </div>

//             <div className="content">
//               <div className="content-inner">
//                 {renderContent()}
//               </div>
//             </div>

//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default LearnerDashboard;