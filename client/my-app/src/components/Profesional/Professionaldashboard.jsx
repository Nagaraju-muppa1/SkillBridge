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
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [demoVideos, setDemoVideos] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectedProfessionalIds, setConnectedProfessionalIds] = useState([]);
  useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 1000); // 🔥 every 1 second

  // cleanup (VERY IMPORTANT)
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
            type: "skill",
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
  }, [searchText]);

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
    } catch (error) {
      console.log(error);
      setConnectedProfessionalIds((prev) =>
        prev.filter((id) => id !== selectedProfessional.UserId)
      );
    } finally {
      setConnectLoading(false);
    }
  };
  const viewer = JSON.parse(localStorage.getItem("customer"));
  const isConnected =
    !!selectedProfessional?.UserId &&
    (
      connectedProfessionalIds.includes(selectedProfessional.UserId) ||
      selectedProfessional?.followers?.includes(viewer?.UserId)
    );

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
              {/* <div className="menu" onClick={() => setActiveTab("messages")}>
                <span className="icon"><FaRegEnvelope /></span>
                {isOpen && <span className="text">Messages</span>}
              </div> */}
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
                      <input
                        type="text"
                        placeholder="Search by skill..."
                        className="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
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
                              <button className="connect-btn" onClick={handleConnect} disabled={connectLoading}>
                                {connectLoading ? "Connecting..." : isConnected ? "Connected" : "Connect"}
                              </button>
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