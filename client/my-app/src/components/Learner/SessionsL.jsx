import { useEffect, useState } from "react";
import Upcoming from "./Upcoming";
import Completed from "./Completed";
import Requests from "./Requests";
import "../Profesional/Sessions.css";
import axios from "axios";

function SessionsL() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openMenu,setOpenMenu]=useState(false);
  const [showAddSlots,setshowAddSlots] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime,setStartTime] = useState("");
  const [endTime,setEndTime] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState(null);
  const [learnerName, setLearnerName] = useState("");
  const userData = JSON.parse(localStorage.getItem("customer"));

  useEffect(() => {
    const selected = localStorage.getItem("selectedProfessional");
    if (selected) {
      setSelectedProfessional(JSON.parse(selected));
      setActiveTab("requests");
    }
    fetchLearnerName();
  }, []);

  useEffect(() => {
    if (selectedProfessional?.UserId) {
      fetchSlotsForProfessional();
    }
  }, [selectedProfessional]);

  const fetchLearnerName = async () => {
    try {
      const res = await axios.get(`http://localhost:5005/getName/${userData.UserId}`);
      setLearnerName(res.data.message || "");
    } catch (error) {
      console.log(error);
    }
  };

  const getDayFromDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const fetchSlotsForProfessional = async () => {
    if (!selectedProfessional?.UserId) return;
    try {
      const res = await axios.get(`http://localhost:5004/getSlots/${selectedProfessional.UserId}`);
      setSlots(res.data.message || []);
    } catch (error) {
      console.log(error);
      setSlots([]);
    }
  };

  const handleBookingDate = (date) => {
    setBookingDate(date);
    const selectedDay = getDayFromDate(date);
    const filtered = slots.filter(
      (slot) => slot.day?.toLowerCase() === selectedDay.toLowerCase()
    );
    setFilteredSlots(filtered);
    setBookingSlot(null);
  };

  const handleBookSession = async () => {
    if (!selectedProfessional?.UserId) return;
    if (!bookingDate || !bookingSlot) {
      alert("Please select date and slot");
      return;
    }
    try {
      const payload = {
        learnerId: userData.UserId,
        learnerName,
        profName: selectedProfessional.fullname || "Professional",
        professionalId: selectedProfessional.UserId,
        date: bookingDate,
        startTime: bookingSlot.startTime,
        endTime: bookingSlot.endTime,
        status: "Pending",
        description: "Requesting for demo class.",
      };
      await axios.post("http://localhost:5004/requestSlot", payload);
      await axios.post("http://localhost:5004/saveNotification", {
        receiverId: selectedProfessional.UserId,
        senderId: userData.UserId,
        senderName: learnerName,
        recieverName: selectedProfessional.fullname || "Professional",
        title: "Demo Request",
        message: `${learnerName} is requesting for a demo session`,
        type: "REQUEST",
      });
      alert("Session request sent");
      localStorage.removeItem("selectedProfessional");
      setSelectedProfessional(null);
      setSlots([]);
      setFilteredSlots([]);
      setBookingDate("");
      setBookingSlot(null);
      setActiveTab("requests");
    } catch (error) {
      console.log(error);
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case "upcoming":
        return <Upcoming/>;
      case "completed":
        return <Completed/>;
      case "requests":
        return <Requests/>;
      default:
        return null;
    }
  };
  const handleSlot =async()=>{
    const time = {
           startTime:startTime,
           endTime:endTime
    }
        const data ={ UserId:userData.UserId,
                     dayOfWeek:selectedDay,
                     slots:[{
           startTime:startTime,
           endTime:endTime
    }]}
        const availability = [data];
        const response = await axios.post("http://localhost:5004/saveSlots",{availability});
        console.log(response);
        console.log(selectedDay+" "+startTime+" "+endTime);
        setSelectedDay("");
        setStartTime("");
        setEndTime("");
  }

  return (
        <>
      <div className="sessions-container">
          {selectedProfessional && (
            <div className="request-card" style={{ marginBottom: "12px" }}>
              <div className="card-header">
                <h3>Book with {selectedProfessional.fullname}</h3>
                <span className="status pending">Pending</span>
              </div>
              <div className="card-body">
                <button className="accept-btn" onClick={fetchSlotsForProfessional}>Load Slots</button>
                <input
                  type="date"
                  style={{ marginLeft: "10px" }}
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => handleBookingDate(e.target.value)}
                />
                {bookingDate && filteredSlots.length === 0 && (
                  <p style={{ marginTop: "10px" }}>No slots available for this date.</p>
                )}
                {filteredSlots.length > 0 && (
                  <div className="card-actions" style={{ marginTop: "10px", flexWrap: "wrap" }}>
                    {filteredSlots.map((slot, i) => (
                      <button
                        key={i}
                        className={bookingSlot === slot ? "accept-btn" : "cancel-btn"}
                        onClick={() => setBookingSlot(slot)}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
                <div className="card-actions" style={{ marginTop: "10px" }}>
                  <button className="accept-btn" onClick={handleBookSession}>Book Session</button>
                  <button
                    className="reject-btn"
                    onClick={() => {
                      localStorage.removeItem("selectedProfessional");
                      setSelectedProfessional(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="sessions-topbar">
            <div className="tabs">
              <button className={activeTab === "upcoming" ? "active" : ""} onClick={() => setActiveTab("upcoming")}>
                Upcoming
              </button>
              <button className={activeTab === "completed" ? "active" : ""} onClick={() => setActiveTab("completed")}>
                Completed
              </button>
              <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
                Requests
              </button>
            </div>

       <div className="more-wrapper">
          <div className="more" onClick={() => setOpenMenu(!openMenu)}>⋮</div>
          {openMenu && (
            <div className="dropdown">
              <div className="dropdown-item">Create</div>
              <div className="dropdown-item" onClick = {()=>{setshowAddSlots(true);setOpenMenu(false)}}>Add Slots</div>
              <div className="dropdown-item">Modify Slots</div>
            </div>
          )}
        </div>
        {showAddSlots && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Add Slots</h3>

                {/* Weekdays */}
                <div className="form-group">
                  <label>Week Days</label>
                  <div className="weekday-grid">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                            <button
                              key={day}
                              className={`day-btn ${selectedDay === day ? "active" : ""}`}
                              onClick={() => setSelectedDay(day)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                </div>

                {/* Time */}
                <div className="time-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input onChange ={(e)=>{setStartTime(e.target.value)}}type="time" />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input onChange={(e)=>{setEndTime(e.target.value)}}type="time" />
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button className="btn secondary" onClick={() => setshowAddSlots(false)}>
                    Cancel
                  </button>
                  <button className="btn primary" onClick={()=>{handleSlot()}}>
                    Save Slot
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      <div className="sessions-content">
        {renderContent()}
      </div>
      </div>
        </>
  );
}

export default SessionsL;

