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
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [demoVideos, setDemoVideos] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [connectedProfessionalIds, setConnectedProfessionalIds] = useState([]);

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

  useEffect(() => {
    const value = searchText.trim();

    if (!value) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await axios.get("http://localhost:5005/search", {
          params: {
            type: filterType,
            query: value
          }
        });
        setSearchResults(res.data?.data || []);
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, filterType]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const customer = JSON.parse(localStorage.getItem("customer"));
      if (!customer?.UserId) return;
      setConnectionsLoading(true);
      const res = await axios.get(`http://localhost:5005/connections/${customer.UserId}`);
      const list = res.data?.data || [];
      setConnections(list);
      setConnectedProfessionalIds(list.map((item) => item.UserId));
    } catch (error) {
      console.log(error);
      setConnections([]);
      setConnectedProfessionalIds([]);
    } finally {
      setConnectionsLoading(false);
    }
  };

  const handleOpenProfessional = async (person) => {
    try {
      setDetailsLoading(true);
      const [profileRes, courseRes] = await Promise.all([
        axios.get(`http://localhost:5005/profile/${person._id}`),
        axios.get(`http://localhost:5003/getCourses/${person.clerkUserId}`)
      ]);

      setSelectedProfessional(profileRes.data?.data || person);
      setDemoVideos(courseRes.data?.data || []);
    } catch (error) {
      console.log(error);
      setSelectedProfessional(person);
      setDemoVideos([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleConnect = async () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer?.UserId || !selectedProfessional?.UserId) return;
    if (connectedProfessionalIds.includes(selectedProfessional.UserId)) return;

    try {
      setConnectLoading(true);
      // Optimistic UI update so button instantly turns Connected.
      setConnectedProfessionalIds((prev) => [...prev, selectedProfessional.UserId]);
      const res = await axios.post("http://localhost:5005/followProfessional", {
        professionalId: selectedProfessional.UserId,
        followerId: customer.UserId
      });

      const updatedFollowers = res.data?.followers || [];
      setSelectedProfessional((prev) => ({
        ...prev,
        followers: updatedFollowers
      }));
      fetchConnections();
    } catch (error) {
      console.log(error);
      setConnectedProfessionalIds((prev) =>
        prev.filter((id) => id !== selectedProfessional.UserId)
      );
      alert("Unable to connect right now. Please try again.");
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer?.UserId || !selectedProfessional?.UserId) return;

    try {
      setConnectLoading(true);
      setConnectedProfessionalIds((prev) =>
        prev.filter((id) => id !== selectedProfessional.UserId)
      );

      const res = await axios.post("http://localhost:5005/unfollowProfessional", {
        professionalId: selectedProfessional.UserId,
        followerId: customer.UserId
      });

      const updatedFollowers = res.data?.followers || [];
      setSelectedProfessional((prev) => ({
        ...prev,
        followers: updatedFollowers
      }));
      fetchConnections();
    } catch (error) {
      console.log(error);
      setConnectedProfessionalIds((prev) => [...prev, selectedProfessional.UserId]);
      alert("Unable to disconnect right now. Please try again.");
    } finally {
      setConnectLoading(false);
    }
  };

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

  const customer = JSON.parse(localStorage.getItem("customer"));
  const isConnected =
    !!selectedProfessional?.UserId &&
    (
      connectedProfessionalIds.includes(selectedProfessional.UserId) ||
      selectedProfessional?.followers?.includes(customer?.UserId)
    );

  const handleBookSession = () => {
    if (!selectedProfessional) return;
    const data = {
      _id: selectedProfessional._id,
      UserId: selectedProfessional.UserId,
      fullname: selectedProfessional.fullname
    };
    localStorage.setItem("selectedProfessional", JSON.stringify(data));
    setActiveTab("sessions");
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
              <button className="connect-btn" onClick={fetchConnections}>
                My Connections
              </button>

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
              {searchText.trim() && (
                <div className="search-results-wrap">
                  <h4 className="search-results-title">
                    Professionals matching "{searchText.trim()}"
                  </h4>

                  {searchLoading ? (
                    <p className="search-empty">Searching...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="search-empty">No professional found.</p>
                  ) : (
                    <div className="search-card-grid">
                      {searchResults.map((person) => (
                        <div
                          key={person._id}
                          className="search-card clickable"
                          onClick={() => handleOpenProfessional(person)}
                        >
                          <h5>{person.fullname || "Professional"}</h5>
                          <p><strong>Skill:</strong> {person.skill || "N/A"}</p>
                          <p><strong>Experience:</strong> {person.experience || 0} years</p>
                          <p><strong>Location:</strong> {person.city || "N/A"}</p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {connectedProfessionalIds.includes(person.UserId) ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedProfessional && (
                <div className="search-results-wrap">
                  <h4 className="search-results-title">Professional details</h4>
                  {detailsLoading ? (
                    <p className="search-empty">Loading details...</p>
                  ) : (
                    <>
                      <div className="search-card">
                        <h5>{selectedProfessional.fullname || "Professional"}</h5>
                        <p><strong>Skill:</strong> {selectedProfessional.skill || "N/A"}</p>
                        <p><strong>Experience:</strong> {selectedProfessional.experience || 0} years</p>
                        <p><strong>Bio:</strong> {selectedProfessional.bio || "N/A"}</p>
                        <p><strong>Followers:</strong> {selectedProfessional.followers?.length || 0}</p>
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          className="connect-btn"
                          onClick={isConnected ? handleDisconnect : handleConnect}
                          disabled={connectLoading}
                        >
                          {connectLoading ? "Please wait..." : isConnected ? "Disconnect" : "Connect"}
                        </button>
                        <button
                          className="connect-btn"
                          onClick={handleBookSession}
                        >
                          Book Session
                        </button>
                        </div>
                      </div>

                      <h5 className="search-results-title">Demo videos</h5>
                      {demoVideos.length === 0 ? (
                        <p className="search-empty">No demo videos uploaded yet.</p>
                      ) : (
                        <div className="search-card-grid">
                          {demoVideos.map((video) => (
                            <div key={video._id} className="search-card">
                              <h5>{video.title || "Demo Video"}</h5>
                              <video className="demo-video" controls>
                                <source src={video.videoUrl} type="video/mp4" />
                              </video>
                              <p>{video.description || "No description available."}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {connectionsLoading && (
                <div className="search-results-wrap">
                  <p className="search-empty">Loading your connections...</p>
                </div>
              )}

              {!connectionsLoading && connections.length > 0 && (
                <div className="search-results-wrap">
                  <h4 className="search-results-title">My Connections</h4>
                  <div className="search-card-grid">
                    {connections.map((person) => (
                      <div
                        key={person._id}
                        className="search-card clickable"
                        onClick={() => handleOpenProfessional(person)}
                      >
                        <h5>{person.fullname || "Professional"}</h5>
                        <p><strong>Skill:</strong> {person.skill || "N/A"}</p>
                        <p><strong>Followers:</strong> {person.followers?.length || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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