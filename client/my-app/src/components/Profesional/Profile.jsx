// import { useParams } from "react-router-dom";
// import { useUser } from '@clerk/clerk-react';
// import { useEffect, useState } from "react";
// import axios from "axios";

// function Profile() {
//   const { isLoaded, user } = useUser();
//   const { id } = useParams();
//   const [userp, setUser] = useState(null);
//   const [showSlots, setShowSlots] = useState(false); // toggle slot card
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [userId,setUserId] = useState(null);
//   console.log(user.id);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5001/profile/${id}`);
//         setUserId(res.data.data.UserId);
//         setUser(res.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchProfile();
//   }, [id]);

//   if (!userp) return <h2>Loading...</h2>;

//   const handleBookDemo = async()=>{
//     try{
//        const res = await axios.get(`http://localhost:5004/getSlots/${userId}`);
//        console.log(res.data);
//        setSlots(res.data.message);
//        setShowSlots(true); 
//     }catch(error){
//        console.log(error);
//        return res.status(404).json({
//         success:"False",
//         message:"Error Occured"
//        })
//     }
//   }

//   const handleSendRequest = async () => {
//     const {UserId} = JSON.parse(localStorage.getItem("customer"));
//     if (!selectedSlot) return alert("Select a slot first!");
//     console.log(slots);
//     try {
//       const payload = {
//         learnerId: UserId,
//         slot: selectedSlot,
//         Status:"Pending",
//         Description:"Requesting for demo class."
//       };
//       console.log(payload);
//       const res = await axios.post("http://localhost:5004/requestSlot", payload);
//       alert("Request sent successfully! ✅");
//       setShowSlots(false);
//     } catch (error) {
//       console.log(error);
//       alert("Error sending request.");
//     }
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
//       <div style={{
//         backgroundColor: "#0b0f14",
//         color: "#fff",
//         width: "400px",
//         borderRadius: "12px",
//         padding: "24px",
//         boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
//         textAlign: "center",
//         fontFamily: "Arial, sans-serif",
//       }}>
//         <h2>{userp.fullname}</h2>
//         <p><b>Skill:</b> {userp.skill}</p>
//         <p><b>Experience:</b> {userp.experience} years</p>
//         <p><b>Available Days:</b> {userp.availabledays?.join(", ")}</p>
//         <p><b>Mode:</b> {userp.mode?.join(", ")}</p>
//         <p><b>Location:</b> {userp.city}, {userp.state}</p>
//         <p style={{ fontSize: "14px", margin: "12px 0", opacity: 0.85 }}>{userp.bio}</p>

//         <button
//           onClick={handleBookDemo}
//           style={{
//             marginTop: "16px",
//             padding: "12px 24px",
//             border: "none",
//             borderRadius: "8px",
//             backgroundColor: "#3b82f6",
//             color: "#fff",
//             fontWeight: "bold",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Book Demo Class
//         </button>

//         {showSlots && (
//           <div style={{
//             marginTop: "20px",
//             backgroundColor: "#1a1f28",
//             padding: "16px",
//             borderRadius: "12px"
//           }}>
//             <h3>Select a Slot</h3>
//             {slots.length === 0 && <p>No slots available</p>}
//             {slots.map((slot, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     padding: "8px",
//                     margin: "8px 0",
//                     borderRadius: "8px",
//                     backgroundColor: selectedSlot === slot ? "#3b82f6" : "#0b0f14",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => setSelectedSlot(slot)}
//                 >
//                   <span>{slot.day}</span>
//                   <span>{slot.startTime} - {slot.endTime}</span>
//                 </div>
//               ))}
//             <button
//               onClick={handleSendRequest}
//               style={{
//                 marginTop: "12px",
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//                 border: "none",
//                 backgroundColor: "#10b981",
//                 fontWeight: "bold",
//                 cursor: "pointer"
//               }}
//             >
//               Send Request
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const { user } = useUser();
  const { id } = useParams();

  const [userp, setUser] = useState(null);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  let { UserId } = JSON.parse(localStorage.getItem("customer"));
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [learnerName,setLearnerName] = useState("");
  const [profName,setProfName] = useState("");

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/profile/${id}`);
        setUserId(res.data.data.UserId);
        setUser(res.data.data);

        // 🔥 Fetch names correctly
      const prof = await fetchName(res.data.data.UserId);
      const learner = await fetchName(UserId);

      setProfName(prof);
      setLearnerName(learner);

      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [id]);

  const fetchName = async (UserId) => { 
  try {
     const response = await axios.get( `http://localhost:5001/getName/${UserId}` );
   return response.data.message; 
  } 
   catch (error) { 
    console.log(error); return "Unknown"; 
   } 
  };

  if (!userp) return <h2>Loading...</h2>;


  // 🔥 Convert date → Mon, Tue, etc.
  const getDayFromDate = (date) => {
    const fullDay = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const map = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    return map[fullDay];
  };

  // 🔹 Fetch slots
  const handleBookDemo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5004/getSlots/${userId}`
      );
      setSlots(res.data.message);
      setShowSlots(true);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 Filter slots based on selected date
  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (!date) return;

    const selectedDay = getDayFromDate(date);

    console.log("Selected Day:", selectedDay);
    console.log("All Slots:", slots);

    const filtered = slots.filter(
      (slot) =>
        slot.day.toLowerCase() === selectedDay.toLowerCase()
    );

    setFilteredSlots(filtered);
    setSelectedSlot(null);
  };

  // 🔹 Send request
  const handleSendRequest = async () => {
    

    if (!selectedDate) return alert("Please select a date!");
    if (!selectedSlot) return alert("Please select a slot!");

    try {
      const payload = {
        learnerId: UserId,
        learnerName,
        profName,
        professionalId: userId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: "Pending",
        description: "Requesting for demo class.",
      };

      console.log("Payload:", payload);

      await axios.post("http://localhost:5004/requestSlot", payload);

      alert("Request sent successfully! ✅");

      // Reset
      setShowSlots(false);
      setSelectedSlot(null);
      setSelectedDate("");
      setFilteredSlots([]);
    } catch (error) {
      console.log(error);
      alert("Error sending request.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0b0f14",
          color: "#fff",
          width: "400px",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2>{userp.fullname}</h2>
        <p>
          <b>Skill:</b> {userp.skill}
        </p>
        <p>
          <b>Experience:</b> {userp.experience} years
        </p>
        <p>
          <b>Available Days:</b> {userp.availabledays?.join(", ")}
        </p>

        {/* 🔹 Button */}
        <button
          onClick={handleBookDemo}
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#3b82f6",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Book Demo Class
        </button>

        {/* 🔹 Slot Section */}
        {showSlots && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#1a1f28",
              padding: "16px",
              borderRadius: "12px",
            }}
          >
            <h3>Select Date</h3>

            {/* 📅 Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />

            <h3 style={{ marginTop: "10px" }}>Select Slot</h3>

            {selectedDate && filteredSlots.length === 0 && (
              <p>No slots available for this day</p>
            )}

            {filteredSlots.map((slot, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "8px",
                  backgroundColor:
                    selectedSlot === slot ? "#3b82f6" : "#0b0f14",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedSlot(slot)}
              >
                <span>{slot.day}</span>
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}

            <button
              onClick={handleSendRequest}
              style={{
                marginTop: "12px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#10b981",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;