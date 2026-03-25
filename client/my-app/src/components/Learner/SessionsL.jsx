import { useState } from "react";
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
  const userData = JSON.parse(localStorage.getItem("customer"));
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

