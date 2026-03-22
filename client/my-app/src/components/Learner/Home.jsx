import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [professionals, setProfessionals] = useState([]);
  const navigate = useNavigate();
  const skill = "Music";

  useEffect(() => {
    const getProfessional = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/search?skill=${skill}`
        );
        setProfessionals(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProfessional();
  }, []);

  return (
    <>
      <h1>Professionals</h1>

      <div style={{ display: "grid", gap: "16px" }}>
        {professionals.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)} // ✅ redirect
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px"
            }}
          >
            <h3>{user.fullname}</h3>
            <p><b>Skill:</b> {user.skill}</p>
            <p><b>Experience:</b> {user.experience} years</p>
            <p><b>Location:</b> {user.city}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
