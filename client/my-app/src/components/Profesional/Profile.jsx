import { useParams } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const [userp, setUser] = useState(null);
  const [showSlots, setShowSlots] = useState(false); // toggle slot card
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [userId,setUserId] = useState(null);
  console.log(user.id);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/profile/${id}`);
        setUserId(res.data.data.UserId);
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [id]);

  if (!userp) return <h2>Loading...</h2>;

  const handleBookDemo = async()=>{
    try{
       const res = await axios.get(`http://localhost:5004/getSlots/${userId}`);
       console.log(res.data);
       setSlots(res.data.message);
       setShowSlots(true); 
    }catch(error){
       console.log(error);
       return res.status(404).json({
        success:"False",
        message:"Error Occured"
       })
    }
  }

  const handleSendRequest = async () => {
    if (!selectedSlot) return alert("Select a slot first!");

    try {
      const payload = {
        learnerId: user.id,
        slot: selectedSlot,
        status:"Pending"
      };
      console.log(payload);
      const res = await axios.post("http://localhost:5001/book-demo", payload);
      alert("Request sent successfully! ✅");
      setShowSlots(false);
    } catch (error) {
      console.log(error);
      alert("Error sending request.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
      <div style={{
        backgroundColor: "#0b0f14",
        color: "#fff",
        width: "400px",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}>
        <h2>{userp.fullname}</h2>
        <p><b>Skill:</b> {userp.skill}</p>
        <p><b>Experience:</b> {userp.experience} years</p>
        <p><b>Available Days:</b> {userp.availabledays?.join(", ")}</p>
        <p><b>Mode:</b> {userp.mode?.join(", ")}</p>
        <p><b>Location:</b> {userp.city}, {userp.state}</p>
        <p style={{ fontSize: "14px", margin: "12px 0", opacity: 0.85 }}>{userp.bio}</p>

        <button
          onClick={handleBookDemo}
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Book Demo Class
        </button>

        {showSlots && (
          <div style={{
            marginTop: "20px",
            backgroundColor: "#1a1f28",
            padding: "16px",
            borderRadius: "12px"
          }}>
            <h3>Select a Slot</h3>
            {slots.length === 0 && <p>No slots available</p>}
            {slots.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    margin: "8px 0",
                    borderRadius: "8px",
                    backgroundColor: selectedSlot === slot ? "#3b82f6" : "#0b0f14",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <span>{slot.day}</span>
                  <span>{slot.startTime} - {slot.endTime}</span>
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
                cursor: "pointer"
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
