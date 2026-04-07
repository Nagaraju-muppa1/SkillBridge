import { useState, useEffect } from "react";
import axios from "axios";
import "../Profesional/Post.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [learnerSkill, setLearnerSkill] = useState("");

  const { UserId } = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    fetchLearnerData();
  }, []);

  // ✅ TIME FORMAT
  const formatTime = (time) => {
    if (!time) return "";

    const now = new Date();
    const postTime = new Date(time);
    const diff = Math.floor((now - postTime) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return "Yesterday";

    return postTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔥 Fetch learner skill
  const fetchLearnerData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5005/userdetails/${UserId}`
      );

      const user = res.data.message;

      setLearnerSkill(user.skill);

      fetchPosts(user.skill);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 Fetch posts + names
  const fetchPosts = async (skill) => {
    try {
      const res = await axios.get(
        `http://localhost:5002/getAllPosts`
      );

      const allPosts = res.data.data || [];

      // 🔥 Filter posts by skill
      const filtered = allPosts.filter(
        (post) =>
          post.skill &&
          skill &&
          post.skill.toLowerCase() === skill.toLowerCase()
      );

      // 🔥 Attach names to posts
      const postsWithNames = await Promise.all(
        filtered.map(async (post) => {
          try {
            const nameRes = await axios.get(
              `http://localhost:5005/getName/${post.UserId}`
            );

            return {
              ...post,
              profName: nameRes.data.message
            };
          } catch (err) {
            return {
              ...post,
              profName: "Professional"
            };
          }
        })
      );

      setPosts(postsWithNames);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed-container">

      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Recommended for "{learnerSkill}" 🎯
      </h2>

      {posts.length === 0 ? (
        <p className="no-post">No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">

            {/* 🔹 Header */}
            <div className="post-header">
              <div className="avatar small"></div>
              <div>
                <h4>{post.profName}</h4> {/* ✅ REAL NAME */}
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>

            {/* 🔹 Content */}
            {post.content && <p>{post.content}</p>}

            {/* 🔹 Image */}
            {post.imageUrl && (
              <div className="post-media">
                <img src={post.imageUrl} alt="Post" />
              </div>
            )}

            {/* 🔹 Footer */}
            <div className="post-footer">
              <div className="post-actions">
                <button>👍 Like</button>
                <button>💬 Comment</button>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Home;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Home.css";

// function Home() {
//   const [professionals, setProfessionals] = useState([]);
//   const [selectedProfile, setSelectedProfile] = useState(null);

//   const [showSlots, setShowSlots] = useState(false);
//   const [slots, setSlots] = useState([]);
//   const [filteredSlots, setFilteredSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");

//   const [learnerName, setLearnerName] = useState("");
//   const [profName, setProfName] = useState("");

//   const { UserId } = JSON.parse(localStorage.getItem("customer"));

//   useEffect(() => {
//     fetchProfessionals();
//     fetchLearnerName();
//   }, []);

//   const fetchProfessionals = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5001/search?skill=Music`
//       );
//       setProfessionals(res.data.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchLearnerName = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5001/getName/${UserId}`
//       );
//       setLearnerName(res.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getDayFromDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       weekday: "short",
//     });
//   };

//   const handleSelect = async (user) => {
//     setSelectedProfile(user);

//     try {
//       const res = await axios.get(
//         `http://localhost:5001/getName/${user.UserId}`
//       );
//       setProfName(res.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleBookDemo = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5004/getSlots/${selectedProfile.UserId}`
//       );
//       setSlots(res.data.message || []);
//       setShowSlots(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);

//     const selectedDay = getDayFromDate(date);

//     const filtered = slots.filter(
//       (slot) =>
//         slot.day.toLowerCase() === selectedDay.toLowerCase()
//     );

//     setFilteredSlots(filtered);
//     setSelectedSlot(null);
//   };

//   const handleSendRequest = async () => {
//     if (!selectedDate) return alert("Select date");
//     if (!selectedSlot) return alert("Select slot");

//     try {
//       const payload = {
//         learnerId: UserId,
//         learnerName,
//         profName,
//         professionalId: selectedProfile.UserId,
//         date: selectedDate,
//         startTime: selectedSlot.startTime,
//         endTime: selectedSlot.endTime,
//         status: "Pending",
//         description: "Requesting for demo class.",
//       };

//       await axios.post("http://localhost:5004/requestSlot", payload);

//       await axios.post("http://localhost:5004/saveNotification", {
//         receiverId: selectedProfile.UserId,
//         senderId: UserId,
//         senderName: learnerName,
//         recieverName: profName,
//         title: "Demo Request",
//         message: `${learnerName} requested a demo session`,
//         type: "REQUEST",
//       });

//       alert("Request sent ✅");

//       setShowSlots(false);
//       setSelectedSlot(null);
//       setSelectedDate("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleBack = () => {
//     setSelectedProfile(null);
//     setShowSlots(false);
//   };

//   return (
//     <div className="home-container">

//       <div className="home-wrapper">

//         {/* 🔹 PROFESSIONAL LIST */}
//         {!selectedProfile && (
//           <div className="home-grid">
//             {professionals.map((user) => (
//               <div
//                 key={user._id}
//                 className="home-card"
//                 onClick={() => handleSelect(user)}
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                   className="home-img"
//                   alt="profile"
//                 />

//                 <div className="home-content">
//                   <div className="home-name">{user.fullname}</div>
//                   <div className="home-skill">{user.skill}</div>
//                   <div className="home-meta">
//                     {user.experience} yrs • {user.city}
//                   </div>

//                   <div className="home-actions">
//                     <span className="home-rating">⭐ 4.5</span>
//                     <button className="view-btn">View</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 🔹 PROFILE VIEW */}
//         {selectedProfile && (
//           <div className="profile-view">

//             <button className="btn btn-back" onClick={handleBack}>
//               ← Back
//             </button>

//             <div className="profile-header">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 className="profile-img"
//                 alt="profile"
//               />

//               <div className="profile-info">
//                 <h2>{selectedProfile.fullname}</h2>
//                 <p className="skill">{selectedProfile.skill}</p>
//                 <p>{selectedProfile.experience} yrs experience</p>
//                 <p>{selectedProfile.city}</p>
//               </div>
//             </div>

//             <button className="btn btn-primary" onClick={handleBookDemo}>
//               Book Demo Class
//             </button>

//             {/* 🔥 SLOT SECTION */}
//             {showSlots && (
//               <div className="slot-section">

//                 <div className="date-box">
//                   <label>Select Date</label>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => handleDateChange(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                   />
//                 </div>

//                 <div className="slots-section">
//                   <h4>Available Slots</h4>

//                   {selectedDate && filteredSlots.length === 0 && (
//                     <p className="no-slots">
//                       No slots available for this day
//                     </p>
//                   )}

//                   <div className="slots-grid">
//                     {filteredSlots.map((slot, i) => (
//                       <div
//                         key={i}
//                         className={`slot-card ${
//                           selectedSlot === slot ? "selected" : ""
//                         }`}
//                         onClick={() => setSelectedSlot(slot)}
//                       >
//                         {slot.startTime} - {slot.endTime}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <button
//                   className="btn btn-primary full-btn"
//                   onClick={handleSendRequest}
//                 >
//                   Confirm Booking
//                 </button>

//               </div>
//             )}

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }


// export default Home;