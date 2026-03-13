import { useState } from "react";
import Upcoming from "./Upcoming";
import Completed from "./Completed";
import Requests from "./Requests";
import "./Sessions.css";
import axios from "axios";

function Sessions() {
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

export default Sessions;




// import React, { useState } from "react";
// import "./Sessions.css";

// function Sessions() {
//   const [showForm, setShowForm] = useState(false);
//   const [day, setDay] = useState(""); 
//   const [slots, setSlots] = useState([{ startTime: "", endTime: "" }]); 

// // 
  // const addSlot = () => {
  //   setSlots([...slots, { startTime: "", endTime: "" }]);
  // };
  // const removeSlot = (index) => {
  //   setSlots(slots.filter((_, i) => i !== index));
  // };
  // const handleSlotChange = (index, field, value) => {
  //   const newSlots = [...slots];
  //   newSlots[index][field] = value;
  //   setSlots(newSlots);
  // };

  // const handleSave = () => {
  //   if (!day) {
  //     alert("Please select a day");
  //     return;
  //   }
  //   console.log({ day, slots }); 
  //   alert("Slots saved! Check console.");
  //   setShowForm(false);
  //   setDay("");
  //   setSlots([{ startTime: "", endTime: "" }]);
  // };

  // return (
  //   <div className="sessions-container">
  //     <div className="sessions-header">
  //       <h2>Your Sessions</h2>
  //       <button
  //         className="sessions-button"
  //         onClick={() => setShowForm(!showForm)}
  //       >
  //         Add / Modify Slots
  //       </button>
  //     </div>

  //     {showForm && (
  //       <div className="slots-form">
  //         <label>
  //           Select Day:
  //           <select
  //             value={day}
  //             onChange={(e) => setDay(e.target.value)}
  //             className="day-select"
  //           >
  //             <option value="">--Select Day--</option>
  //             <option value="0">Sunday</option>
  //             <option value="1">Monday</option>
  //             <option value="2">Tuesday</option>
  //             <option value="3">Wednesday</option>
  //             <option value="4">Thursday</option>
  //             <option value="5">Friday</option>
  //             <option value="6">Saturday</option>
  //           </select>
  //         </label>

  //         <h4>Time Slots:</h4>
  //         {slots.map((slot, index) => (
  //           <div className="slot-row" key={index}>
  //             <input
  //               type="time"
  //               value={slot.startTime}
  //               onChange={(e) =>
  //                 handleSlotChange(index, "startTime", e.target.value)
  //               }
  //             />
  //             <span>to</span>
  //             <input
  //               type="time"
  //               value={slot.endTime}
  //               onChange={(e) =>
  //                 handleSlotChange(index, "endTime", e.target.value)
  //               }
  //             />
  //             <button
  //               className="remove-slot"
  //               onClick={() => removeSlot(index)}
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         ))}

//           <button className="add-slot" onClick={addSlot}>
//             + Add Another Slot
//           </button>
//           <button className="save-slot" onClick={handleSave}>
//             Save Slots
//           </button>
//         </div>
//       )}

      
//       <div className="sessions-content">
//         <h3>You don't have any sessions.</h3>
//       </div>
//     </div>
//   );
// }

// export default Sessions;

